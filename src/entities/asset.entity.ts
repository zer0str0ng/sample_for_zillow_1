import { AssetInterface, MediaCategoryEnum, MediaMimeTypesEnum, MediaSourceEnum, MediaStatusEnum } from './../shared';
import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AssetEntity extends BaseEntity implements AssetInterface {
  @Column({
    type: 'enum',
    enum: MediaSourceEnum,
  })
  source: MediaSourceEnum;

  @Column({
    type: 'enum',
    enum: MediaCategoryEnum,
  })
  category: MediaCategoryEnum;

  @Column({
    type: 'enum',
    enum: MediaStatusEnum,
  })
  status: MediaStatusEnum;

  @Column({
    type: 'nvarchar',
    length: 128,
  })
  orgName: string;

  @Column({
    type: 'enum',
    enum: MediaMimeTypesEnum,
    nullable: true,
  })
  mimetype?: MediaMimeTypesEnum;

  @Column({
    type: 'nvarchar',
    length: 512,
    nullable: true,
  })
  url?: string;
}
