import { IsNotEmpty, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { EventHistoryInterface, UserInterface } from './../../shared';
import { Type } from 'class-transformer';
import { IdDTO } from './../misc.dto';

export class EventHistoryDTO implements EventHistoryInterface {
  @IsString()
  @MaxLength(512)
  @MinLength(1)
  info: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IdDTO)
  user: Partial<UserInterface>;
}
