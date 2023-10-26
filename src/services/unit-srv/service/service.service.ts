import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ILogger } from './../../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity } from './../../../entities';
import { ServiceInterface } from './../../../shared';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private serviceRepo: Repository<ServiceEntity>,
    private logger: ILogger
  ) {}

  async findAll(): Promise<ServiceInterface[]> {
    this.logger.debug('Getting all services...');
    return this.serviceRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<ServiceInterface> {
    this.logger.debug('Getting service...');
    return this.serviceRepo.findOne({
      where: { id },
    });
  }

  async create(service: ServiceInterface): Promise<ServiceInterface> {
    this.logger.debug('Creating service...');
    delete service.id;

    const result = await this.serviceRepo.save(service);

    return result;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing service...');

    const deleted = await this.serviceRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }

  async update(service: ServiceInterface): Promise<ServiceInterface> {
    this.logger.debug('Updating service...');

    if (!service.id) throw new BadRequestException('The service id was not provided');

    const existing = await this.serviceRepo.findOne({
      where: { id: service.id },
    });

    if (!existing) throw new NotFoundException('The service was not found in the database');

    const updated = { ...existing, ...service };

    return this.serviceRepo.save(updated);
  }
}
