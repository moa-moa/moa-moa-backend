import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { CategoryModule } from '../category/category.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [CategoryModule, ImageModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
