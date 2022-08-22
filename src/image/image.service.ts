import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAvatarByUserId(userId: string) {
    const image = await this.prisma.image.findUnique({ where: { userId } });

    if (!image) {
      throw new BadRequestException(
        `Could not find image with userId ${userId}`,
      );
    }
    return image;
  }

  async updateAvatarByUserId(userId: string, data: UpdateAvatarDto) {
    return this.prisma.image.upsert({
      where: { userId },
      create: { imageUrl: data.avatar, type: 'USER', userId: userId },
      update: { imageUrl: data.avatar, type: 'USER', userId: userId },
    });
  }

  async deleteAvatarByUserId(userId: string) {
    return this.prisma.image.delete({ where: { userId } });
  }
}
