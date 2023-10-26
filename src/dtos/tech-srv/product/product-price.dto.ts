import { IdDTO, PriceListDTO } from './../..';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { ProductPriceInterface } from './../../../shared';
import { Type } from 'class-transformer';

export class ProductPriceDTO implements Partial<ProductPriceInterface> {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  priceList: PriceListDTO;

  @IsNotEmpty()
  @IsBoolean()
  default: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(999999)
  price: number;
}
