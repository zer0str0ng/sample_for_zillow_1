import { IsArray, IsDate, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { EventDefinitionInterface, EventHistoryInterface, EventInterface, EventStatusEnum, SearchParamsInterface } from './../../shared';
import { IdDTO } from '../misc.dto';
import { Type } from 'class-transformer';
import { EventHistoryDTO } from './event.history.dto';

export class EventDTO implements EventInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsString()
  @MaxLength(32)
  @MinLength(1)
  source: string;

  @IsString()
  @MaxLength(256)
  @MinLength(1)
  raw: string;

  @IsString()
  @MaxLength(16)
  @MinLength(1)
  protocol: string;

  @IsString()
  @MaxLength(32)
  @MinLength(1)
  phone: string;

  @IsString()
  @MaxLength(8)
  @MinLength(1)
  msgType: string;

  @IsString()
  @MaxLength(8)
  @MinLength(1)
  account: string;

  @IsString()
  @MaxLength(8)
  @MinLength(1)
  eventCode: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDTO)
  eventDefinition?: EventDefinitionInterface;

  @IsString()
  @MaxLength(4)
  @MinLength(1)
  partitionId: string;

  @IsString()
  @MaxLength(32)
  @MinLength(1)
  userId: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsEnum(EventStatusEnum)
  status: EventStatusEnum;

  minutesToFollow: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventHistoryDTO)
  history: Partial<EventHistoryInterface>[];
}

export class EventSearchParamsDTO implements SearchParamsInterface {
  @IsOptional()
  @IsString()
  param?: string;
}
