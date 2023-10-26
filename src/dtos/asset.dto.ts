import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AssetInterface, Base64FileInterface, MediaCategoryEnum, MediaSourceEnum, MediaStatusEnum } from './../shared';

export class AssetDTO implements AssetInterface {
  @IsNotEmpty()
  @IsEnum(MediaSourceEnum)
  source: MediaSourceEnum;

  @IsNotEmpty()
  @IsEnum(MediaCategoryEnum)
  category: MediaCategoryEnum;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  orgName: string;

  @IsNotEmpty()
  @IsIn([MediaStatusEnum.PENDING, MediaStatusEnum.UPLOADED])
  status: MediaStatusEnum;
}

export class AssetParamsDTO implements Partial<AssetInterface> {
  @IsOptional()
  @IsEnum(MediaSourceEnum)
  source: MediaSourceEnum;

  @IsOptional()
  @IsEnum(MediaCategoryEnum)
  category: MediaCategoryEnum;

  @IsOptional()
  @IsEnum(MediaStatusEnum)
  status: MediaStatusEnum;
}

export class UnitFuelingAssetDTO extends AssetDTO {
  @IsNotEmpty()
  @IsEnum(MediaSourceEnum)
  @IsIn([MediaSourceEnum.UNIT_FUELING])
  source: MediaSourceEnum;
}

export class UnitServiceAssetDTO extends AssetDTO {
  @IsNotEmpty()
  @IsEnum(MediaSourceEnum)
  @IsIn([MediaSourceEnum.UNIT_SERVICE])
  source: MediaSourceEnum;
}

export class UnitDocumentsAssetDTO extends AssetDTO {
  @IsNotEmpty()
  @IsEnum(MediaSourceEnum)
  @IsIn([MediaSourceEnum.UNIT_DOCUMENTS])
  source: MediaSourceEnum;
}

export class UnitAssignationAssetDTO extends AssetDTO {
  @IsNotEmpty()
  @IsEnum(MediaSourceEnum)
  @IsIn([MediaSourceEnum.UNIT_ASSIGNATION])
  source: MediaSourceEnum;
}

export class Base64FileDTO implements Base64FileInterface {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  originalname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  mimetype: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10485760)
  base64: string;
}
