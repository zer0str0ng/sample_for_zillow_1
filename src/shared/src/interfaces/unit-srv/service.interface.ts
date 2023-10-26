import { ServiceAlertStatusEnum, ServiceFreqTypeEnum, ServicePriorityEnum } from './../../enums';
import { AssetInterface, BaseEntityInterface, UnitInterface, UserInterface } from './..';

export interface ServiceInterface extends BaseEntityInterface {
  name: string;
  freqType: ServiceFreqTypeEnum;
  params: ServiceParamTimeInterface | ServiceParamOdometerInterface;
  priority: ServicePriorityEnum;
  alertActive: boolean;
}

export interface ServiceParamTimeInterface {
  defDays: number;
  defInitDate: Date;
  custom?: ServiceCustomParamInterface[];
}

export interface ServiceParamOdometerInterface {
  defKilometers: number;
  custom?: ServiceCustomParamInterface[];
}

export interface ServiceCustomParamInterface {
  unitId: string;
  days?: number;
  initDate?: Date;
  kilometers?: number;
}

export interface ServiceUnitInterface extends BaseEntityInterface {
  user: Partial<UserInterface>;
  unit: Partial<UnitInterface>;
  service?: Partial<ServiceInterface>;
  date: Date;
  odometer: number;
  totalAmount: number;
  comments?: string;
  location: string;
  assets: AssetInterface[];
}

export interface ServiceAlertInterface extends BaseEntityInterface {
  user: Partial<UserInterface>;
  unit: Partial<UnitInterface>;
  service: Partial<ServiceInterface>;
  status: ServiceAlertStatusEnum;
  expectedBeforeDate?: Date;
  expectedOffsetDays?: number;
  expectedBeforeOdometer?: number;
  expectedOffsetOdometer?: number;
  activatedDate: Date;
  lastActivatedDate: Date;
  dismissedBy?: Partial<UserInterface>;
  dismissedDate?: Date;
  dismissUntilDate?: Date;
  dismissUntilOdometer?: number;
}

export interface ServiceAlertPivotInterface {
  expectedPivotValue: number;
  offset: number;
}

export interface ServiceAlertDismissInterface {
  id: string;
  status: ServiceAlertStatusEnum;
  dismissForKilometers?: number;
  dismissForDays?: number;
}
