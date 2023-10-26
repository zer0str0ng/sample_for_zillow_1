import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsDefined, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { AssetDTO, IdDTO } from './..';
import {
  AssetInterface,
  ClientInterface,
  MediaSourceEnum,
  TechServiceInterface,
  TechServicePriorityEnum,
  TechServiceProductInterface,
  TechServiceQuizInterface,
  TechServiceStatusEnum,
  UserInterface,
} from './../../shared';
import { TechServiceQuizDTO } from './';

export class TechServiceDTO implements TechServiceInterface {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsOptional()
  @MaxLength(128)
  @IsString()
  serviceNumber?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  description: string;

  @IsString()
  @MaxLength(1024)
  additionalData: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDTO)
  technicianUser?: Partial<UserInterface>;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  serviceDate?: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(8192)
  estimatedMinutes: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  serviceDateEnd: Date;

  @IsNotEmpty()
  @IsEnum(TechServiceStatusEnum)
  status: TechServiceStatusEnum;

  @IsNotEmpty()
  @IsEnum(TechServicePriorityEnum)
  priority: TechServicePriorityEnum;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDTO)
  client?: Partial<ClientInterface>;

  @IsBoolean()
  clientRequired: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDTO)
  coordinatorUser?: Partial<UserInterface>;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDTO)
  financialUser?: Partial<UserInterface>;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TechServiceQuizDTO)
  quiz: TechServiceQuizInterface[];

  @IsArray()
  @ValidateNested()
  @Type(() => TechServiceProductElementDTO)
  products: Partial<TechServiceProductInterface>[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(999999)
  extraCharge: number;

  @IsString()
  @IsDefined()
  @MaxLength(512)
  extraChargeComment: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(999999)
  totalAmount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(999999)
  overallRate: number;

  @IsString()
  @IsDefined()
  @MaxLength(512)
  comments: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  location: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TechServiceAssetDTO)
  assets: AssetInterface[];
}

export class TechServiceSearchParamsDTO {
  @IsOptional()
  @IsEnum(TechServiceStatusEnum)
  status: TechServiceStatusEnum;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}

export class TechServiceAssetDTO extends AssetDTO {
  @IsNotEmpty()
  @IsEnum(MediaSourceEnum)
  @IsIn([MediaSourceEnum.TECH_SERVICE])
  source: MediaSourceEnum;
}

export class TechServiceProductElementDTO implements TechServiceProductInterface {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(9999)
  quantity: number;

  @IsNotEmpty()
  @Type(() => IdDTO)
  product: IdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDTO)
  priceList?: IdDTO;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(999999)
  price: number;
}
