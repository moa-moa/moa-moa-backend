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

  async uploadImageOnClub(images: File[]) : Promise<number[]> {
    let imageIds =[];
    if (images.length !== 0) {
      //현 이미지 업로드
      images.map(async (image) => {
        const file = await this.cloudStorageService.uploadFile(image, '');

        const createdImage = await this.prisma.image.create({
          data: {
            imageUrl: file.publicUrl,
            imageName: file.name,
            type: 'CLUB',
          },
        });
         imageIds.push(createdImage.id);
      });
    } else {
      throw new BadRequestException(`Image did not transferred`);
    }
    return imageIds;
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
