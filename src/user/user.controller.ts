import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './model/user.model';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Patch(':id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
