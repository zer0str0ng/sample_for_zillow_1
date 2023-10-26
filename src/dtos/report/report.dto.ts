import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ReportFormatEnum, ReportParamsInterface, ReportTypeEnum } from './../../shared';

export class ReportParamsDTO implements ReportParamsInterface {
  @IsISO8601()
  @IsOptional()
  startDate?: Date;

  @IsISO8601()
  @IsOptional()
  endDate?: Date;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  unitId?: string;

  @IsEnum(ReportTypeEnum)
  @IsNotEmpty()
  type: ReportTypeEnum;

  @IsEnum(ReportFormatEnum)
  @IsNotEmpty()
  format: ReportFormatEnum;
}
