import { AssetEntity } from './../../asset.entity';
import { AssetInterface, ServiceInterface, ServiceUnitInterface, UnitInterface, UserInterface } from '../../../shared';
import { BaseEntity } from './../../base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ServiceEntity } from './service.entity';
import { UnitEntity } from './../unit';
import { UserEntity } from './../../user';

@Entity()
export class ServiceUnitEntity extends BaseEntity implements ServiceUnitInterface {
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: Partial<UserInterface>;

  @ManyToOne(() => UnitEntity, (unit) => unit.id)
  unit: Partial<UnitInterface>;

  @ManyToOne(() => ServiceEntity, (service) => service.id)
  service?: Partial<ServiceInterface>;

  @Column({
    type: 'datetime',
  })
  date: Date;

  @Column({
    type: 'integer',
    unsigned: true,
  })
  odometer: number;

  @Column({
    type: 'float',
    unsigned: true,
  })
  totalAmount: number;

  @Column({ type: 'nvarchar', length: 1024, default: '' })
  comments?: string;

  @Column({ type: 'nvarchar', length: 32 })
  location: string;

  @ManyToMany(() => AssetEntity, { cascade: true })
  @JoinTable()
  assets: AssetInterface[];
}
