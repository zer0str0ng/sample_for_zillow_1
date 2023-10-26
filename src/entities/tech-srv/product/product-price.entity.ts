import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PriceListEntity } from './price-list.entity';
import { PriceListInterface, ProductPriceInterface } from '../../../shared/src/interfaces';

@Entity()
export class ProductPriceEntity extends BaseEntity implements ProductPriceInterface {
  @ManyToOne(() => PriceListEntity, (list) => list.id)
  priceList: PriceListInterface;

  @Column({ type: 'boolean' })
  default: boolean;

  @Column({
    type: 'float',
    unsigned: true,
  })
  price: number;
}
