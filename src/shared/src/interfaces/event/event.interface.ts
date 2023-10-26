import { BaseEntityInterface } from './../base.entity.interface';
import { EventColorEnum, EventSourceEnum, EventStatusEnum, EventTypeEnum } from './../../enums';
import { UserInterface } from '../user.interface';

export interface EventDefinitionInterface extends BaseEntityInterface {
  code: string; // Index
  source: EventSourceEnum;
  description: string;
  dataType: string;
  codeType: string;
  level: EventColorEnum;
  type: EventTypeEnum;
  delayMin: number;
  activationFlag: boolean;
}

export interface EventHistoryInterface extends BaseEntityInterface {
  info: string;
  user: Partial<UserInterface>;
}

export interface EventInterface extends BaseEntityInterface {
  source: string;
  raw: string;
  protocol: string;
  phone: string;
  msgType: string;
  account: string; // Index
  eventCode: string;
  eventDefinition?: EventDefinitionInterface;
  partitionId: string;
  userId: string;
  date: Date;
  status: EventStatusEnum;
  minutesToFollow: number;
  history: Partial<EventHistoryInterface>[];
}
