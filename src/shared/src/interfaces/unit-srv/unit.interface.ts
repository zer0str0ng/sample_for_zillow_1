import { UnitStatusEnum, UnitTypeEnum } from './../..';
import { AssetInterface, BaseEntityInterface, UserInterface } from './..';

export interface UnitInterface extends BaseEntityInterface {
  description: string;
  plate: string;
  odometer: number;
  assignations?: UnitUserInterface[];
  type: UnitTypeEnum;
  assets?: AssetInterface[];
}

export interface UnitUserInterface extends BaseEntityInterface {
  user: Partial<UserInterface>;
  unit: Partial<UnitInterface>;
  initOdometer: number;
  status: UnitStatusEnum;
  assets: AssetInterface[];
}

export interface UnitFuelingInterface extends BaseEntityInterface {
  user: Partial<UserInterface>;
  unit: Partial<UnitInterface>;
  date: Date;
  odometer: number;
  liters: number;
  performance?: number;
  totalAmount: number;
  comments?: string;
  location: string;
  assets: AssetInterface[];
}
