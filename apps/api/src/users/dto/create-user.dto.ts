import { IsEmail, IsString, IsOptional, MinLength, IsEnum } from 'class-validator'
import { Role } from '@generated/client'

export class CreateUserDto {
  @IsEmail()
  email!:string

  @IsString()
  @MinLength(8)
  password!:string;

  @IsString()
  name!:string;

  @IsOptional()
  @IsEnum(Role)
  role?:Role;

}
