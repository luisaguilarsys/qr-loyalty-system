import { Type, Transform } from 'class-transformer'
import { IsBoolean, IsEmail, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator'

export class FindCustomersQueryDto {
  @IsOptional() @IsString()
  name?: string

  @IsOptional() @IsEmail()
  email?: string

  @IsOptional() @Type(()=> Number) @IsInt() @IsPositive()
  memberNumber?: number

  @IsOptional() @IsString()
  qrToken?: string

  @IsOptional() @Transform(({value})=> value=='true') @IsBoolean()
  isActive?:boolean = true

  @IsOptional() @Type(()=>Number) @IsInt() @Min(1)
  page?: number=1

  @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(100)
  limit?: number=20
}