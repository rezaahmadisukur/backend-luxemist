import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product Name Required' })
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Product Description Required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Product Price Required' })
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Product Stock Required' })
  @Type(() => Number)
  stock: number;
}
