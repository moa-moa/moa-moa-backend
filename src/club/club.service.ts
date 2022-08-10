import { Injectable } from '@nestjs/common';
import { Club } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubService {
  constructor(private readonly prisma: PrismaService) {}

  findClubs() {
    return this.prisma.club.findMany();
  }
  findClubById(id: number) {
    return this.prisma.club.findUnique({ where: { id } });
  }
  async createClub(createClubDto: CreateClubDto) {
    return 'test';
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
