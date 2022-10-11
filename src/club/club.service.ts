import { BadRequestException, Injectable } from '@nestjs/common';
import { Club, Prisma } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../common/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  findClubs(options?: Prisma.ClubFindManyArgs): Promise<Club[]> {
    const query: Prisma.ClubFindManyArgs = {};

    if (options?.include) {
      query.include = options.include;
    }
    return this.prisma.club.findMany(query);
  }

  async findClubById(id: number) {
    return await this.prisma.club.findUnique({
      where: { id },
      include: {
        UserJoinedClub: {
          include: {
            User: true,
          },
        },
        UserLikedClub: {
          include: {
            User: true,
          },
        },
        ClubImage: {
          include: {
            Image: true,
          },
        },
      },
    });
  }

  async createClub(createClubDto: CreateClubDto): Promise<Club> {
    if (createClubDto.title.length === 0) {
      throw new BadRequestException('invalid club title');
    }

    const createMany: Prisma.ClubImageCreateManyClubInputEnvelope = {
      data: createClubDto.imageIds.map((imageId) => {
        return { imageId };
      }),
      skipDuplicates: true,
    };

    //존재하는 categoryId인지 확인
    await this.categoryService.findCategoryById(createClubDto.categoryId);
    delete createClubDto.imageIds;

    return await this.prisma.club.create({
      data: {
        ...createClubDto,
        ClubImage: {
          createMany,
        },
      },
      include: {
        ClubImage: {
          include: {
            Image: true,
          },
        },
      },
    });
  }
  async updateClub(id: number, updateClubDto: UpdateClubDto) {
    delete updateClubDto.imageIds;

    return await this.prisma.club.update({
      where: { id },
      data: { ...updateClubDto },
      include: {
        ClubImage: {
          include: {
            Image: true,
          },
        },
      },
    });
  }

  async deleteClub(id: number): Promise<Club> {
    return await this.prisma.club.delete({ where: { id } });
  }

  async joinClub(clubId: number, userId: string) {
    return await this.prisma.userJoinedClub.create({
      data: { userId, clubId },
      include: { User: true, Club: true },
    });
  }

  async likeClub(clubId: number, userId: string) {
    return await this.prisma.userLikedClub.create({
      data: { userId, clubId },
      include: { User: true, Club: true },
    });
  }
  async deleteLikedClub(clubId: number, userId: string) {
    return await this.prisma.userLikedClub.delete({
      where: { userId_clubId: { clubId, userId } },
      include: { User: true, Club: true },
    });
  }

  async leaveClub(clubId: number, userId: string) {
    return await this.prisma.userJoinedClub.delete({
      where: { userId_clubId: { clubId, userId } },
    });
  }
}
