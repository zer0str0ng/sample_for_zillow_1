import { IdDTO } from './../..';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { ProductInterface, ServiceProductTypeEnum } from './../../../shared';
import { ProductPriceDTO } from './';
import { Type } from 'class-transformer';

export class ProductDTO implements ProductInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  @IsNotEmpty()
  @IsEnum(ServiceProductTypeEnum)
  type: ServiceProductTypeEnum;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ValidateNested()
  @Type(() => ProductPriceDTO)
  prices?: ProductPriceDTO[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  comments: string;
}

export class ProductSearchParamsDTO {
  @IsOptional()
  @IsString()
  param?: string;
}
