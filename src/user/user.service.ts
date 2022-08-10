import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByProviderIdOrSave(data: CreateUserDto) {
    const user = await this.prisma.user.upsert({
      where: {
        id: data.id,
      },
      update: {},
      create: {
        id: data.id,
        provider: data.provider,
        email: data.email,
        name: data.name,
      },
    });

    return user;
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: createDto });
  }

  async updateUser(id: string, updateDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({ where: { id }, data: updateDto });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}