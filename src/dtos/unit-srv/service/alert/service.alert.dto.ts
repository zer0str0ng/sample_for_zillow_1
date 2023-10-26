import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsUUID, Max, Min, ValidateIf } from 'class-validator';
import { ServiceAlertDismissInterface, ServiceAlertStatusEnum } from '../../../../shared';

export class ServiceAlertUpdateDTO implements ServiceAlertDismissInterface {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsIn([ServiceAlertStatusEnum.DISMISSED])
  @IsNotEmpty()
  status: ServiceAlertStatusEnum;

  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => !o.dismissForDays)
  @Min(0)
  @Max(10000000)
  dismissForKilometers?: number;

  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => !o.dismissForKilometers)
  @Min(0)
  @Max(10000000)
  dismissForDays?: number;
}

export class ServiceAlertQueryDTO {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  serviceId?: string;
}
