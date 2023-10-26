import { AssetEntity } from './../../';
import { AssetInterface, UnitInterface, UnitStatusEnum, UnitUserInterface, UserInterface } from '../../../shared';
import { BaseEntity } from './../../base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { UnitEntity } from './';
import { UserEntity } from './../../user';

@Entity()
export class UnitUserEntity extends BaseEntity implements UnitUserInterface {
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: Partial<UserInterface>;

  @ManyToOne(() => UnitEntity, (unit) => unit.id)
  unit: Partial<UnitInterface>;

  @Column({ type: 'int', default: 0 })
  initOdometer: number;

  @Column({
    type: 'enum',
    enum: UnitStatusEnum,
    default: UnitStatusEnum.PENDING,
  })
  status: UnitStatusEnum;

  @ManyToMany(() => AssetEntity, { cascade: true })
  @JoinTable()
  assets: AssetInterface[];
}
