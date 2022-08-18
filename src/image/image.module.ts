import { Module } from '@nestjs/common';
import { CloudStorageService } from '../common/cloud-storage.service';
import { ImageService } from './image.service';

@Module({
  providers: [ImageService, CloudStorageService],
  exports: [ImageService],
})
export class ImageModule {}
