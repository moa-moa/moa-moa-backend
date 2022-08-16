import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from '../common/prisma.module';
import { AtStrategy } from '../auth/at.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, AtStrategy],
  exports: [CategoryService],
})
export class CategoryModule {}
