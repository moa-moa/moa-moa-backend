import {
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { parse } from 'path';
import { v4 } from 'uuid';
import { File } from '../common/file.interface';
import { ImageService } from '../image/image.service';
import { User } from './model/user.model';
import { UserService } from './user.service';

const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('accessToken')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {}

  @ApiOperation({
    summary: '프로필사진 업로드',
    description: 'User의 프로필 사진을 업로드합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('avatar/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images/avatar',
        filename: (req, file, cb) => {
          const fileName = parse(file.originalname);
          cb(null, `${v4()}${fileName.ext}` );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
          return cb(null, false); // FileIntercepter is completely ignoring this.
        }
        cb(null, true);
      },
    }),
  )
  async upload(@Req() req: Request, @UploadedFile() file: File) {
    const user = req.user as User;
    const id = user.id;

    await this.imageService.uploadAvatarByUserId(id, file);
    return await this.userService.findUserById(id);
  }

  @ApiOperation({
    summary: '프로필사진 삭제',
    description:
      'User의 업로드한 프로필 사진을 삭제하고 기본프로필로 되돌아갑니다.',
  })
  @ApiOkResponse({ type: User })
  @Delete('avatar/reset')
  async deleteUser(@Req() req: Request) {
    const user = req.user as User;
    const id = user.id;

    await this.imageService.deleteAvatarByUserId(id);
    return await this.userService.findUserById(id);
  }
}
