import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  productName: string;

  // @IsNotEmpty()
  // @IsNumber()
  // @Type(() => Number)
  // @Min(1)
  // quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  price: number;
}
