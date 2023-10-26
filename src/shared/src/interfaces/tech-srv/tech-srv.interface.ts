import { TechServicePriorityEnum, TechServiceQuizCategoryEnum, TechServiceStatusEnum } from './../../enums';
import { AssetInterface, BaseEntityInterface, ClientInterface, ProductInterface, ProductPriceInterface, UserInterface } from './..';
import { StringNullableChain } from 'lodash';

export interface TechServiceQuizInterface {
  category: TechServiceQuizCategoryEnum;
  rate: number;
}

export interface TechServiceProductInterface extends BaseEntityInterface {
  quantity: number;
  product: Partial<ProductInterface>;
  priceList?: Partial<ProductPriceInterface>;
  price: number;
}
export interface TechServiceInterface extends BaseEntityInterface {
  serviceNumber?: string;
  technicianUser?: Partial<UserInterface>;
  description: string;
  additionalData: string;
  serviceDate?: Date;
  estimatedMinutes: number;
  serviceDateEnd?: Date;
  status: TechServiceStatusEnum;
  priority: TechServicePriorityEnum;
  client?: Partial<ClientInterface>;
  clientRequired: boolean;
  coordinatorUser?: Partial<UserInterface>;
  financialUser?: Partial<UserInterface>;
  quiz: TechServiceQuizInterface[];
  overallRate?: number; // This is calculated by backend
  products: Partial<TechServiceProductInterface>[];
  extraCharge: number;
  extraChargeComment: string;
  totalAmount: number;
  comments: string;
  location: string;
  assets: AssetInterface[];
}
