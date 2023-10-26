import { BaseEntity } from './../base.entity';
import { EventDefinitionInterface, EventHistoryInterface, EventInterface, EventStatusEnum } from './../../shared';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { EventDefinitionEntity } from './event.definition.entity';
import { EventHistoryEntity } from './event.history.entity';

@Entity()
export class EventEntity extends BaseEntity implements EventInterface {
  @Column({
    type: 'nvarchar',
    length: 32,
  })
  source: string;

  @Column({
    type: 'nvarchar',
    length: 256,
  })
  raw: string;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  protocol: string;

  @Column({
    type: 'nvarchar',
    length: 32,
  })
  phone: string;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  msgType: string;

  @Index()
  @Column({
    type: 'nvarchar',
    length: 8,
  })
  account: string;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  eventCode: string;

  @ManyToOne(() => EventDefinitionEntity, (eventDef) => eventDef.id)
  eventDefinition?: EventDefinitionInterface;

  @Column({
    type: 'nvarchar',
    length: 4,
  })
  partitionId: string;

  @Column({
    type: 'nvarchar',
    length: 32,
  })
  userId: string;

  @Column({
    type: 'datetime',
  })
  date: Date;

  @Column({
    type: 'nvarchar',
    length: 3,
  })
  status: EventStatusEnum;

  @Column({
    type: 'int',
  })
  minutesToFollow: number;

  @ManyToMany(() => EventHistoryEntity, { cascade: true })
  @JoinTable()
  history: Partial<EventHistoryInterface>[];
}
