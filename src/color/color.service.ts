import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';  // Make sure to define this DTO
import { UpdateColorDto } from './dto/update-color.dto';  // Make sure to define this DTO

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createColorDto: CreateColorDto) {
    const { name } = createColorDto;
    const existingColor = await this.prisma.color.findFirst({ where: { name } });

    if (existingColor) {
      throw new BadRequestException('Color with this name already exists!');
    }

    return this.prisma.color.create({ data: { name } });
  }

  async findAll() {
    return this.prisma.color.findMany();
  }

  async findOne(id: number) {
    const color = await this.prisma.color.findUnique({ where: { id } });

    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }

    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    const { name } = updateColorDto;

    const color = await this.prisma.color.findUnique({ where: { id } });

    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }

    return this.prisma.color.update({ where: { id }, data: { name } });
  }

  async remove(id: number) {
    const color = await this.prisma.color.findUnique({ where: { id } });

    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }

    return this.prisma.color.delete({ where: { id } });
  }
}
