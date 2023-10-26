import { Type } from 'class-transformer';
import {
  AlarmModelEnum,
  AlarmPartitionEnum,
  AlarmStatusEnum,
  AlarmTypeEnum,
  ClientMonitorConfigInterface,
  DayOfWeekEnum,
  MonitorOpenCloseInterface,
  MonitorOpenClosePairInterface,
  MonitorOpenCloseRestrictedInterface,
} from './../../shared';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator';

export class ClientMonitorConfigDTO implements ClientMonitorConfigInterface {
  @IsBoolean()
  remoteControlFlag: boolean;

  @IsEnum(AlarmModelEnum)
  model: AlarmModelEnum;

  @IsEnum(AlarmStatusEnum)
  status: AlarmStatusEnum;

  @IsString()
  @MaxLength(64)
  customModel: string;

  @IsEnum(AlarmTypeEnum)
  type: AlarmTypeEnum;

  @IsBoolean()
  cellphoneModuleFlag: boolean;

  @IsBoolean()
  electricFenceFlag: boolean;

  @IsNumber()
  @Max(99999)
  te: number;

  @IsBoolean()
  lineRetentionFlag: boolean;

  @IsBoolean()
  fireFlag: boolean;

  @IsNumber()
  @Min(0)
  @Max(99999)
  ts: number;

  @IsBoolean()
  chimeFlag: boolean;

  @IsBoolean()
  repMensFlag: boolean;

  @IsBoolean()
  medFlag: boolean;

  @IsString()
  @MaxLength(128)
  transferLoc: string;

  @IsString()
  @MaxLength(128)
  brainLoc: string;

  @IsNumber()
  @Min(0)
  @Max(99999)
  pTestDays: number;

  @IsEnum(AlarmPartitionEnum)
  partition: AlarmPartitionEnum;

  @IsBoolean()
  openCloseRestrictedFlag: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonitorOpenCloseRestrictedDTO)
  openCloseRestricted: MonitorOpenCloseRestrictedInterface[];

  @IsBoolean()
  openCloseMandatoryFlag: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonitorOpenCloseDTO)
  openCloseMandatory: MonitorOpenCloseInterface[];
}

export class MonitorOpenCloseRestrictedDTO implements MonitorOpenCloseRestrictedInterface {
  @IsNumber()
  @Min(0)
  @Max(256)
  preTolMin: number;

  @IsNumber()
  @Min(0)
  @Max(256)
  postTolMin: number;

  @IsEnum(DayOfWeekEnum)
  dow: DayOfWeekEnum;

  @ValidateNested({ each: true })
  @Type(() => MonitorOpenClosePairDTO)
  config: MonitorOpenClosePairInterface[];
}

export class MonitorOpenCloseDTO implements MonitorOpenCloseInterface {
  @IsEnum(DayOfWeekEnum)
  dow: DayOfWeekEnum;

  @ValidateNested({ each: true })
  @Type(() => MonitorOpenClosePairDTO)
  config: MonitorOpenClosePairInterface[];
}

const TIME_REGEX = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
export class MonitorOpenClosePairDTO implements MonitorOpenClosePairInterface {
  @IsString()
  @Matches(TIME_REGEX)
  op: string;

  @IsString()
  @Matches(TIME_REGEX)
  cl: string;
}
