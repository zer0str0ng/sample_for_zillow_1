import {
  AlertCronService,
  AlertService,
  AssetService,
  ClientService,
  EventDefinitionService,
  EventService,
  FuelingService,
  PriceListService,
  ProductService,
  ReportService,
  ServiceService,
  ServiceUnitService,
  TechSrvService,
  UnitAssignationService,
  UnitService,
  UnitDocsService,
  UnitOdometerService,
  UserAuthService,
  UserProfileService,
  UserService,
} from './';

export * from './asset';
export * from './client';
export * from './event';
export * from './report';
export * from './tech-srv';
export * from './unit-srv';
export * from './user';

export default [
  AlertCronService,
  AlertService,
  AssetService,
  ClientService,
  EventDefinitionService,
  EventService,
  FuelingService,
  PriceListService,
  ProductService,
  ReportService,
  ServiceService,
  ServiceUnitService,
  TechSrvService,
  UnitAssignationService,
  UnitService,
  UnitDocsService,
  UnitOdometerService,
  UserAuthService,
  UserProfileService,
  UserService,
];
