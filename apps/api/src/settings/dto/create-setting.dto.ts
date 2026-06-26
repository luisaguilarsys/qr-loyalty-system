import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsHexColor,
  IsUrl,
} from 'class-validator';

export class CreateSettingDto {
  @IsString()
  businessName!: string;

  @IsHexColor()
  primaryColor!: string;

  @IsUrl()
  logoUrl!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  pointsPerPeso!: number;
}
