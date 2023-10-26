import { BaseEntity } from '../../base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ServiceAlertInterface, ServiceAlertStatusEnum, ServiceInterface, UnitInterface, UserInterface } from '../../../shared';
import { ServiceEntity } from './service.entity';
import { UserEntity } from '../../user';
import { UnitEntity } from '../unit';

@Entity()
export class ServiceAlertEntity extends BaseEntity implements ServiceAlertInterface {
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: Partial<UserInterface>;

  @ManyToOne(() => UnitEntity, (unit) => unit.id)
  unit: Partial<UnitInterface>;

  @ManyToOne(() => ServiceEntity, (service) => service.id)
  service: Partial<ServiceInterface>;

  @Column({
    type: 'enum',
    enum: ServiceAlertStatusEnum,
    default: ServiceAlertStatusEnum.OPEN,
  })
  status: ServiceAlertStatusEnum;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  expectedBeforeDate?: Date;

  @Column({
    type: 'integer',
    nullable: true,
  })
  expectedOffsetDays?: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  expectedBeforeOdometer?: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  expectedOffsetOdometer?: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  dismissedBy?: Partial<UserInterface>;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  dismissedDate?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  dismissUntilDate?: Date;

  @Column({
    type: 'integer',
    nullable: true,
  })
  dismissUntilOdometer?: number;

  @Column({
    type: 'datetime',
  })
  activatedDate: Date;

  @Column({
    type: 'datetime',
  })
  lastActivatedDate: Date;
}
