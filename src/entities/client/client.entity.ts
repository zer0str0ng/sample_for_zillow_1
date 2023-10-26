import { BaseEntity } from './../base.entity';
import {
  BuildingTypeEnum,
  CitiesEnum,
  ClientCamerasInterface,
  ClientContactInterface,
  ClientInterface,
  ClientMonitorConfigInterface,
  ClientPhoneInterface,
  ClientUserInterface,
  ClientZoneInterface,
  MonitoringTypeEnum,
  UserInterface,
} from '../../shared';
import { Column, Entity, ManyToOne } from 'typeorm';
import { GIGABYTE_DEFAULT_LOCATION } from './../../utils';
import { UserEntity } from './../user';

@Entity()
export class ClientEntity extends BaseEntity implements ClientInterface {
  @Column({
    type: 'datetime',
  })
  registerDate: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  deactivationDate?: Date;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  account: string;

  @Column({
    type: 'enum',
    enum: BuildingTypeEnum,
  })
  buildingType: BuildingTypeEnum;

  @Column({
    type: 'nvarchar',
    length: 128,
    default: '',
  })
  buildingDetails: string;

  @Column({ type: 'boolean' })
  monitoringFlag: boolean;

  @Column({
    type: 'enum',
    enum: MonitoringTypeEnum,
    default: MonitoringTypeEnum.BASIC,
  })
  monitoringType: MonitoringTypeEnum;

  @Column({
    type: 'nvarchar',
    length: 256,
  })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 256,
  })
  address: string;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  county: string;

  @Column({
    type: 'nvarchar',
    length: 5,
  })
  zipCode: string;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  city: CitiesEnum;

  @Column({ type: 'nvarchar', length: 32, default: GIGABYTE_DEFAULT_LOCATION })
  location: string;

  @Column({ type: 'simple-array', default: '[]' })
  emails: string[];

  @Column({ type: 'json', nullable: false, default: '[]' })
  telephones: ClientPhoneInterface[];

  @Column({ type: 'json', nullable: false, default: '[]' })
  users: ClientUserInterface[];

  @Column({ type: 'json', nullable: false, default: '[]' })
  contacts: ClientContactInterface[];

  @Column({ type: 'json', nullable: false, default: '[]' })
  zones: ClientZoneInterface[];

  @Column({
    type: 'nvarchar',
    length: 512,
  })
  notes: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  createdUser: Partial<UserInterface>;

  @ManyToOne(() => UserEntity, (user) => user.id)
  updatedUser: Partial<UserInterface>;

  @Column({ type: 'json', nullable: false, default: '{}' })
  monitorConfig: ClientMonitorConfigInterface;

  @Column({ type: 'int', nullable: true })
  patrolOrder: number | null;

  @Column({ type: 'datetime', nullable: true })
  latestMonitorSignal?: Date;

  @Column({ type: 'tinyint', nullable: false, default: 0, unsigned: true })
  maxNoCommDays: number;

  @Column({ type: 'json', nullable: false, default: '[]' })
  cameras: ClientCamerasInterface[];
}
