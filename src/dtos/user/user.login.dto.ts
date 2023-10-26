import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserInterface } from './../../shared';

export class UserLoginDTO implements Partial<UserInterface> {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  password: string;
}
