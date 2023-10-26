import { AlertService } from '../../../../src/services';
import { AppConfig } from './../../../../src/app.config';
import { ConfigType } from '@nestjs/config';
import { ILogger } from '../../../../src/logger';
import { mockAssignations, mockTimeServices } from './mocks-data';
import { Repository } from 'typeorm';
import { ServiceAlertEntity, ServiceEntity, ServiceUnitEntity, UnitEntity, UnitUserEntity } from '../../../../src/entities';
import { ServiceAlertInterface, ServiceAlertStatusEnum, ServiceFreqTypeEnum, ServiceInterface, ServiceUnitInterface, UnitInterface, UserInterface } from './../../../../src/shared';

describe('AlertService', () => {
  let serviceRepo = {} as unknown as Repository<ServiceEntity>;
  let serviceAlertRepo = {} as unknown as Repository<ServiceAlertEntity>;
  let unitServiceRepo = {} as unknown as Repository<ServiceUnitEntity>;
  let unitUserRepo = {} as unknown as Repository<UnitUserEntity>;
  let unitRepo = {} as unknown as Repository<UnitEntity>;
  let config: ConfigType<typeof AppConfig>;
  const logger: ILogger = new ILogger();

  let alertService: AlertService;

  beforeEach(async () => {
    jest.resetAllMocks();
    alertService = new AlertService(serviceRepo, serviceAlertRepo, unitServiceRepo, unitRepo, unitUserRepo, config, logger);
  });

  describe('processAlerts', () => {
    it('should not process a user alert because auto-dismiss', async () => {
      alertService.getPreviousAlert = jest.fn().mockReturnValue(Promise.resolve({}));

      alertService.getPreviousService = jest.fn().mockReturnValue(Promise.resolve({}));

      alertService.autoFinishAlert = jest.fn().mockReturnValue(Promise.resolve(true));

      alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(Promise.resolve({}));

      alertService.processAlertByUserByParams = jest.fn().mockReturnValue(Promise.resolve({}));

      await alertService.processAlertByUser({} as ServiceInterface, {} as UserInterface, {} as UnitInterface);

      expect(alertService.getPreviousAlert).toHaveBeenCalledTimes(1);
      expect(alertService.getPreviousService).toHaveBeenCalledTimes(1);
      expect(alertService.autoFinishAlert).toHaveBeenCalledTimes(1);
      expect(alertService.getUnitCurrentValueByServiceType).toHaveBeenCalledTimes(0);
      expect(alertService.processAlertByUserByParams).toHaveBeenCalledTimes(0);
    });

    it('should process a bunch single alert for multiple users', async () => {
      const serviceData = mockTimeServices[0];
      const allAssignations = [...mockAssignations, ...mockAssignations, ...mockAssignations];
      alertService.processAlertByUser = jest.fn().mockReturnValue(true);
      alertService.processAlert(serviceData, allAssignations);

      expect(alertService.processAlertByUser).toHaveBeenCalledTimes(6);
    });

    it('should not process for multiple users because no assigned units', async () => {
      const serviceData = mockTimeServices[0];
      const allAssignations = [];
      alertService.processAlertByUser = jest.fn().mockReturnValue(true);
      alertService.processAlert(serviceData, allAssignations);

      expect(alertService.processAlertByUser).toHaveBeenCalledTimes(0);
    });

    it('should get current value for TIME type', async () => {
      const expValue = 12345;
      const currentValue = alertService.getUnitCurrentValueByServiceType(ServiceFreqTypeEnum.TIME, expValue);
      expect(currentValue).toBeGreaterThan(expValue);
    });

    it('should get current value for ODOMETER type', async () => {
      const expValue = 12345;
      const currentValue = alertService.getUnitCurrentValueByServiceType(ServiceFreqTypeEnum.ODOMETER, expValue);
      expect(currentValue).toBe(expValue);
    });
  });

  describe('processAlerts get info from db', () => {
    it('should get all alerts from db', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(Promise.resolve([]));
      await alertService.find();
      expect(serviceAlertRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should get all alerts by user from db', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(Promise.resolve([]));
      await alertService.find({ onlyOpen: true, userId: 'userId' });
      expect(serviceAlertRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should get all services from db', async () => {
      serviceRepo.find = jest.fn().mockResolvedValue(Promise.resolve([]));
      await alertService.getAllServices();
      expect(serviceRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should get all assignations from db', async () => {
      unitUserRepo.find = jest.fn().mockResolvedValue(Promise.resolve(mockAssignations));
      const allUsers = await alertService.getAllAssignations();
      expect(unitUserRepo.find).toHaveBeenCalledTimes(1);
      expect(allUsers?.length).toBe(2);
    });

    it('should get all assignations from db with userId', async () => {
      unitUserRepo.find = jest.fn().mockResolvedValue(Promise.resolve(mockAssignations));
      const allUsers = await alertService.getAllAssignations('123');
      expect(unitUserRepo.find).toHaveBeenCalledTimes(1);
      expect(allUsers?.length).toBe(2);
    });

    it('should get unit odometer alert', async () => {
      unitRepo.findOne = jest.fn().mockResolvedValue(Promise.resolve({ odometer: 123 }));
      const odometer = await alertService.getUnitOdometer('unitId');
      expect(unitRepo.findOne).toHaveBeenCalledTimes(1);
      expect(odometer).toEqual(123);
    });

    it('should get previous alert', async () => {
      serviceAlertRepo.findOne = jest.fn().mockResolvedValue({});
      const prevAlert = await alertService.getPreviousAlert('servId', 'userId', 'unitId');
      expect(serviceAlertRepo.findOne).toHaveBeenCalledTimes(1);
      expect(prevAlert).toEqual({});
    });

    it('should get previous service', async () => {
      unitServiceRepo.findOne = jest.fn().mockResolvedValue({});
      const prevService = await alertService.getPreviousService('servId', 'userId', 'unitId');
      expect(unitServiceRepo.findOne).toHaveBeenCalledTimes(1);
      expect(prevService).toEqual({});
    });

    it('should update service alert', async () => {
      serviceAlertRepo.update = jest.fn().mockResolvedValue({});
      const updateService = await alertService.updateServiceAlert({} as ServiceAlertInterface);
      expect(serviceAlertRepo.update).toHaveBeenCalledTimes(1);
      expect(updateService).toEqual({});
    });

    it('auto finishes alert if meets conditions', async () => {
      serviceAlertRepo.update = jest.fn().mockResolvedValue({});
      const result = await alertService.autoFinishAlert(
        { createdAt: new Date('2022-01-01'), status: ServiceAlertStatusEnum.OPEN } as ServiceAlertInterface,
        { date: new Date('2022-01-10') } as ServiceUnitInterface
      );
      expect(serviceAlertRepo.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });

    it('does not auto finishes alert if does not meets conditions', async () => {
      const result = await alertService.autoFinishAlert({ createdAt: new Date('2022-02-01') } as ServiceAlertInterface, { date: new Date('2022-01-10') } as ServiceUnitInterface);
      expect(serviceAlertRepo.update).toHaveBeenCalledTimes(0);
      expect(result).toEqual(false);
    });

    it('saves new TIME alert', async () => {
      serviceAlertRepo.save = jest.fn().mockResolvedValue(Promise.resolve(true));

      alertService.saveNewAlert('userId', 'unitId', 'serviceId', ServiceFreqTypeEnum.TIME, { expectedPivotValue: new Date().getTime(), offset: null });

      expect(serviceAlertRepo.save).toHaveBeenCalledTimes(1);
    });

    it('saves new ODOMETER alert', async () => {
      serviceAlertRepo.save = jest.fn().mockResolvedValue(Promise.resolve(true));

      alertService.saveNewAlert('userId', 'unitId', 'serviceId', ServiceFreqTypeEnum.ODOMETER, { expectedPivotValue: null, offset: 1 });

      expect(serviceAlertRepo.save).toHaveBeenCalledTimes(1);
    });
  });
});
