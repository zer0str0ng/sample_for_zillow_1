import { AlarmModelEnum, AlarmPartitionEnum, AlarmStatusEnum, AlarmTypeEnum, DayOfWeekEnum } from './../../enums';

export interface ClientZoneInterface {
  zone: string;
  protectedArea: string;
  notes: string;
}

export interface ClientMonitorConfigInterface {
  remoteControlFlag: boolean;
  status: AlarmStatusEnum;
  model: AlarmModelEnum;
  customModel: string;
  type: AlarmTypeEnum;
  cellphoneModuleFlag: boolean;
  electricFenceFlag: boolean;
  te: number;
  lineRetentionFlag: boolean;
  fireFlag: boolean;
  ts: number;
  chimeFlag: boolean;
  repMensFlag: boolean;
  medFlag: boolean;
  transferLoc: string;
  brainLoc: string;
  pTestDays: number;
  partition: AlarmPartitionEnum;
  openCloseRestrictedFlag: boolean;
  openCloseRestricted: MonitorOpenCloseRestrictedInterface[];
  openCloseMandatoryFlag: boolean;
  openCloseMandatory: MonitorOpenCloseInterface[];
}

export interface MonitorOpenCloseInterface {
  dow: DayOfWeekEnum;
  config: MonitorOpenClosePairInterface[];
}

export interface MonitorOpenClosePairInterface {
  op: string;
  cl: string;
}

export interface MonitorOpenCloseRestrictedInterface extends MonitorOpenCloseInterface {
  preTolMin: number;
  postTolMin: number;
}

// TODO to have a separate table to store/handle
export interface ClientMonitorNotesInterface {
  note: string;
  eventId?: string;
  expiracy?: Date;
}
