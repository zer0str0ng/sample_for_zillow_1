import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { AssetInterface, UnitFuelingInterface, UnitInterface, UserInterface } from '../../../shared';
import { AssetEntity } from '../../asset.entity';
import { UserEntity } from '../../user';
import { UnitEntity } from '../unit';

@Entity()
export class UnitFuelingEntity extends BaseEntity implements UnitFuelingInterface {
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: Partial<UserInterface>;

  @ManyToOne(() => UnitEntity, (unit) => unit.id)
  unit: Partial<UnitInterface>;

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
    type: 'integer',
    unsigned: true,
  })
  liters: number;

  @Column({
    type: 'float',
    nullable: true,
    unsigned: true,
  })
  performance?: number;

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
