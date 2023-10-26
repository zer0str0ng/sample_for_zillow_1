import { BaseEntity } from '../../base.entity';
import { PriceListInterface } from '../../../shared/src/interfaces';
import { Column, Entity } from 'typeorm';

@Entity()
export class PriceListEntity extends BaseEntity implements PriceListInterface {
  @Column({
    type: 'nvarchar',
    length: 128,
  })
  name: string;

  @Column({
    type: 'integer',
    unsigned: true,
  })
  priority: number;

  @Column({
    type: 'nvarchar',
    length: 512,
  })
  comments: string;
}
