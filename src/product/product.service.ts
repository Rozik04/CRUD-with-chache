import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';  // Make sure to define this DTO
import { UpdateProductDto } from './dto/update-product.dto';  // Make sure to define this DTO

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, price, colorId, categoryId } = createProductDto;
    const existingProduct = await this.prisma.product.findFirst({ where: { name, categoryId, colorId } });

    if (existingProduct) {
      throw new BadRequestException('Product with this name already exists in the selected category and color!');
    }

    return this.prisma.product.create({
      data: { name, price, colorId, categoryId },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        color: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        color: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, price, colorId, categoryId } = updateProductDto;

    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id },
      data: { name, price, colorId, categoryId },
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.delete({ where: { id } });
  }
}
