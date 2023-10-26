import { BaseEntity } from '../base.entity';
import { Column, Entity, Index } from 'typeorm';
import { EventColorEnum, EventDefinitionInterface, EventSourceEnum, EventTypeEnum } from '../../shared';

@Entity()
export class EventDefinitionEntity extends BaseEntity implements EventDefinitionInterface {
  @Index()
  @Column({
    type: 'nvarchar',
    length: 8,
  })
  code: string;

  @Column({
    type: 'nvarchar',
    length: 16,
  })
  source: EventSourceEnum;

  @Column({
    type: 'nvarchar',
    length: 64,
  })
  description: string;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  dataType: string;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  codeType: string;

  @Column({
    type: 'nvarchar',
    length: 8,
  })
  level: EventColorEnum;

  @Column({
    type: 'nvarchar',
    length: 32,
  })
  type: EventTypeEnum;

  @Column({
    type: 'int',
    unsigned: true,
  })
  delayMin: number;

  @Column({
    type: 'boolean',
  })
  activationFlag: boolean;
}
