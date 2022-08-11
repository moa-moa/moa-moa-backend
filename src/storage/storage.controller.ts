import { Body, Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StorageFile } from './storage.file';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
    constructor(private storageService: StorageService) {}

    @Post()
    @UseInterceptors(
      FileInterceptor("file", {
        limits: {
          files: 1,
          fileSize: 1024 * 1024,
        },
      })
    )
    async uploadMedia(
      @UploadedFile() file,
      @Body("mediaId") mediaId: string
    ) {
      await this.storageService.save(
        "media/" + mediaId,
        file.mimetype,
        file.buffer,
        [{ mediaId: mediaId }]
      );
    }
  
    @Get("/:mediaId")
    async downloadMedia(@Param("mediaId") mediaId: string, @Res() res: Response) {
      let storageFile: StorageFile;
      try {
        storageFile = await this.storageService.get("media/" + mediaId);
      } catch (e) {
       
          throw new NotFoundException("image not found");
       
      }
      res.setHeader("Content-Type", storageFile.contentType);
      res.setHeader("Cache-Control", "max-age=60d");
      res.end(storageFile.buffer);
    }
}
