import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventDefinitionEntity } from './../../entities';
import { EventDefinitionInterface } from './../../shared';
import { EventSearchParamsDTO } from './../../dtos';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ILogger } from './../../logger';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventDefinitionService {
  constructor(
    @InjectRepository(EventDefinitionEntity)
    private eventDefRepo: Repository<EventDefinitionEntity>,
    private logger: ILogger
  ) {}

  findAll(params: EventSearchParamsDTO): Promise<EventDefinitionInterface[]> {
    this.logger.debug('Getting all event definitions...');

    let where: FindOptionsWhere<EventDefinitionEntity> | FindOptionsWhere<EventDefinitionEntity>[] = { isActive: true };

    if (params.param?.length) where = [{ description: Like(`%${params.param}%`), isActive: true }];

    return this.eventDefRepo.find({ where });
  }

  findOne(id: string): Promise<EventDefinitionInterface> {
    this.logger.debug('Getting event definition...');
    return this.eventDefRepo.findOne({
      where: { id, isActive: true },
    });
  }

  async create(eventDef: EventDefinitionInterface): Promise<EventDefinitionInterface> {
    this.logger.debug('Creating event definition...');
    delete eventDef.id;

    return this.eventDefRepo.save(eventDef);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing event definition...');

    const deleted = await this.eventDefRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }

  async update(eventDef: EventDefinitionInterface): Promise<EventDefinitionInterface> {
    this.logger.debug('Updating event definition...');

    if (!eventDef.id) throw new BadRequestException('The event definition id was not provided');

    const existingEventDefinition = await this.eventDefRepo.findOne({
      where: { id: eventDef.id },
    });

    if (!existingEventDefinition) throw new NotFoundException('The event definition was not found in the database');

    const updated = { ...existingEventDefinition, ...eventDef };

    return this.eventDefRepo.save(updated);
  }
}
