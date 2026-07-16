import { DateRangeDto } from '@/common/dto/data-range.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { IntersectionType } from '@nestjs/mapped-types';
import { Type, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FindCustomersQueryDto extends IntersectionType(
  PaginationDto,
  DateRangeDto,
) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  memberNumber?: number;

  @IsOptional()
  @IsString()
  qrToken?: string;

  @IsOptional()
  @Transform(({ value }) => value == 'true')
  @IsBoolean()
  isActive?: boolean = true;
}
