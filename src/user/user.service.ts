import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findUserById(id: string, options?: boolean): Promise<User> {
    const query: Prisma.UserFindUniqueArgs = {
      where: {
        id,
      },
    };
    if (options) {
      query.include = {
        UserJoinedClub: true,
        UserLikedClub: true,
        Club: true,
      };
    }

    return await this.prisma.user.findUnique(query);
  }

  async findByIdOrSaveOrTokenUpdate(data: CreateUserDto) {
    const user = await this.prisma.user.upsert({
      where: {
        id: data.id,
      },
      update: {
        hashedRt: data.hashedRt,
      },
      create: {
        id: data.id,
        provider: data.provider,
        email: data.email,
        name: data.name,
        hashedRt: data.hashedRt,
      },
    });

    return user;
  }
  async updateHashedRefreshToken(id: string, rt: string) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        hashedRt: rt,
      },
    });

    return user;
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: createDto });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }

  async findByIdAndCheckRT(id: string, rt: string): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    const match = await argon.verify(user.hashedRt, rt);
    if (match) return user;
    else throw new Error('Refresh Tokens do not match.');
  }

  async logout(id: string) {
    return await this.prisma.user.updateMany({
      where: {
        id,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async myCreatedClub(userId: string) {
    return await this.prisma.club.findMany({
      where: {
        owner: userId,
      },
    });
  }

  async myLikedClub(userId: string) {
    return await this.prisma.userLikedClub.findMany({
      where: {
        userId,
      },
    });
  }

  async myJoinedClub(userId: string) {
    return await this.prisma.userJoinedClub.findMany({
      where: {
        userId,
      },
    });
  }
}
