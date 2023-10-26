import { BaseEntityInterface } from './';
import { MediaCategoryEnum, MediaMimeTypesEnum, MediaSourceEnum, MediaStatusEnum } from './../enums';

export interface AssetInterface extends BaseEntityInterface {
  mimetype?: MediaMimeTypesEnum;
  source: MediaSourceEnum;
  category: MediaCategoryEnum;
  orgName: string;
  status: MediaStatusEnum;
  url?: string;
}
export interface Base64FileInterface {
  originalname: string;
  mimetype: string;
  base64: string;
}

export interface EntityAssetInterface {
  id: string;
  assets: AssetInterface[];
}
