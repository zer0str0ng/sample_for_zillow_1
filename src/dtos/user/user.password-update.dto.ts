import { IsNotEmpty, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAuthDTO } from './../../dtos';
import { UserInterface } from './../../shared';

export class UserPasswordUpdateDTO implements Partial<UserInterface> {
  @IsUUID()
  @IsNotEmpty()
  @MaxLength(64)
  id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserAuthDTO)
  auth?: Partial<UserAuthDTO>;
}
