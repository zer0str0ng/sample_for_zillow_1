import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, MaxLength, ValidateNested } from 'class-validator';
import { UnitDocumentsAssetDTO } from './../..';
import { UnitInterface, EntityAssetInterface, UnitTypeEnum, AssetInterface } from './../../../shared';

export class UnitDTO implements UnitInterface {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  plate: string;

  @IsInt()
  @IsNotEmpty()
  @Max(1000000)
  odometer: number;

  @IsEnum(UnitTypeEnum)
  @IsOptional()
  type: UnitTypeEnum = UnitTypeEnum.DEFAULT;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnitDocumentsAssetDTO)
  assets: AssetInterface[];
}

export class UnitAssetsDTO implements EntityAssetInterface {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UnitDocumentsAssetDTO)
  assets: AssetInterface[];
}
