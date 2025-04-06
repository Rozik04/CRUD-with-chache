import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    price: number;
    @IsString()
    @IsNotEmpty()
    colorId: number;
    @IsString()
    @IsNotEmpty()
    categoryId: number;
  }
  