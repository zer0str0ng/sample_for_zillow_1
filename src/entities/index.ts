import { AssetEntity, ClientEntity } from './';
import { EventDefinitionEntity, EventEntity, EventHistoryEntity } from './event';
import { PriceListEntity, ProductEntity, ProductPriceEntity, TechServiceEntity, TechServiceProductEntity } from './tech-srv';
import { ServiceAlertEntity, ServiceEntity, ServiceUnitEntity, UnitFuelingEntity, UnitEntity, UnitUserEntity } from './unit-srv';
import { UserEntity, UserAuthEntity } from './user';

export * from './asset.entity';
export * from './client';
export * from './event';
export * from './tech-srv';
export * from './unit-srv';
export * from './user';

export default [
  AssetEntity,
  ClientEntity,
  EventDefinitionEntity,
  EventEntity,
  EventHistoryEntity,
  PriceListEntity,
  ProductEntity,
  ProductPriceEntity,
  ServiceAlertEntity,
  ServiceEntity,
  ServiceUnitEntity,
  TechServiceEntity,
  TechServiceProductEntity,
  UnitEntity,
  UnitFuelingEntity,
  UnitUserEntity,
  UserAuthEntity,
  UserEntity,
];
