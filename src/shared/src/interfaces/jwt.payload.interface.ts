import { UserRolesEnum } from './../';

export interface JwtTokenPayload {
  username: string;
  sub: string;
  roles: UserRolesEnum[];
  iat: number;
  exp: number;
}
