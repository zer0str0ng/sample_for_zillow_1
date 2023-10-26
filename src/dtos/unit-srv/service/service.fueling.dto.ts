import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, ValidateIf, ValidateNested } from 'class-validator';
import { IdDTO, UnitFuelingAssetDTO } from './../../../dtos';
import { Type } from 'class-transformer';
import { UnitFuelingInterface, UnitInterface, UserInterface } from './../../../shared';

export class UnitFuelingDTO implements UnitFuelingInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  user: UserInterface;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  unit: UnitInterface;

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
  @Max(1000)
  liters: number;

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
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UnitFuelingAssetDTO)
  assets: UnitFuelingAssetDTO[];
}
