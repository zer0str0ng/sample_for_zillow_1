import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ILogger } from './../../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitAssignationService } from './unit.assignation.service';
import { UnitDTO } from './../../../dtos';
import { UnitEntity } from './../../../entities';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(UnitEntity)
    private unitRepo: Repository<UnitEntity>,
    private unitAssigService: UnitAssignationService,
    private logger: ILogger
  ) {}

  async findAll(): Promise<Partial<UnitDTO>[]> {
    this.logger.debug('Getting all units...');
    return this.unitRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Partial<UnitDTO>> {
    this.logger.debug('Getting unit...');
    return this.unitRepo.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing unit...');

    await this.unitAssigService.cancelCurrentAssignation({ unitId: id });

    const deleted = await this.unitRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }

  async create(unit: UnitDTO): Promise<Partial<UnitDTO>> {
    this.logger.debug('Creating unit...');
    delete unit.id;
    return this.unitRepo.save(unit);
  }

  async update(unit: UnitDTO): Promise<Partial<UnitDTO>> {
    this.logger.debug('Updating unit...');

    if (!unit.id) throw new BadRequestException('The unit id was not provided');

    const existing = await this.unitRepo.findOne({
      where: { id: unit.id },
    });

    if (!existing) throw new NotFoundException('The unit was not found in the database');

    const updated = { ...existing, ...unit };

    return this.unitRepo.save(updated);
  }
}
