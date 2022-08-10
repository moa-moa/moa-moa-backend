import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './model/category.model';
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: 'Cateogry 모델 전체를 조회합니다.',
  })
  @ApiOkResponse({ type: [Category] })
  @Get()
  findCategories() {
    return this.categoryService.findCategories();
  }

  @ApiOperation({
    summary: '카테고리 목록 조회2',
    description: 'Cateogry 모델 전체를 조회합니다.',
  })
  @ApiOkResponse({ type: [Category] })
  @Get('/1')
  findCategory() {
    return this.categoryService.findCategories();
  }
}
