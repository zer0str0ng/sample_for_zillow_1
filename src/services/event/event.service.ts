import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEntity } from './../../entities';
import { EventInterface, EventStatusEnum } from './../../shared';
import { EventSearchParamsDTO } from './../../dtos';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ILogger } from './../../logger';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepo: Repository<EventEntity>,
    private logger: ILogger
  ) {}

  findAll(params: EventSearchParamsDTO): Promise<EventInterface[]> {
    this.logger.debug('Getting all events...');

    let where: FindOptionsWhere<EventEntity> = {};

    if (params.param?.length) where = { status: params.param as EventStatusEnum };

    return this.eventRepo.find({ where: { ...where, isActive: true }, relations: { eventDefinition: true, history: true } });
  }

  findOne(id: string): Promise<EventInterface> {
    this.logger.debug('Getting event...');
    return this.eventRepo.findOne({
      where: { id, isActive: true },
      relations: { eventDefinition: true, history: true },
    });
  }

  // TODO ADD LOGIC FOR eventDEFINITIONID when empty
  async create(event: EventInterface): Promise<EventInterface> {
    this.logger.debug('Creating event...');
    delete event.id;

    return this.eventRepo.save(event);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing event...');

    const deleted = await this.eventRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }

  // TODO ADD LOGIC FOR eventDEFINITIONID when empty
  async update(event: EventInterface): Promise<EventInterface> {
    this.logger.debug('Updating event...');

    if (!event.id) throw new BadRequestException('The event id was not provided');

    const existingEvent = await this.eventRepo.findOne({
      where: { id: event.id },
    });

    if (!existingEvent) throw new NotFoundException('The event was not found in the database');

    const updated = { ...existingEvent, ...event };

    return this.eventRepo.save(updated);
  }
}
