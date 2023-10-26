import { BaseEntity } from '../../base.entity';
import { Column, Entity, Generated, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import {
  AssetInterface,
  ClientInterface,
  TechServiceInterface,
  TechServicePriorityEnum,
  TechServiceProductInterface,
  TechServiceQuizInterface,
  TechServiceStatusEnum,
  UserInterface,
} from '../../../shared';
import { AssetEntity, ClientEntity, UserEntity } from '../..';
import { TechServiceProductEntity } from './tech-srv.product.entity';

@Entity()
export class TechServiceEntity extends BaseEntity implements TechServiceInterface {
  @Column({
    type: 'nvarchar',
    length: 128,
    default: '',
  })
  serviceNumber: string;

  @Column({
    type: 'nvarchar',
    length: 512,
    default: '',
  })
  description: string;

  @Column({
    type: 'nvarchar',
    length: 1024,
    default: '',
  })
  additionalData: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  technicianUser?: Partial<UserInterface>;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  serviceDate?: Date;

  @Column({
    type: 'integer',
    unsigned: true,
    default: 60,
  })
  estimatedMinutes: number;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  serviceDateEnd?: Date;

  @Column({
    type: 'enum',
    enum: TechServiceStatusEnum,
    default: TechServiceStatusEnum.CREATED,
  })
  status: TechServiceStatusEnum;

  @Column({
    type: 'enum',
    enum: TechServicePriorityEnum,
    default: TechServicePriorityEnum.NORMAL,
  })
  priority: TechServicePriorityEnum;

  @ManyToOne(() => ClientEntity, (client) => client.id)
  client?: Partial<ClientInterface>;

  @Column({ type: 'boolean', nullable: false, default: true })
  clientRequired: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id)
  coordinatorUser?: Partial<UserInterface>;

  @ManyToOne(() => UserEntity, (user) => user.id)
  financialUser?: Partial<UserInterface>;

  @Column({ type: 'json', nullable: false, default: '[]' })
  quiz: TechServiceQuizInterface[];

  @Column({
    type: 'integer',
    unsigned: true,
  })
  overallRate: number;

  @ManyToMany(() => TechServiceProductEntity, { cascade: true })
  @JoinTable()
  products: Partial<TechServiceProductInterface>[];

  @Column({
    type: 'float',
    unsigned: true,
  })
  extraCharge: number;

  @Column({
    type: 'nvarchar',
    length: 512,
    default: '',
  })
  extraChargeComment: string;

  @Column({
    type: 'float',
    unsigned: true,
  })
  totalAmount: number;

  @Column({
    type: 'nvarchar',
    length: 512,
    default: '',
  })
  comments: string;

  @Column({ type: 'nvarchar', length: 32 })
  location: string;

  @ManyToMany(() => AssetEntity, { cascade: true })
  @JoinTable()
  assets: AssetInterface[];
}
