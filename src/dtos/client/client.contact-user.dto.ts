import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsNumberString, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { ClientContactInterface, ClientPhoneInterface, ClientUserInterface } from './../../shared';
import { Type } from 'class-transformer';

export class ClientUserDTO implements ClientUserInterface {
  @IsString()
  @MaxLength(16)
  number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  @IsString()
  @MaxLength(64)
  keyword: string;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientPhoneDTO)
  telephones: ClientPhoneDTO[];

  @IsString()
  @MaxLength(64)
  relation: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;

  @IsString()
  @MaxLength(255)
  notes: string;
}

export class ClientContactDTO implements ClientContactInterface {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientPhoneDTO)
  telephones: ClientPhoneDTO[];

  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;

  @IsString()
  @MaxLength(255)
  notes: string;
}

export class ClientPhoneDTO implements ClientPhoneInterface {
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(18)
  telephone: string;

  @IsString()
  @MaxLength(255)
  notes: string;
}
