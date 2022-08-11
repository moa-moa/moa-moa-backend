import { BadRequestException, Injectable } from '@nestjs/common';
import { Club } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from '../common/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  findClubs() {
    return this.prisma.club.findMany();
  }
  findClubById(id: number) {
    return this.prisma.club.findUnique({ where: { id } });
  }
  async createClub(createClubDto: CreateClubDto): Promise<Club> {
    if (createClubDto.title.length === 0) {
      throw new BadRequestException('invalid club title');
    }

    //존재하는 categoryId인지 확인
    await this.categoryService.findCategoryById(createClubDto.categoryId);

    return await this.prisma.club.create({ data: createClubDto });
  }
  async updateClub(id: number, updateClubDto: UpdateClubDto) {
    return await this.prisma.club.update({
      where: { id },
      data: updateClubDto,
    });
  }

  async deleteClub(id: number): Promise<Club> {
    return await this.prisma.club.delete({ where: { id } });
  }
}
