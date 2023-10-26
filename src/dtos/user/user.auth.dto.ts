import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { UserAuthInterface } from './../../shared';

export class UserAuthDTO implements Partial<UserAuthInterface> {
  @IsOptional()
  @IsUUID()
  @MaxLength(255)
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(8096)
  accessToken?: string;
}
