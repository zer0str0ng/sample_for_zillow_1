export enum UserRolesEnum {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  DEBT = 'DEBT',
  TECHNICIAN = 'TECHNICIAN',
  UNIT_OPERATOR = 'UNIT_OPERATOR',
  EXTERNAL = 'EXTERNAL',
}

export const AdminRoles = [UserRolesEnum.ROOT, UserRolesEnum.ADMIN, UserRolesEnum.COORDINATOR];

export enum UserProfileSourceEnum {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}
