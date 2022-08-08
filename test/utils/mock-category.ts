import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';

export const validMockCreateCategory = (): CreateCategoryDto => ({
  name: '일상',
  backColor: '#000000',
});

export const validMockUpdateCategory = (): UpdateCategoryDto => ({
  name: '일상',
  backColor: '#000000',
});
