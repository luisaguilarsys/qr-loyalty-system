import { IsNumber, Min, Max, IsUUID, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@generated/enums';

export class CreatePointDto {
  @IsUUID()
  customerId!: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  points!: number;

  @IsString()
  description!: string;
}
