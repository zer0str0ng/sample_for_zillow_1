import { AlertService } from './alert';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { getUnitAndValidateOdometer } from './../../../utils';
import { ILogger } from './../../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceUnitEntity, UnitEntity } from './../../../entities';
import { ServiceUnitInterface } from './../../../shared';
import { UnitOdometerService } from '../unit';

@Injectable()
export class ServiceUnitService {
  constructor(
    @InjectRepository(ServiceUnitEntity)
    private unitServiceRepo: Repository<ServiceUnitEntity>,
    @InjectRepository(UnitEntity)
    private unitRepo: Repository<UnitEntity>,
    private unitOdometerService: UnitOdometerService,
    private logger: ILogger,
    private alertService: AlertService
  ) {}

  async findAll(params: { operatorId?: string; startDate?: Date; endDate?: Date }): Promise<ServiceUnitInterface[]> {
    this.logger.debug('Getting all unit services...');

    let where: FindOptionsWhere<ServiceUnitEntity> = { isActive: true };
    if (params.operatorId) where.user = { id: params.operatorId };
    if (params.startDate && params.endDate) where.date = Between(params.startDate, params.endDate);

    return this.unitServiceRepo.find({ where, relations: { assets: true, unit: true, user: true, service: true } });
  }

  async getLastService(unitId: string): Promise<ServiceUnitInterface> {
    return await this.unitServiceRepo.findOne({ where: { unit: { id: unitId, isActive: true }, isActive: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ServiceUnitInterface> {
    this.logger.debug('Getting unit service...');
    return this.unitServiceRepo.findOne({
      where: { id },
      relations: { assets: true, unit: true, user: true, service: true },
    });
  }

  async create(unitService: ServiceUnitInterface): Promise<ServiceUnitInterface> {
    this.logger.debug('Creating unit service...');
    delete unitService.id;

    const unit = await getUnitAndValidateOdometer(unitService.unit.id, unitService.odometer, null, this.unitRepo);

    const newUnitService = await this.unitServiceRepo.save(unitService);

    // Update Unit odometer
    await this.unitRepo.save({ ...unit, odometer: newUnitService.odometer });

    this.alertService.processAlerts({
      userId: unitService.user.id,
      serviceId: unitService.service.id,
    });

    return newUnitService;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing unit service...');
    let deletedNum = 0;

    const unitService = await this.unitServiceRepo.findOne({ where: { id, isActive: true }, relations: { user: true, service: true, unit: true } });

    if (unitService) {
      const deleted = await this.unitServiceRepo.update(id, { isActive: false });
      deletedNum = deleted.affected;

      if (unitService.odometer >= unitService.unit.odometer) {
        this.unitOdometerService.setUnitCurrentOdometer(unitService.unit.id);
      }

      this.alertService.processAlerts({
        userId: unitService.user.id,
        serviceId: unitService.service.id,
      });
    }

    return deletedNum > 0;
  }

  async update(unitService: ServiceUnitInterface): Promise<ServiceUnitInterface> {
    this.logger.debug('Updating unit service...');

    if (!unitService.id) throw new BadRequestException('The unit service id was not provided');

    const existing = await this.unitServiceRepo.findOne({
      where: { id: unitService.id },
    });

    if (!existing) throw new NotFoundException('The unit service was not found in the database');

    const unit = await getUnitAndValidateOdometer(unitService.unit.id, unitService.odometer, null, this.unitRepo);

    const updatedUnitService = await this.unitServiceRepo.save({
      ...existing,
      ...unitService,
    });

    // Update Unit odometer
    await this.unitRepo.save({
      ...unit,
      odometer: updatedUnitService.odometer,
    });

    this.alertService.processAlerts({
      userId: unitService.user.id,
      serviceId: unitService.service.id,
    });

    return updatedUnitService;
  }
}
