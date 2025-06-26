import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsOptional()
  subscriptionStartDate?: string;

  @IsOptional()
  subscriptionEndDate?: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
