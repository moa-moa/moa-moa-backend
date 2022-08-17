import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateAvatarDto } from 'src/image/dto/update-avatar.dto';
import { ImageService } from 'src/image/image.service';
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
    summary: '프로필사진 변경',
    description: 'User의 프로필 사진을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'User 모델의 Id값입니다.',
    example: '106746348034965777278',
  })
  @ApiOkResponse({ type: User })
  @Patch('avatar/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ) {
    await this.imageService.updateAvatarByUserId(id, updateAvatarDto);
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
