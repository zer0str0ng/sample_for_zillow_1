import { ILogger } from './../../../logger';
import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceUnitEntity, UnitEntity, UnitFuelingEntity, UnitUserEntity } from './../../../entities';
import { UnitStatusEnum } from './../../../shared';

@Injectable()
export class UnitOdometerService {
  constructor(
    @InjectRepository(UnitEntity)
    private unitRepo: Repository<UnitEntity>,
    @InjectRepository(UnitUserEntity)
    private unitUserRepo: Repository<UnitUserEntity>,
    @InjectRepository(ServiceUnitEntity)
    private unitServiceRepo: Repository<ServiceUnitEntity>,
    @InjectRepository(UnitFuelingEntity)
    private fuelingRepo: Repository<UnitFuelingEntity>,
    private logger: ILogger
  ) {}

  async setUnitCurrentOdometer(unitId: string): Promise<void> {
    this.logger.debug('Calculating current odometer for unit:', unitId);
    const lastFuelingOdometer = (await this.fuelingRepo.findOne({ where: { unit: { id: unitId, isActive: true }, isActive: true }, order: { createdAt: 'DESC' } }))?.odometer ?? 0;
    const lastServiceOdometer = (await this.unitServiceRepo.findOne({ where: { unit: { id: unitId, isActive: true }, isActive: true }, order: { createdAt: 'DESC' } }))?.odometer ?? 0;
    const lastAssignation =
      (
        await this.unitUserRepo.findOne({
          where: { status: In([UnitStatusEnum.ASSIGNED, UnitStatusEnum.FINISHED]), unit: { id: unitId, isActive: true }, isActive: true },
          order: { createdAt: 'DESC' },
        })
      )?.initOdometer ?? 0;

    const maxOdometer = Math.max(lastFuelingOdometer, lastServiceOdometer, lastAssignation);

    if (maxOdometer > 0) await this.unitRepo.update(unitId, { odometer: maxOdometer });
  }
}
