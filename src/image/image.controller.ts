import {
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { File } from 'src/common/file.interface';
import { ImageService } from './image.service';

const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

@ApiTags('Image')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          nullable: true,
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: '(클럽 내) 이미지 생성',
    description: '(클럽에 들어갈) 이미지들을 생성합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './images/club',
        filename: (req, file, cb) => {
          const fileNameSplit = file.originalname.split('.');
          const fileExt = fileNameSplit[fileNameSplit.length - 1];
          cb(null, `${Date.now()}.${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
          return cb(null, false); // FileIntercepter is completely ignoring this.
          // return cb(new Error('This extension is not allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Post('club')
  async uploadFile(@Req() req: Request, @UploadedFiles() files: File[]) {
    return await this.imageService.createImages(files);
  }
}
