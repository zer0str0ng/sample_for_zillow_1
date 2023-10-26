import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserAuthDTO } from './../../dtos';
import { UserInterface, UserRolesEnum } from './../../shared';

export class UserDTO implements Partial<UserInterface> {
  @IsUUID()
  @IsOptional()
  @MaxLength(64)
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @MaxLength(18)
  @Transform(({ value }) => (value?.trim().length ? value?.trim() : null))
  cellphone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(128)
  @Transform(({ value }) => (value?.trim().length ? value?.trim() : null))
  email?: string;

  @IsEnum(UserRolesEnum, { each: true })
  @IsNotEmpty()
  roles: UserRolesEnum[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UserAuthDTO)
  auth?: Partial<UserAuthDTO>;
}
