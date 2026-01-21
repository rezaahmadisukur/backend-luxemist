import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { join } from 'path';
import fs from 'fs';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    return await this.prisma.product.create({
      data: {
        ...createProductDto,
        authorId: userId,
      },
    });
  }

  async findAll(search?: string, category?: string) {
    const whereCondition: Prisma.ProductWhereInput = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      whereCondition.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (category && typeof category === 'string' && category !== '') {
      whereCondition.category = category;
    }

    return await this.prisma.product.findMany({
      where: whereCondition,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    // Get old product
    const oldProduct = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!oldProduct) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      throw new NotFoundException('Product Not Found');
    }

    if (file) {
      updateProductDto.cover = file.filename;
    }

    const updateProduct = await this.prisma.product.update({
      where: {
        id: id,
      },
      data: updateProductDto,
    });

    // Delete old cover
    if (file && oldProduct.cover) {
      const oldFilePath = join(process.cwd(), 'uploads', oldProduct.cover);

      if (oldFilePath) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (error) {
          console.error(error);
        }
      }
    }

    return updateProduct;
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    if (product.cover) {
      // make path
      const filePath = join(process.cwd(), 'uploads', product.cover);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error('Failed remove product', error);
        }
      }
    }

    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }
}
