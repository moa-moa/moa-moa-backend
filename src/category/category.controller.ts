import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './model/category.model';
@ApiTags('Category')
@UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: 'Cateogry 모델 전체를 조회합니다.',
  })
  @ApiQuery({
    name: 'club',
    description: '속한 클럽 정보를 함께 가져올지 결정합니다.',
    type: Boolean,
    required: false,
  })
  @ApiOkResponse({ type: [Category] })
  @Get()
  findCategories(@Query('club') club?: boolean) {
    return this.categoryService.findCategories({
      include: buildQuery({ club }).include,
    });
  }

  @ApiOperation({
    summary: '카테고리 1개 조회',
    description: 'Cateogry 모델 하나를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Cateogry 모델의 Id값입니다.',
    example: 1,
  })
  @ApiOkResponse({ type: Category })
  @Get(':id')
  findCategoryById(@Param('id') id: number) {
    return this.categoryService.findCategoryById(id);
  }

  @ApiOperation({
    summary: '카테고리 1개 생성',
    description: 'Cateogry 모델 하나를 생성합니다.',
  })
  @ApiCreatedResponse({ type: Category })
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({
    summary: '카테고리 1개 수정',
    description: 'Cateogry 모델 하나를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Cateogry 모델의 Id값입니다.',
    example: 1,
  })
  @ApiOkResponse({ type: Category })
  @Patch(':id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: '카테고리 1개 삭제',
    description: 'Cateogry 모델 하나를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Cateogry 모델의 Id값입니다.',
    example: 1,
  })
  @ApiOkResponse({ type: Category })
  @Delete(':id')
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}

export type BuildQueryOptions = {
  club: boolean;
};

function buildQuery(
  options?: Partial<BuildQueryOptions>,
): Prisma.CategoryFindManyArgs {
  const query: Prisma.CategoryFindManyArgs = {};
  if (!options) {
    return query;
  }

  const { club } = options;

  if (club) {
    query.include = {
      Club: true,
    };
  }

  return query;
}
