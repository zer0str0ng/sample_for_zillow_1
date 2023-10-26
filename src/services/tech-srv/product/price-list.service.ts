import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ILogger } from './../../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceListEntity } from './../../../entities';
import { PriceListInterface } from './../../../shared';

@Injectable()
export class PriceListService {
  constructor(
    @InjectRepository(PriceListEntity)
    private priceListRepo: Repository<PriceListEntity>,
    private logger: ILogger
  ) {}

  findAll(): Promise<PriceListInterface[]> {
    this.logger.debug('Getting all price lists...');
    return this.priceListRepo.find({ where: { isActive: true } });
  }

  findOne(id: string): Promise<PriceListInterface> {
    this.logger.debug('Getting price list...');
    return this.priceListRepo.findOne({
      where: { id },
    });
  }

  create(priceList: PriceListInterface): Promise<PriceListInterface> {
    this.logger.debug('Creating price list...');
    delete priceList.id;
    return this.priceListRepo.save(priceList);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing price list...');

    const deleted = await this.priceListRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }
  async update(priceList: PriceListInterface): Promise<PriceListInterface> {
    this.logger.debug('Updating price list...');

    if (!priceList.id) throw new BadRequestException('The price list id was not provided');

    const existing = await this.priceListRepo.findOne({
      where: { id: priceList.id },
    });

    if (!existing) throw new NotFoundException('The price list was not found in the database');

    const updated = { ...existing, ...priceList };

    return this.priceListRepo.save(updated);
  }
}
