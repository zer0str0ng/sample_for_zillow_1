import { AssetEntity, UnitUserEntity } from './../..';
import { AssetInterface, UnitInterface, UnitTypeEnum, UnitUserInterface } from './../../../shared';
import { BaseEntity } from './../../base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class UnitEntity extends BaseEntity implements UnitInterface {
  @Column({ type: 'nvarchar', length: 255 })
  description: string;

  @Column({ type: 'nvarchar', length: 16 })
  plate: string;

  @Column({ type: 'int', default: 0 })
  odometer: number;

  @OneToMany(() => UnitUserEntity, (unitUser) => unitUser.unit)
  assignations?: UnitUserInterface[];

  @Column({
    type: 'enum',
    enum: UnitTypeEnum,
    default: UnitTypeEnum.DEFAULT,
  })
  type: UnitTypeEnum;

  @ManyToMany(() => AssetEntity, { cascade: true })
  @JoinTable()
  assets: AssetInterface[];
}
