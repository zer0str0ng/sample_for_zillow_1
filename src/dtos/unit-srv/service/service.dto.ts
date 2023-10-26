import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { ServiceCustomParamInterface, ServiceFreqTypeEnum, ServiceInterface, ServiceParamOdometerInterface, ServiceParamTimeInterface, ServicePriorityEnum } from './../../../shared';

export class ServiceDTO implements ServiceInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEnum(ServiceFreqTypeEnum)
  @IsNotEmpty()
  freqType: ServiceFreqTypeEnum;

  @IsNotEmpty()
  @ValidateNested()
  @Type((o) => (o.newObject.freqType === ServiceFreqTypeEnum.TIME ? ServiceParamTimeDTO : ServiceParamOdometerDTO))
  params: ServiceParamOdometerDTO | ServiceParamTimeDTO;

  @IsEnum(ServicePriorityEnum)
  @IsNotEmpty()
  priority: ServicePriorityEnum;

  @IsBoolean()
  @IsNotEmpty()
  alertActive: boolean;
}

export class ServiceParamOdometerDTO implements ServiceParamOdometerInterface {
  @IsNumber()
  @Min(0)
  @Max(10000000)
  @IsNotEmpty()
  defKilometers: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceCustomParamOdometerDTO)
  custom?: ServiceCustomParamOdometerDTO[];
}

export class ServiceParamTimeDTO implements ServiceParamTimeInterface {
  @IsNumber()
  @Min(0)
  @Max(10000000)
  @IsNotEmpty()
  defDays: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  defInitDate: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceCustomParamTimeDTO)
  custom?: ServiceCustomParamTimeDTO[];
}

export class ServiceCustomParamDTO implements ServiceCustomParamInterface {
  @IsUUID()
  @IsNotEmpty()
  unitId: string;
}

export class ServiceCustomParamTimeDTO extends ServiceCustomParamDTO implements ServiceCustomParamInterface {
  @IsNumber()
  @Min(0)
  @Max(10000000)
  @IsOptional()
  days?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  initDate?: Date;
}

export class ServiceCustomParamOdometerDTO extends ServiceCustomParamDTO implements ServiceCustomParamInterface {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10000000)
  kilometers?: number;
}
