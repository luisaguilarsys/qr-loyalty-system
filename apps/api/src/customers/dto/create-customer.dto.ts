import { Type } from "class-transformer"
import { IsDate, IsEmail, IsMobilePhone, IsOptional, IsString } from "class-validator"

export class CreateCustomerDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  middleName?: string

  @IsString()
  lastName!: string

  @IsEmail()
  @IsString()
  email!: string

  @IsOptional()
  @IsMobilePhone()
  @IsString()
  phone?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date
}
