import { BadRequestException, Injectable } from '@nestjs/common';
import { File } from '../common/file.interface';
import { CloudStorageService } from '../common/cloud-storage.service';
import { PrismaService } from '../common/prisma.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudStorageService: CloudStorageService,
  ) {}

  async uploadAvatarByUserId(userId: string, avatar: File): Promise<any> {
    if (avatar) {
      //이전 이미지 삭제
      await this.findAvatarByUserId(userId);

      //현 이미지 업로드
      return this.prisma.image.upsert({
        where: { userId },
        create: {
          originalName: avatar.originalname,
          imageName: avatar.filename,
          type: 'USER',
          userId: userId,
        },
        update: {
          originalName: avatar.originalname,
          imageName: avatar.filename,
          type: 'USER',
          userId: userId,
        },
      });
    } else {
      throw new BadRequestException(`Image did not transferred`);
    }
  }
  async findAvatarByUserId(userId: string): Promise<Image> {
    return await this.prisma.image.findUnique({ where: { userId } });
  }

  async deleteAvatarByUserId(userId: string) {
    await this.findAvatarByUserId(userId);
    return this.prisma.image.delete({ where: { userId } });
  }

  async findImageByClubId(clubId: number) {
    const image = await this.prisma.image.findMany({
      where: { ClubImage: { some: { clubId } } },
    });
    if (!image) {
      throw new BadRequestException(
        `Could not find image with userId ${clubId}`,
      );
    }
    return image;
  }

  async uploadImageOnClub(clubId: number, images: File[]) {
    //이전 이미지 삭제
    await this.prisma.image.deleteMany({
      where: { ClubImage: { some: { clubId } } },
    });

    //현 이미지 업로드
    const promise: number[] = await this.saveClubImage(clubId, images);
    const result = await Promise.allSettled(promise);
    const imageIds = result.filter((f) => f.status === 'fulfilled');

    return imageIds;
  }

  async saveClubImage(clubId: number, images: File[]) {
    const imageIds: number[] = [];
    for (const image of images) {
      const data = await this.prisma.image.create({
        data: {
          originalName: image.originalname,
          imageName: image.filename,
          type: 'CLUB',
          ClubImage: {
            create: {
              clubId,
            },
          },
        },
      });
      imageIds.push(data.id);
    }
    return imageIds;
  }

  async findImageByIds(ids: number[]) {
    const image = await this.prisma.image.findMany({
      where: { id: { in: ids } },
    });
    if (!image || image.length !== ids.length) {
      throw new BadRequestException('invalid image ids');
    }
    return image;
  }
}
