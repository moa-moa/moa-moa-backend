import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaModule } from '../common/prisma.module';
import { PrismaClient, User } from '@prisma/client';
import { validMockUpdateUser, validMockUser } from '../../test/utils/mock-user';

describe('UserService', () => {
  let service: UserService;
  let testUser: User;

  const prismaClient = new PrismaClient();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUsers', () => {
    it('should return users', async () => {
      const users = await service.findUsers();
      expect(users).toBeInstanceOf(Array);
    });
  });

  describe('createUser', () => {
    it('should be create a user with valid data', async () => {
      const mockData = validMockUser();
      testUser = await service.createUser(mockData);

      expect(testUser.name).toEqual(mockData.name);
    });
  });

  describe('updateUser', () => {
    it('should be update a user with valid data', async () => {
      const mockUpdateData = validMockUpdateUser();
      testUser = await service.updateUser(testUser.id, mockUpdateData);

      expect(testUser.name).toEqual(mockUpdateData.name);
    });
  });

  describe('deleteUser', () => {
    it('should be create a Product with valid data', async () => {
      const deleteUser = await service.deleteUser(testUser.id);

      expect(deleteUser.name).toEqual(testUser.name);
    });
  });
});
