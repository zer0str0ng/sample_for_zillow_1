import { BaseEntity } from './../../base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PriceListEntity, ProductEntity } from './../product';
import { ProductInterface, ProductPriceInterface, TechServiceProductInterface } from './../../../shared';

@Entity()
export class TechServiceProductEntity extends BaseEntity implements TechServiceProductInterface {
  @Column({
    type: 'int',
    unsigned: true,
    default: 1,
  })
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  product: Partial<ProductInterface>;

  @ManyToOne(() => PriceListEntity, (list) => list.id)
  priceList?: Partial<ProductPriceInterface>;

  @Column({
    type: 'float',
    unsigned: true,
  })
  price: number;
}
