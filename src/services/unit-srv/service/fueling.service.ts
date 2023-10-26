import { AlertService } from './../service/alert';
import { AppConfig } from '../../../app.config';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Between, DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import { getUnitAndValidateOdometer, getUnitPerformance } from '../../../utils';
import { ILogger } from '../../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitEntity, UnitFuelingEntity } from '../../../entities';
import { UnitFuelingInterface } from '../../../shared';
import { UnitOdometerService } from '../unit';

@Injectable()
export class FuelingService {
  constructor(
    @InjectRepository(UnitFuelingEntity)
    private fuelingRepo: Repository<UnitFuelingEntity>,
    @InjectRepository(UnitEntity)
    private unitRepo: Repository<UnitEntity>,
    private unitOdometerService: UnitOdometerService,
    private logger: ILogger,
    @Inject(AppConfig.KEY)
    private config: ConfigType<typeof AppConfig>,
    private alertService: AlertService
  ) {}

  async findAll(params: { operatorId?: string; startDate?: Date; endDate?: Date }): Promise<UnitFuelingInterface[]> {
    this.logger.debug('Getting all fueling services...');
    let where: FindOptionsWhere<UnitFuelingEntity> = { isActive: true };

    if (params.operatorId) where.user = { id: params.operatorId, isActive: true };
    if (params.startDate && params.endDate) where.date = Between(params.startDate, params.endDate);

    return this.fuelingRepo.find({ where, relations: { assets: true, unit: true, user: true } });
  }

  async findOne(id: string): Promise<UnitFuelingInterface> {
    this.logger.debug('Getting fueling service...');
    return this.fuelingRepo.findOne({
      where: { id },
      relations: { assets: true, unit: true, user: true },
    });
  }

  async getLastFueling(unitId: string): Promise<UnitFuelingInterface> {
    return await this.fuelingRepo.findOne({ where: { unit: { id: unitId, isActive: true }, isActive: true }, order: { createdAt: 'DESC' } });
  }

  async create(fueling: UnitFuelingInterface): Promise<UnitFuelingInterface> {
    this.logger.debug('Creating fueling service...');
    delete fueling.id;

    const unit = await getUnitAndValidateOdometer(fueling.unit.id, fueling.odometer, this.config.FUELING_MAX_KILOMETERS_DIFFERENCE_ALLOWED, this.unitRepo);

    let performance = null;
    const lastFueling = await this.getLastFueling(unit.id);
    if (lastFueling) performance = getUnitPerformance(lastFueling.odometer, fueling.odometer, fueling.liters);

    const newFueling = await this.fuelingRepo.save({ ...fueling, performance });

    await this.unitRepo.save({ ...unit, odometer: newFueling.odometer });

    this.alertService.processAlerts({
      userId: newFueling.user.id,
    });

    return newFueling;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing fueling service...');
    let deletedNum = 0;

    const fuelingService = await this.fuelingRepo.findOne({ where: { id, isActive: true }, relations: { user: true, unit: true } });

    if (fuelingService) {
      const deleted = await this.fuelingRepo.update(id, { isActive: false });
      deletedNum = deleted.affected;

      if (fuelingService.odometer >= fuelingService.unit.odometer) {
        this.unitOdometerService.setUnitCurrentOdometer(fuelingService.unit.id);
      }

      this.alertService.processAlerts({
        userId: fuelingService.user.id,
      });
    }

    return deletedNum > 0;
  }

  async update(fueling: UnitFuelingInterface): Promise<UnitFuelingInterface> {
    this.logger.debug('Updating fueling service...');

    if (!fueling.id) throw new BadRequestException('The fueling service id was not provided');

    const existing = await this.fuelingRepo.findOne({
      where: { id: fueling.id },
    });

    if (!existing) throw new NotFoundException('The fueling service was not found in the database');

    const unit = await getUnitAndValidateOdometer(fueling.unit.id, fueling.odometer, this.config.FUELING_MAX_KILOMETERS_DIFFERENCE_ALLOWED, this.unitRepo);

    let performance = null;
    const lastFueling = await this.getLastFueling(unit.id);
    if (lastFueling) performance = getUnitPerformance(lastFueling.odometer, fueling.odometer, fueling.liters);

    const updatedFueling = await this.fuelingRepo.save({
      ...existing,
      ...fueling,
      performance,
    });

    this.unitRepo.save({ ...unit, odometer: fueling.odometer });

    this.alertService.processAlerts({
      userId: updatedFueling.user.id,
    });

    return updatedFueling;
  }
}
