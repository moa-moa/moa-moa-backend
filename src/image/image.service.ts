import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudStorageService } from '../common/cloud-storage.service';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudStorageService: CloudStorageService,
  ) {}

  async uploadAvatarByUserId(userId: string, avatar: Express.Multer.File) {
    if (avatar) {
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
}
