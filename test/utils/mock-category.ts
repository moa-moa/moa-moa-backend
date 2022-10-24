import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';

export const validMockCreateCategory1 = (): CreateCategoryDto => ({
  name: '일상',
  backColor: '#000000',
});

export const validMockCreateCategory2 = (): CreateCategoryDto => ({
  name: '게임',
  backColor: '#ffff00',
});

export const validMockUpdateCategory = (): UpdateCategoryDto => ({
  name: '일상',
  backColor: '#000000',
});
