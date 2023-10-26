import { UserRolesEnum } from './../enums';
import { BaseEntityInterface, UnitUserInterface } from './';

export interface UserAuthInterface extends BaseEntityInterface {
  password?: string;
  accessToken?: string;
  forceLogout?: boolean;
}

export interface UserProfileInterface {
  mobileApp?: object;
  webApp?: object;
}

export interface UserInterface extends BaseEntityInterface {
  username: string;
  name: string;
  cellphone?: string;
  email?: string;
  auth?: Partial<UserAuthInterface>;
  roles: UserRolesEnum[];
  assignations?: UnitUserInterface[];
  profile: UserProfileInterface;
}
