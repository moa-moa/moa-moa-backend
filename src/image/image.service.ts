import { BadRequestException, Injectable } from '@nestjs/common';
import { File } from '../common/file.interface';
import { PrismaService } from '../common/prisma.service';
import { Image, Prisma } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}
  async uploadAvatarByUserId(userId: string, avatar: File): Promise<any> {
    if (avatar) {
      //이전 이미지 삭제
      await this.findAvatarByUserId(userId);

      //현 이미지 업로드
      return this.prisma.image.upsert({
        where: { userId },
        create: {
          id: avatar.filename.split('.')[0],
          path: avatar.path,
          type: 'USER',
          userId: userId,
        },
        update: {
          id: avatar.filename.split('.')[0],
          path: avatar.path,
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

  async findImagesByClubId(clubId: number) {
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

  async findImageByIds(ids: string[]) {
    const image = await this.prisma.image.findMany({
      where: { id: { in: ids } },
    });
    if (!image || image.length !== ids.length) {
      throw new BadRequestException('invalid image ids');
    }
    return image;
  }

  async updateImages(clubId: number, afterImageIds: string[]) {
    const beforeImageIds: string[] = [];
    const images = await this.findImagesByClubId(clubId);
    for (const image of images) {
      beforeImageIds.push(image.id);
    }

    //삭제하기
    for (const beforeImageId of beforeImageIds) {
      if (!afterImageIds.includes(beforeImageId)) {
        //새로운 배열에 이전 id가 없는 것 -> 삭제
        this.deleteImage(beforeImageId);
      }
    }

    const newImage = [];
    for (const afterImageId of afterImageIds) {
      if (!beforeImageIds.includes(afterImageId)) {
        newImage.push(afterImageId); //이전 이미지와 다른 것 => 새로 생성된 것 => 연결
      }
    }

    const promise = await this.promiseConnectImages(clubId, newImage);
    const result = await Promise.allSettled(promise);
    const imageIds = result.filter((f) => f.status === 'fulfilled');

    return imageIds;
  }

  async promiseConnectImages(clubId: number, newImageIds: string[]) {
    for (const imageId of newImageIds) {
      await this.prisma.clubImage.upsert({
        where: {
          imageId_clubId: {
            clubId,
            imageId,
          },
        },
        create: { clubId, imageId },
        update: {},
      });
    }
    return newImageIds;
  }

  async createImages(images: File[], clubId?: number) {
    const promise: string[] = await this.promiseCreateImages(images, clubId);
    const result = await Promise.allSettled(promise);
    const imagesInfo = result.map((v) => {
      if (v.status === 'fulfilled') return v.value;
    });
    return imagesInfo;
  }
  async promiseCreateImages(images: File[], clubId?: number) {
    const imagesInfo = [];
    for (const image of images) {
      let query: Prisma.ImageCreateInput;
      query = {
        id: image.filename.split('.')[0],
        path: image.path.replace(/^public|\\+/g, (s) => {
          if (s === 'public')  //public 제거
            return '';
          // 윈도우환경에서 찍히는 \\문자열을 /로 변경
          else return '/';
        }),
        type: 'CLUB',
      };

      if (clubId) {
        query = {
          ...query,
          ClubImage: {
            create: {
              clubId,
            },
          },
        };
      }
      const data = await this.prisma.image.create({ data: query });
      imagesInfo.push({ id: data.id, path: data.path });
    }
    return imagesInfo;
  }

  async deleteImage(imageId: string) {
    return await this.prisma.image.delete({
      where: { id: imageId },
    });
  }
}
