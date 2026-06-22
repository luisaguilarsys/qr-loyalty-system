import { IsString,IsOptional } from "class-validator";

export class RegenerateCustomerQrDto {
  @IsOptional()
  @IsString()
  reason?:string;
}