import { BooleanValues } from './../utils';
import { Transform, Type } from 'class-transformer';
import { DateRangeParamsInterface, HeaderEnum, UserRolesEnum } from './../shared';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class IdDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class ValidateByUserDTO {
  @IsUUID()
  @IsNotEmpty()
  [HeaderEnum.USER_ID]: string;
}

export class ValidateByResourceDTO {
  @IsUUID()
  @IsNotEmpty()
  [HeaderEnum.RESOURCE_ID]: string;
}

export class ValidateByRolesDTO {
  @IsArray()
  @IsOptional()
  [HeaderEnum.USER_ROLES]: UserRolesEnum[];
}

export class GetAllDTO {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => BooleanValues.includes(value))
  all?: boolean;
}

export class DateRangeParamsDTO implements DateRangeParamsInterface {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}

export class OptionalDateRangeParamsDTO implements DateRangeParamsInterface {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}
