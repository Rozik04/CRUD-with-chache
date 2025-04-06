import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';  // Make sure to define this DTO
import { UpdateCategoryDto } from './dto/update-category.dto';  // Make sure to define this DTO

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const existingCategory = await this.prisma.category.findFirst({where: { name },});

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists!');
    }

    return this.prisma.category.create({data:{name,},});
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  
  async findOne(id: number) {
    const category = await this.prisma.category.findFirst({where: { id }});

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;

    const category = await this.prisma.category.findUnique({where: { id },});

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.update({where: { id },data: {name,},});
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({where: { id },});

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.delete({where: { id },});}
}
