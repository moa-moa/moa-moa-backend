import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaModule } from '../common/prisma.module';
import { PrismaClient, User } from '@prisma/client';
import { validMockUser } from '../../test/utils/mock-user';
import { ImageModule } from '../image/image.module';

describe('UserService', () => {
  let service: UserService;
  let testUser: User;

  const prismaClient = new PrismaClient();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient), ImageModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
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

  describe('findUserById', () => {
    it('should return user by Id', async () => {
      const user = await service.findUserById(testUser.id);

      expect(user.id).toEqual(testUser.id);
      expect(user.name).toEqual(testUser.name);
    });
  });

  describe('deleteUser', () => {
    it('should be create a Product with valid data', async () => {
      const deleteUser = await service.deleteUser(testUser.id);

      expect(deleteUser.name).toEqual(testUser.name);
    });
  });
});
