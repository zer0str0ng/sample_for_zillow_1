import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ILogger } from './../../../logger';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity, ProductPriceEntity } from './../../../entities';
import { ProductInterface, ProductPriceInterface } from './../../../shared';
import { ProductSearchParamsDTO } from 'src/dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductInterface>,
    @InjectRepository(ProductPriceEntity)
    private productPriceRepo: Repository<ProductPriceInterface>,
    private logger: ILogger
  ) {}

  findAll(params: ProductSearchParamsDTO): Promise<ProductInterface[]> {
    this.logger.debug('Getting all products...');
    const where: FindOptionsWhere<ProductInterface> = { isActive: true };

    if (params.param?.length) where.name = Like(`%${params.param}%`);

    return this.productRepo.find({
      where,
      relations: {
        prices: {
          priceList: true,
        },
      },
    });
  }

  findOne(id: string): Promise<ProductInterface> {
    this.logger.debug('Getting product...');
    return this.productRepo.findOne({
      where: { id },
      relations: {
        prices: {
          priceList: true,
        },
      },
    });
  }

  create(product: ProductInterface): Promise<ProductInterface> {
    this.logger.debug('Creating product...');
    delete product.id;
    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing product...');

    const deleted = await this.productRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }

  async update(product: ProductInterface): Promise<ProductInterface> {
    this.logger.debug('Updating product...');

    if (!product.id) throw new BadRequestException('The product id was not provided');

    const existing = await this.productRepo.findOne({
      where: { id: product.id },
      relations: { prices: true },
    });

    if (!existing) throw new NotFoundException('The product was not found in the database');

    const updated = { ...existing, ...product };

    const updatedProduct = await this.productRepo.save(updated);

    // Check for need on updating product prices
    const existingPriceIds = existing.prices.map((price) => price.id);
    const newPriceIds = product.prices.map((price) => price.id).filter(Boolean);
    const pricesToRemove = existingPriceIds.filter((priceId) => !newPriceIds.includes(priceId));

    if (pricesToRemove?.length) {
      // TODO Update maybe?
      this.productPriceRepo.delete({ id: In(pricesToRemove) });
    }

    return updatedProduct;
  }
}
