import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { TechServiceQuizCategoryEnum, TechServiceQuizInterface } from './../../shared';

export class TechServiceQuizDTO implements TechServiceQuizInterface {
  @IsNotEmpty()
  @IsEnum(TechServiceQuizCategoryEnum)
  category: TechServiceQuizCategoryEnum;

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rate: number;
}
