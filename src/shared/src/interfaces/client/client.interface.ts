import { BaseEntityInterface } from '../base.entity.interface';
import { BuildingTypeEnum, ClientCollectionFreqEnum, ClientCollectionTypeEnum, MonitoringTypeEnum, CitiesEnum } from './../../enums';
import { ClientMonitorConfigInterface, ClientZoneInterface } from './client.monitor.interface';
import { UserInterface } from '../user.interface';

export interface ClientUserInterface {
  name: string;
  keyword: string;
  telephones: ClientPhoneInterface[];
  relation: string;
  number: string;
  priority: number;
  notes: string;
}

export interface ClientContactInterface {
  name: string;
  telephones: ClientPhoneInterface[];
  priority: number;
  notes: string;
}

export interface ClientCamerasInterface {
  link: string;
  notes: string;
}

export interface ClientFinancialConfigInterface {
  collectionType: ClientCollectionTypeEnum;
  freq: ClientCollectionFreqEnum;
}

export interface ClientInterface extends BaseEntityInterface {
  registerDate: Date;
  deactivationDate?: Date;
  account: string;
  buildingType: BuildingTypeEnum;
  buildingDetails: string;
  monitoringFlag: boolean;
  monitoringType: MonitoringTypeEnum;
  name: string;
  address: string;
  county: string;
  zipCode: string;
  city: CitiesEnum;
  emails: string[];
  telephones: ClientPhoneInterface[];
  users: ClientUserInterface[];
  contacts: ClientContactInterface[];
  zones: ClientZoneInterface[];
  notes: string;
  location: string;
  patrolOrder: number | null;
  monitorConfig: ClientMonitorConfigInterface;
  latestMonitorSignal?: Date;
  maxNoCommDays: number;
  cameras: ClientCamerasInterface[];
  createdUser: Partial<UserInterface>;
  updatedUser?: Partial<UserInterface>;
}

export interface ClientPhoneInterface {
  telephone: string;
  notes: string;
}
