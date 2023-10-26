import { addDays } from 'date-fns';
import { AppConfig } from 'src/app.config';
import { ConfigType } from '@nestjs/config';
import { FindManyOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { getAllAssignationsToProcess, getDismissUntilValue, getNowDate, getParamPerUnit, getPivotValue } from './../../../../utils';
import { ILogger } from './../../../../logger';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import {
  ServiceAlertDismissInterface,
  ServiceAlertInterface,
  ServiceAlertPivotInterface,
  ServiceAlertStatusEnum,
  ServiceFreqTypeEnum,
  ServiceInterface,
  ServiceParamTimeInterface,
  ServiceUnitInterface,
  UnitInterface,
  UnitStatusEnum,
  UnitUserInterface,
  UserInterface,
} from './../../../../shared';
import { ServiceAlertEntity, ServiceEntity, ServiceUnitEntity, UnitEntity, UnitUserEntity } from './../../../../entities';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(ServiceEntity)
    private serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(ServiceAlertEntity)
    private serviceAlertRepo: Repository<ServiceAlertEntity>,
    @InjectRepository(ServiceUnitEntity)
    private unitServiceRepo: Repository<ServiceUnitEntity>,
    @InjectRepository(UnitEntity)
    private unitRepo: Repository<UnitEntity>,
    @InjectRepository(UnitUserEntity)
    private unitUserRepo: Repository<UnitUserEntity>,
    @Inject(AppConfig.KEY)
    private config: ConfigType<typeof AppConfig>,
    private logger: ILogger
  ) {}

  public static ALL_SERVICE_RELATIONS = { user: true, unit: true, service: true };

  async find(
    params: {
      onlyOpen: boolean;
      userId?: string;
      alertId?: string;
      relations?: { service?: boolean; user?: boolean; unit?: boolean };
      addNextCycle?: boolean;
    } = {
      onlyOpen: true,
      userId: null,
      alertId: null,
      relations: null,
      addNextCycle: false,
    }
  ): Promise<ServiceAlertEntity[]> {
    this.logger.debug('Getting all service alerts...');
    const where = { isActive: true } as FindOptionsWhere<ServiceAlertEntity>;
    const findParams = { where } as FindManyOptions<ServiceAlertEntity>;

    if (params.onlyOpen) where.status = ServiceAlertStatusEnum.OPEN;
    if (params.alertId) where.id = params.alertId;
    if (params.userId) where.user = { id: params.userId, isActive: true };
    if (params.relations) {
      findParams.relations = params.relations;
      if (params.relations.service) {
        where.service = { isActive: true, alertActive: true };
      }
      if (params.relations.unit) {
        where.unit = { isActive: true };
      }
    }

    return await this.serviceAlertRepo.find(findParams);
  }

  async getAllAssignations(userId: string = null): Promise<UnitUserInterface[]> {
    const relations = { user: true, unit: true };
    const where: FindOptionsWhere<UnitUserEntity> = { status: UnitStatusEnum.ASSIGNED, isActive: true, user: { isActive: true }, unit: { isActive: true } };
    if (userId) where.user = { id: userId };
    const allAssignations = await this.unitUserRepo.find({
      where,
      relations,
    });

    return allAssignations;
  }

  async getAllServices(serviceId: string = null): Promise<ServiceInterface[]> {
    const where = {
      isActive: true,
      alertActive: true,
    } as FindOptionsWhere<ServiceEntity>;
    if (serviceId) where.id = serviceId;

    return await this.serviceRepo.find({
      where,
    });
  }

  async getPreviousAlert(serviceId: string, userId: string, unitId: string): Promise<ServiceAlertEntity> {
    return await this.serviceAlertRepo.findOne({
      where: {
        service: { id: serviceId },
        user: { id: userId },
        unit: { id: unitId },
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getPreviousService(serviceId: string, userId: string, unitId: string): Promise<ServiceUnitEntity> {
    return await this.unitServiceRepo.findOne({
      where: {
        service: { id: serviceId },
        user: { id: userId },
        unit: { id: unitId },
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateServiceAlert(serviceAlert: Partial<ServiceAlertInterface>): Promise<UpdateResult> {
    this.logger.debug(`Updating service Alert values [${JSON.stringify(serviceAlert)}]...`);
    return await this.serviceAlertRepo.update({ id: serviceAlert.id }, serviceAlert);
  }

  async getUnitOdometer(unitId: string): Promise<number> {
    const unit = await this.unitRepo.findOne({ where: { id: unitId } });
    return unit?.odometer;
  }

  async processAlerts(
    params: {
      userId?: string;
      serviceId?: string;
    } = {
      userId: null,
      serviceId: null,
    }
  ): Promise<void> {
    this.logger.debug(`Processing alerts... for [${JSON.stringify(params)}] `);
    // Gattering all users to process
    const allAssignations = await this.getAllAssignations(params.userId);

    // Gathering all the services to process
    const services = await this.getAllServices(params.serviceId);

    // Loop on each service to check for applicance
    for (let service of services) {
      this.processAlert(service, allAssignations);
    }

    this.logger.debug(
      `Processed alerts stats: ${JSON.stringify({
        assignationNum: allAssignations.length,
        servicesNum: services.length,
      })}`
    );
  }

  processAlert(service: ServiceInterface, assignations: UnitUserInterface[]) {
    const assignationsToProcess = getAllAssignationsToProcess(service.params.custom, assignations);

    for (const assignation of assignationsToProcess) {
      this.processAlertByUser(service, assignation.user as UserInterface, assignation.unit as UnitInterface);
    }
  }

  async autoFinishAlert(alert: ServiceAlertInterface, service: ServiceUnitInterface): Promise<boolean> {
    // The service is newer than previous alert, we can disregard the alert
    if (service && alert && alert.status === ServiceAlertStatusEnum.OPEN && service.date.getTime() > alert.createdAt.getTime()) {
      alert.status = ServiceAlertStatusEnum.FINISHED;
      await this.serviceAlertRepo.update({ id: alert.id }, alert);
      return true;
    }
    return false;
  }

  getUnitCurrentValueByServiceType(freqType: ServiceFreqTypeEnum, odometer: number): number {
    if (freqType === ServiceFreqTypeEnum.TIME) return this.config?.CURRENT_DATE_FOR_TESTING ? new Date(this.config.CURRENT_DATE_FOR_TESTING).getTime() : getNowDate().getTime();
    return odometer;
  }

  async processAlertByUser(service: ServiceInterface, user: UserInterface, unit: UnitInterface) {
    const prevAlert = await this.getPreviousAlert(service.id, user.id, unit.id);
    const prevService = await this.getPreviousService(service.id, user.id, unit.id);

    // Trying to update latest alert status
    const autoDismissFlag = await this.autoFinishAlert(prevAlert, prevService);
    if (autoDismissFlag) return;

    const currentValue = this.getUnitCurrentValueByServiceType(service.freqType, unit.odometer);

    this.processAlertByUserByParams(user, unit, service.id, prevAlert, prevService, service.params as ServiceParamTimeInterface, service.freqType, currentValue);
  }

  processAlertByUserByParams(
    user: UserInterface,
    unit: UnitInterface,
    serviceId: string,
    prevAlert: ServiceAlertInterface,
    prevService: ServiceUnitInterface,
    serviceParams: ServiceParamTimeInterface,
    alertType: ServiceFreqTypeEnum,
    currentValue: number
  ): void {
    const paramPerUnit = getParamPerUnit(unit.id, serviceParams.custom);

    const pivotValue = getPivotValue(alertType, prevService, paramPerUnit, serviceParams);

    // Only continue if there is something to compare against
    if (pivotValue) {
      // There is a previous alert that is not finished
      if (prevAlert && prevAlert.status !== ServiceAlertStatusEnum.FINISHED) {
        if (prevAlert.status === ServiceAlertStatusEnum.OPEN) {
          this.updateServiceAlert({
            ...prevAlert,
            lastActivatedDate: new Date(),
          });
        } else if (prevAlert.status === ServiceAlertStatusEnum.DISMISSED) {
          const dismissUntilValue = getDismissUntilValue(alertType, prevAlert);
          if (!dismissUntilValue || dismissUntilValue < currentValue) {
            this.updateServiceAlert({
              ...prevAlert,
              lastActivatedDate: new Date(),
              status: ServiceAlertStatusEnum.OPEN,
              dismissedBy: null,
              dismissedDate: null,
              dismissUntilDate: null,
              dismissUntilOdometer: null,
            });
            this.logger.debug(
              `Changing service alert [${prevAlert.id}] to OPEN as it finished dismissing parameters: [${JSON.stringify({
                alertType,
                currentValue,
                dismissUntil: dismissUntilValue,
              })}]`
            );
          } else {
            this.updateServiceAlert({
              ...prevAlert,
              lastActivatedDate: new Date(),
            });
          }
        }
      }
      // Create a new Alert!
      else {
        if (currentValue >= pivotValue.expectedPivotValue) {
          this.saveNewAlert(user.id, unit.id, serviceId, alertType, pivotValue);
        }
      }
    }
  }

  saveNewAlert(userId: string, unitId: string, serviceId: string, alertType: ServiceFreqTypeEnum, expectedParams: ServiceAlertPivotInterface): void {
    const nowDate = new Date();

    const expectedBeforeOdometer = alertType === ServiceFreqTypeEnum.ODOMETER ? expectedParams.expectedPivotValue : null;
    const expectedOffsetOdometer = alertType === ServiceFreqTypeEnum.ODOMETER ? expectedParams.offset : null;

    const expectedBeforeDate = alertType === ServiceFreqTypeEnum.TIME ? new Date(expectedParams.expectedPivotValue) : null;
    const expectedOffsetDays = alertType === ServiceFreqTypeEnum.TIME ? expectedParams.offset : null;

    const newAlert: Partial<ServiceAlertInterface> = {
      user: { id: userId },
      unit: { id: unitId },
      service: { id: serviceId },
      expectedBeforeDate,
      expectedOffsetDays,
      expectedBeforeOdometer,
      expectedOffsetOdometer,
      status: ServiceAlertStatusEnum.OPEN,
      activatedDate: nowDate,
      lastActivatedDate: nowDate,
    };

    this.logger.debug(`Saving new Alert into the database: [${JSON.stringify(newAlert)}]`);

    this.serviceAlertRepo.save(newAlert);
  }

  async dismissAlert(dismissUserId: string, baseAlert: Partial<ServiceAlertDismissInterface>): Promise<UpdateResult> {
    const alertToUpdateArray = await this.find({
      onlyOpen: true,
      alertId: baseAlert.id,
      relations: { service: true, unit: true },
    });

    if (isEmpty(alertToUpdateArray)) throw Error('Error dismissing alert, the id to dismiss does not exist in the db');

    const alertToUpdate = alertToUpdateArray[0];

    if (
      (alertToUpdate.service.freqType === ServiceFreqTypeEnum.TIME && !baseAlert.dismissForDays) ||
      (alertToUpdate.service.freqType === ServiceFreqTypeEnum.ODOMETER && !baseAlert.dismissForKilometers)
    )
      throw Error(
        `Service type [${alertToUpdate.service.freqType}] does not match with provided parameters [${JSON.stringify({
          baseAlert,
        })}]`
      );

    const dismissUntilDate = baseAlert.dismissForDays ? addDays(getNowDate(), baseAlert.dismissForDays) : null;
    // Verify the ID is available and does not require relations
    const unitId = alertToUpdate.unit.id;
    const currentOdometer = await this.getUnitOdometer(unitId);
    const dismissUntilOdometer = baseAlert.dismissForKilometers && currentOdometer ? currentOdometer + baseAlert.dismissForKilometers : null;

    if (!dismissUntilDate && !dismissUntilOdometer) throw Error('Unexpected error while dismissing alert, no dismissing parameters were calculated');

    return await this.updateServiceAlert({
      ...alertToUpdate,
      status: baseAlert.status,
      dismissedBy: { id: dismissUserId },
      dismissedDate: new Date(),
      dismissUntilDate,
      dismissUntilOdometer,
    });
  }
}
