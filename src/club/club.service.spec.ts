import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { Category, Club, PrismaClient, User } from '@prisma/client';
import { ImageModule } from '../image/image.module';
import { CategoryModule } from '../category/category.module';
import { PrismaModule } from '../common/prisma.module';
import { UserModule } from '../user/user.module';
import {
  validMockCreateClub,
  validMockUpdateClub,
} from '../../test/utils/mock-club';
import { CategoryService } from '../category/category.service';
import {
  validMockCreateCategory1,
  validMockCreateCategory2,
} from '../../test/utils/mock-category';
import { UserService } from '../user/user.service';
import { validMockUser } from '../../test/utils/mock-user';

describe('ClubService', () => {
  let service: ClubService;
  let testClub: Club;

  let category1: Category;
  let category2: Category;
  let categoryService: CategoryService;
  let user1: User;
  let userService: UserService;

  const prismaClient = new PrismaClient();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule.forTest(prismaClient),
        CategoryModule,
        UserModule,
        ImageModule,
      ],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    categoryService = module.get<CategoryService>(CategoryService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  beforeAll(async () => {
    const preCategory1 = validMockCreateCategory1();
    category1 = await categoryService.createCategory(preCategory1);
    const preCategory2 = validMockCreateCategory2();
    category2 = await categoryService.createCategory(preCategory2);
    const mockData = validMockUser();
    user1 = await userService.createUser(mockData);
  });

  afterAll(async () => {
    await categoryService.deleteCategory(category1.id).catch(console.error);

    await categoryService.deleteCategory(category2.id).catch(console.error);

    await userService.deleteUser(user1.id).catch(console.error);
  });

  describe('createClub', () => {
    it('should be create a category with valid data', async () => {
      const mockData = validMockCreateClub(category1.id, user1.id);
      testClub = await service.createClub(mockData);
      expect(testClub.title).toEqual(mockData.title);
      expect(testClub.max).toEqual(mockData.max);
    });
  });

  describe('findClubById', () => {
    it('sholud return club By Id', async () => {
      const club = await service.findClubById(testClub.id);

      expect(club.id).toEqual(testClub.id);
      expect(club.title).toEqual(testClub.title);
    });

    it('sholud return error When there is no matching club ID', async () => {
      let thrown: Error;
      try {
        await service.findClubById(8800);
      } catch (e) {
        thrown = e as Error;
      }
      expect(thrown).toBeInstanceOf(Error);
      expect(thrown.name).toEqual('NotFoundError');
    });
  });

  describe('findClubs', () => {
    it('sholud return clubs', async () => {
      const clubs = await service.findClubs();
      expect(clubs).toBeInstanceOf(Array);
    });
  });

  describe('update club', () => {
    it('sholud return clubs', async () => {
      const mockUpdateClub = validMockUpdateClub(category2.id, user1.id);
      expect(category2.name).toEqual('게임');
      testClub = await service.updateClub(testClub.id, mockUpdateClub);
      expect(testClub.categoryId).toEqual(mockUpdateClub.categoryId);
    });
  });

  describe('join club', () => {
    it('sholud return error as the owner of the club', async () => {
      //TODO: 예외처리 함수 생성 후 수정하기
      // let thrown: unknown;
      // try {
      //  await service.joinClub(testClub.id, user1.id);
      // } catch (e) {
      //   thrown = e;
      // }
    });
  });

  describe('delete club', () => {
    it('sholud return clubs', async () => {
      const deleteClub = await service.deleteClub(testClub.id);
      expect(deleteClub.title).toEqual(testClub.title);
    });
  });
});
