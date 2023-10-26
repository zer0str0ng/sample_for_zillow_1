import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, ValidateIf, ValidateNested } from 'class-validator';
import { IdDTO, UnitServiceAssetDTO } from './../../../dtos';
import { ServiceUnitInterface } from './../../../shared';
import { Type } from 'class-transformer';

export class ServiceUnitDTO implements ServiceUnitInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  user: IdDTO;

  @IsNotEmpty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  unit: IdDTO;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  service?: IdDTO;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(20000000)
  odometer: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(20000000)
  totalAmount: number;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  comments?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/)
  location: string;

  @ValidateIf((o) => !o.id)
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UnitServiceAssetDTO)
  assets: UnitServiceAssetDTO[];
}
