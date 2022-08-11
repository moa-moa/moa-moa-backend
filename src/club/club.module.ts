import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [CategoryModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
