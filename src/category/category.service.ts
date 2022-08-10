import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  findCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }
}
