import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { UserInterface, UserProfileSourceEnum, UserRolesEnum } from './../../shared';

export class UserProfileDTO implements Partial<UserInterface> {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  username?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @MaxLength(18)
  cellphone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(128)
  email?: string;

  @IsEnum(UserRolesEnum, { each: true })
  @IsOptional()
  roles?: UserRolesEnum[];

  @IsNotEmpty()
  profile: object;
}

export class UserProfileSourceDTO {
  @IsEnum(UserProfileSourceEnum)
  @IsNotEmpty()
  source: UserProfileSourceEnum;
}
