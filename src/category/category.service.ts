import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  findCategories(options?: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    console.log(options);
    const query: Prisma.CategoryFindManyArgs = {};

    if (options?.include) {
      query.include = options.include;
    }

    return this.prisma.category.findMany(query);
  }

  findCategoryById(id: number): Promise<Category> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.prisma.category.create({ data: createCategoryDto });
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: number): Promise<Category> {
    return await this.prisma.category.delete({ where: { id } });
  }
}
