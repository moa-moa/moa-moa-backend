import { Test, TestingModule } from '@nestjs/testing';
import { Category, PrismaClient } from '@prisma/client';
import { validMockCreateCategory } from '../../test/utils/mock-category';
import { PrismaModule } from '../common/prisma.module';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let testCategory: Category;

  const prismaClient = new PrismaClient();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)],
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should be create a category with valid data', async () => {
      const mockData = validMockCreateCategory();
      testCategory = await service.createCategory(mockData);

      expect(testCategory.name).toEqual(mockData.name);
    });
  });

  describe('findcategories', () => {
    it('should return categories', async () => {
      const categories = await service.findCategories();
      expect(categories).toBeInstanceOf(Array);
    });
  });

  describe('findcategoryById', () => {
    it('should return category by id', async () => {
      const category = await service.findCategoryById(testCategory.id);
      expect(category.id).toEqual(testCategory.id);
    });
  });

  describe('updateUser', () => {
    it('sh ould be update a dcategory with valid data', async () => {
      const mockCategory = validMockCreateCategory();
      testCategory = await service.updateCategory(
        testCategory.id,
        mockCategory,
      );

      expect(testCategory.name).toEqual(mockCategory.name);
    });
  });

  describe('deleteCategory', () => {
    it('should be create a dcategory with valid data', async () => {
      const deleteUser = await service.deleteCategory(testCategory.id);

      expect(deleteUser.name).toEqual(testCategory.name);
    });
  });
});
