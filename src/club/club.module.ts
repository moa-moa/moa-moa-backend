import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { CategoryModule } from '../category/category.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CategoryModule, ImageModule, UserModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
