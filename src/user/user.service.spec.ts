import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaModule } from '../common/prisma.module';
import { PrismaClient } from '@prisma/client';
import { User } from './model/user.model';
import {
  validMockUpdateAvatar,
  validMockUser,
} from '../../test/utils/mock-user';
import { ImageService } from '../image/image.service';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let imageService: ImageService;
  let testUser: User;

  const prismaClient = new PrismaClient();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)],
      providers: [UserService, ImageService],
    }).compile();

    service = module.get<UserService>(UserService);
    imageService = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be create a user with valid data', async () => {
      const mockData = validMockUser();
      testUser = await service.createUser(mockData);

      expect(testUser.name).toEqual(mockData.name);
    });
  });

  describe('findUsers', () => {
    it('should return users', async () => {
      const users = await service.findUsers();
      expect(users).toBeInstanceOf(Array);
    });
  });
  describe('updateUserAvatar', () => {
    it('should be update a user with avatarUrl', async () => {
      const mockImageUrl = validMockUpdateAvatar();
      const image = await imageService.updateAvatarByUserId(
        testUser.id,
        mockImageUrl,
      );
      testUser = await service.findUserById(testUser.id);

      expect(image.userId).toEqual(testUser.id);
      expect(image.imageUrl).toEqual(mockImageUrl.avatar);
      expect(image.type).toEqual('USER');
    });
  });

  describe('deleteUserAvatar', () => {
    it('should be delete a user avatar', async () => {
      let thrown;
      try {
        await imageService.deleteAvatarByUserId(testUser.id);
        await imageService.findAvatarByUserId(testUser.id);
      } catch (e) {
        thrown = e;
      }
      expect(thrown).toBeTruthy();
      expect(thrown).toBeInstanceOf(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should be create a Product with valid data', async () => {
      const deleteUser = await service.deleteUser(testUser.id);

      expect(deleteUser.name).toEqual(testUser.name);
    });
  });
});
