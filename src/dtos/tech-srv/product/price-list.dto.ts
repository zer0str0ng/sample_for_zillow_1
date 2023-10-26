import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { PriceListInterface } from './../../../shared';

export class PriceListDTO implements PriceListInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  priority: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  comments: string;
}
