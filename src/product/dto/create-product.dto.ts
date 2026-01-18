import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product Name Required' })
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Product Price Required' })
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Product Stock Required' })
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  volume?: number;
}
