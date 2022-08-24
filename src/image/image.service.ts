import { BadRequestException, Injectable } from '@nestjs/common';
import { File } from '../common/file.interface';
import { CloudStorageService } from '../common/cloud-storage.service';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudStorageService: CloudStorageService,
  ) {}

  async uploadAvatarByUserId(userId: string, avatar: File) :Promise<any>{
    if (avatar) {
      //이전 이미지 삭제
      const userAvatar = await this.findAvatarByUserId(userId);
      await this.cloudStorageService.removeFile(userAvatar.imageName);

      //현 이미지 업로드
      const file = await this.cloudStorageService.uploadFile(avatar, '');

      return this.prisma.image.upsert({
        where: { userId },
        create: {
          imageUrl: file.publicUrl,
          imageName: file.name,
          type: 'USER',
          userId: userId,
        },
        update: {
          imageUrl: file.publicUrl,
          imageName: file.name,
          type: 'USER',
          userId: userId,
        },
      });
    } else {
      throw new BadRequestException(`Image did not transferred`);
    }
  }
  async findAvatarByUserId(userId: string) {
    const image = await this.prisma.image.findUnique({ where: { userId } });

    if (!image) {
      throw new BadRequestException(
        `Could not find image with userId ${userId}`,
      );
    }
    return image;
  }

  async deleteAvatarByUserId(userId: string) {
    const userAvatar = await this.findAvatarByUserId(userId);
    await this.cloudStorageService.removeFile(userAvatar.imageName);
    return this.prisma.image.delete({ where: { userId } });
  }

  async findImageByClubId(clubId: number) {
    const image = await this.prisma.image.findMany({ where: { ClubImage: {some: {clubId}} } });
    if (!image) {
      throw new BadRequestException(
        `Could not find image with userId ${clubId}`,
      );
    }
    return image;
  }

  async uploadImageOnClub(clubId: number , images: File[]): Promise<void>{
    if (images.length !== 0) {
      //이전 이미지 삭제
      const clubImages = await this.findImageByClubId(clubId);
      clubImages.map(async (image) => {
        await this.cloudStorageService.removeFile(image.imageName);
      })
      await this.prisma.image.deleteMany({where: {ClubImage: {some: {clubId},}}})
      
      //현 이미지 업로드
      images.map(async (image) => {
        const file = await this.cloudStorageService.uploadFile(image, '');

        await this.prisma.image.create({
          data: {
            imageUrl: file.publicUrl,
            imageName: file.name,
            type: 'CLUB',
            ClubImage: {
              create: {
                clubId
              }
            }
          },
        });
      });
    } else {
      throw new BadRequestException(`Image did not transferred`);
    }
  }

  

  async findImageByIds(ids: number[]) {
    const image =  await this.prisma.image.findMany({
      where: { id: { in: ids } },
    });
    if(!image || image.length !== ids.length){
      throw new BadRequestException('invalid image ids');
    }
    return image;
  }
}
