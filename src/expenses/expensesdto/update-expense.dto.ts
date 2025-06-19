import { IsString, IsInt, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  productName: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;
}
