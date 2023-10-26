import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsUrl, Max, MaxLength, Min, ValidateIf, ValidateNested } from 'class-validator';
import { BuildingTypeEnum, CitiesEnum, ClientCamerasInterface, ClientInterface, MonitoringTypeEnum, SearchParamsInterface, UserInterface } from './../../shared';
import { ClientContactDTO, ClientUserDTO, ClientMonitorConfigDTO, ClientZoneDTO, ClientPhoneDTO } from './';
import { IdDTO } from './..';
import { Type } from 'class-transformer';

export class ClientDTO implements ClientInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  registerDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  deactivationDate?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(8)
  account: string;

  @IsEnum(BuildingTypeEnum)
  buildingType: BuildingTypeEnum;

  @IsString()
  @IsOptional()
  @MaxLength(128)
  buildingDetails: string;

  @IsBoolean()
  monitoringFlag: boolean;

  @IsOptional()
  @ValidateIf((o) => o.monitoringFlag)
  @IsEnum(MonitoringTypeEnum)
  monitoringType: MonitoringTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  address: string;

  @IsString()
  @MaxLength(64)
  county: string;

  @IsString()
  @MaxLength(5)
  zipCode: string;

  @IsEnum(CitiesEnum)
  city: CitiesEnum;

  @IsString()
  @MaxLength(32)
  location: string;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(64, { each: true })
  emails: string[];

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientPhoneDTO)
  telephones: ClientPhoneDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientUserDTO)
  users: ClientUserDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientContactDTO)
  contacts: ClientContactDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientZoneDTO)
  zones: ClientZoneDTO[];

  @IsString()
  @MaxLength(512)
  notes: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  createdUser: Partial<UserInterface>;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  updatedUser: Partial<UserInterface>;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClientMonitorConfigDTO)
  monitorConfig: ClientMonitorConfigDTO;

  @ValidateIf((_object, value) => value !== null)
  @IsNumber()
  @Min(0)
  @Max(8096)
  patrolOrder: number;

  @IsOptional()
  @IsDate()
  latestMonitorSignal?: Date;

  @IsNumber()
  @Min(0)
  @Max(256)
  maxNoCommDays: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientCamarasDTO)
  cameras: ClientCamerasInterface[];
}

export class ClientCamarasDTO implements ClientCamerasInterface {
  @IsUrl({ require_tld: false })
  link: string;

  @IsString()
  @MaxLength(128)
  notes: string;
}

export class ClientSearchParamsDTO implements SearchParamsInterface {
  @IsOptional()
  @IsString()
  param?: string;
}
