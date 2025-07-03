import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsString()
  userToChange: string;

  @IsNotEmpty()
  @IsString()
  newRole: string;
}
