import { BaseEntityInterface } from './..';
import { ServiceProductTypeEnum } from './../../enums';

export interface PriceListInterface extends BaseEntityInterface {
  name: string;
  priority: number; //1-10
  comments: string;
}

export interface ProductPriceInterface extends BaseEntityInterface {
  priceList: PriceListInterface;
  default: boolean;
  price: number;
}

export interface ProductInterface extends BaseEntityInterface {
  name: string;
  type: ServiceProductTypeEnum;
  prices?: ProductPriceInterface[];
  comments: string;
}
