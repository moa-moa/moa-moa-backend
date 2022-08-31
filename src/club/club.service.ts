import { BadRequestException, Injectable } from '@nestjs/common';
import { Club } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../common/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';

@Injectable()
export class ClubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  // TODO: include 할 객체를 지정해야합니다
  findClubs() {
    return this.prisma.club.findMany({
      include: {
        UserJoinedClub: {
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

    //존재하는 categoryId인지 확인
    await this.categoryService.findCategoryById(+createClubDto.categoryId);

    return await this.prisma.club.create({
      data: {
        categoryId: +createClubDto.categoryId,
        title: createClubDto.title,
        description: createClubDto.description,
        owner: createClubDto.owner,
        max: +createClubDto.max || null,
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
  // async updateClub(id: number, updateClubDto: UpdateClubDto) {
  //   return await this.prisma.club.update({
  //     where: { id },
  //     data: {
  //       categoryId: +updateClubDto.categoryId,
  //       title: updateClubDto.title,
  //       description: updateClubDto.description,
  //       owner: updateClubDto.owner,
  //       max: +updateClubDto.max || null,
  //     },
  //     include: {
  //       ClubImage: {
  //         include: {
  //           Image: true,
  //         },
  //       },
  //     },
  //   });
  // }

  async deleteClub(id: number): Promise<Club> {
    return await this.prisma.club.delete({ where: { id } });
  }

}
