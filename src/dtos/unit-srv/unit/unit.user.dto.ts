import { ArrayNotEmpty, IsArray, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsUUID, Max, ValidateNested } from 'class-validator';
import { IdDTO, UnitAssignationAssetDTO } from './../..';
import { Type } from 'class-transformer';
import { UnitStatusEnum, UnitUserInterface } from './../../../shared';

export class UnitUserDTO implements Partial<UnitUserInterface> {
  @IsUUID()
  @IsOptional()
  id?: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => IdDTO)
  user: IdDTO;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => IdDTO)
  unit: IdDTO;

  @IsInt()
  @IsNotEmpty()
  @Max(1000000)
  initOdometer: number;

  @IsEnum(UnitStatusEnum)
  @IsOptional()
  status?: UnitStatusEnum;
}

export class AdminUnitAssignationUpdateDTO implements Partial<UnitUserInterface> {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsIn([UnitStatusEnum.CANCELLED, UnitStatusEnum.FINISHED])
  @IsOptional()
  status: UnitStatusEnum;
}

export class UserUnitAssignationUpdateDTO implements Partial<UnitUserInterface> {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsIn([UnitStatusEnum.ASSIGNED])
  @IsOptional()
  status: UnitStatusEnum;

  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UnitAssignationAssetDTO)
  assets: UnitAssignationAssetDTO[];
}
