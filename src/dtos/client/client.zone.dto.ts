import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ClientZoneInterface } from './../../shared';

export class ClientZoneDTO implements ClientZoneInterface {
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  zone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  protectedArea: string;

  @IsString()
  @MaxLength(255)
  notes: string;
}
