import {
  Bind,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from '../image/image.service';
import { User } from './model/user.model';
import { UserService } from './user.service';

@ApiTags('User')
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
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'User 모델의 Id값입니다.',
    example: '100306381267430826077',
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
  @Post('avatar/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    await this.imageService.uploadAvatarByUserId(id, file);
    return await this.userService.findUserById(id);
  }

  @ApiOperation({
    summary: '프로필사진 삭제',
    description:
      'User의 업로드한 프로필 사진을 삭제하고 기본프로필로 되돌아갑니다.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'User 모델의 Id값입니다.',
    example: '106746348034965777278',
  })
  @ApiOkResponse({ type: User })
  @Delete('avatar/:id')
  async deleteUser(@Param('id') id: string) {
    await this.imageService.deleteAvatarByUserId(id);
    return await this.userService.findUserById(id);
  }
}
