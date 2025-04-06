import { IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsOptional()
    price?: number;
    @IsString()
    @IsOptional()
    colorId?: number;
    @IsString()
    @IsOptional()
    categoryId?: number;
  }
  