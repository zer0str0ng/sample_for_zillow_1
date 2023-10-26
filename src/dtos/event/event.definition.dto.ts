import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { EventColorEnum, EventDefinitionInterface, EventSourceEnum, EventTypeEnum } from '../../shared';

export class EventDefinitionDTO implements EventDefinitionInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsString()
  @MaxLength(8)
  @MinLength(1)
  code: string;

  @IsEnum(EventSourceEnum)
  source: EventSourceEnum;

  @IsString()
  @MaxLength(64)
  @MinLength(1)
  description: string;

  @IsString()
  @MaxLength(8)
  @MinLength(1)
  dataType: string;

  @IsString()
  @MaxLength(8)
  @MinLength(1)
  codeType: string;

  @IsEnum(EventColorEnum)
  level: EventColorEnum;

  @IsEnum(EventTypeEnum)
  type: EventTypeEnum;

  @IsNumber()
  delayMin: number;

  @IsBoolean()
  activationFlag: boolean;
}
