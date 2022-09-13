import { Module } from '@nestjs/common';
import { CloudStorageService } from '../common/cloud-storage.service';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';

@Module({
  providers: [ImageService, CloudStorageService],
  exports: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
