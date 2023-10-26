import { BaseEntity } from './../../base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ProductInterface, ProductPriceInterface } from './../../../shared/src/interfaces';
import { ProductPriceEntity } from './product-price.entity';
import { ServiceProductTypeEnum } from './../../../shared';

@Entity()
export class ProductEntity extends BaseEntity implements ProductInterface {
  @Column({
    type: 'nvarchar',
    length: 128,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: ServiceProductTypeEnum,
  })
  type: ServiceProductTypeEnum;

  @ManyToMany(() => ProductPriceEntity, { cascade: true })
  @JoinTable()
  prices?: ProductPriceInterface[];

  @Column({
    type: 'nvarchar',
    length: 512,
  })
  comments: string;
}
