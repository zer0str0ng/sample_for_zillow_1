import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { ILogger } from './../../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitEntity, UnitUserEntity } from './../../../entities';
import { UnitStatusEnum, UnitUserInterface } from './../../../shared';
import { UnitUserDTO } from './../../../dtos';

@Injectable()
export class UnitAssignationService {
  constructor(
    @InjectRepository(UnitUserEntity)
    private unitUserRepo: Repository<UnitUserEntity>,
    @InjectRepository(UnitEntity)
    private unitRepo: Repository<UnitEntity>,
    private logger: ILogger
  ) {}

  async findAll(): Promise<Partial<UnitUserInterface>[]> {
    this.logger.debug('Getting all unit assignations...');
    return this.unitUserRepo.find({ relations: { unit: true, user: true } });
  }

  async findAssignation(params: { userId?: string; unitId?: string; all: boolean }): Promise<UnitUserInterface[]> {
    this.logger.debug('Getting unit assignation...');
    const where: FindOptionsWhere<UnitUserEntity> = { isActive: true };
    if (params.userId) where.user = { id: params.userId };
    if (params.unitId) where.unit = { id: params.unitId };

    const relations: FindOptionsRelations<UnitUserEntity> = { unit: true, assets: true, user: true };
    const order = { createdAt: 'DESC' } as FindOptionsOrder<UnitUserEntity>;
    // Get only current assignation
    if (!params.all) {
      const whereStatuses = [
        { ...where, status: UnitStatusEnum.ASSIGNED },
        { ...where, status: UnitStatusEnum.PENDING },
      ];
      const result = await this.unitUserRepo.find({
        where: whereStatuses,
        relations,
        order,
      });

      if (!result.length) return [];

      return [result[0]];
    }
    //Get all available assignations
    return this.unitUserRepo.find({
      where: where,
      relations,
      order,
    });
  }

  async create(assignation: UnitUserDTO): Promise<UnitUserInterface> {
    this.logger.debug('Creating unit assignation...');
    delete assignation.id;
    assignation.status = UnitStatusEnum.PENDING;

    // Review if there is a current assignation
    const currUserAssigs = await this.findAssignation({ userId: assignation.user?.id, all: true });
    const lastUserAssig = currUserAssigs.length ? currUserAssigs[0] : null;

    const currUnitAssigs = await this.findAssignation({ unitId: assignation.unit?.id, all: true });
    const lastUnitAssig = currUnitAssigs.length ? currUnitAssigs[0] : null;

    const unit = await this.unitRepo.findOne({
      where: { id: assignation.unit.id },
    });
    // Validating odometer
    if (assignation.initOdometer < unit.odometer) throw new NotAcceptableException(`The odometer [${assignation.initOdometer}] couldn't be lesser than current registered value [${unit.odometer}]`);

    // Save new assignation
    const result = await this.unitUserRepo.save(assignation);

    // Update previous assgination
    this.updateLastAssignation(lastUserAssig);
    this.updateLastAssignation(lastUnitAssig);

    return result;
  }

  async updateLastAssignation(assignation: UnitUserInterface) {
    if (assignation) {
      let newStatus: UnitStatusEnum;
      if (assignation.status === UnitStatusEnum.ASSIGNED) newStatus = UnitStatusEnum.FINISHED;
      if (assignation.status === UnitStatusEnum.PENDING) newStatus = UnitStatusEnum.CANCELLED;
      if (newStatus) {
        this.logger.debug('Changing last assignation status...');
        await this.unitUserRepo.save({
          ...assignation,
          status: newStatus,
        });
      }
    }
  }

  async cancelCurrentAssignation(params: { unitId?: string; userId?: string }) {
    const assignation = await this.findAssignation({ all: false, unitId: params.unitId, userId: params.userId });

    if (assignation.length && [UnitStatusEnum.ASSIGNED, UnitStatusEnum.PENDING].includes(assignation[0].status)) {
      this.unitUserRepo.update(assignation[0].id, { status: UnitStatusEnum.CANCELLED });
    }
  }

  async update(params: { assignation: UnitUserInterface; userId: string; onlyPending?: boolean }): Promise<Partial<UnitUserInterface>> {
    this.logger.info('Updating unit assignation...');

    const where: FindOptionsWhere<UnitUserEntity> = { id: params.assignation.id, user: { id: params.userId } };

    if (params.onlyPending) where.status = UnitStatusEnum.PENDING;

    const existing = await this.unitUserRepo.findOne({
      where,
      relations: { unit: true },
    });

    if (!existing) throw new BadRequestException('The assignation was not found or unexpected status');

    const updatedAssignation = { ...existing, ...params.assignation };

    if (params.assignation.status === UnitStatusEnum.ASSIGNED) {
      const unit = existing.unit;
      // Update the unit with the new odometer
      await this.unitRepo.save({ ...unit, odometer: existing.initOdometer });
    }

    return await this.unitUserRepo.save(updatedAssignation);
  }
}
