import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
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

  async findByIdAndCheckRT(id: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
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

}
