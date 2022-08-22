import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { File } from '../common/file.interface';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './model/club.model';

@ApiTags('Club')
@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @ApiOperation({
    summary: '클럽 목록 조회',
    description: 'Club 모델 전체를 조회합니다.',
  })
  @ApiOkResponse({ type: [Club] })
  @Get()
  findClubs() {
    return this.clubService.findClubs();
  }

  @ApiOperation({
    summary: '클럽 1개 조회',
    description: 'Club 모델 하나를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Club 모델의 Id값입니다.',
    example: 1,
  })
  @ApiOkResponse({ type: Club })
  @Get(':id')
  findClubById(@Param('id') id: number) {
    return this.clubService.findClubById(id);
  }

  
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor('files', 10)) //업로드파일을 10개로 제한
  @ApiOperation({
    summary: '클럽 1개 생성',
    description: 'Club 모델 하나를 생성합니다.',
  })
  @ApiOkResponse({ type: Club })
  @Post()
  createClub(@Body() createClubDto: CreateClubDto) {
   createClubDto.owner = '로그인userid';
   console.log("createClubDto",createClubDto);
   // console.log("files",files);
    return this.clubService.createClub(createClubDto);
  }

  @ApiOperation({
    summary: '클럽 1개 수정',
    description: 'Club 모델 하나를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Club 모델의 Id값입니다.',
    example: 1,
  })
  @ApiOkResponse({ type: Club })
  @Patch(':id')
  updateClub(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.updateClub(id, updateClubDto);
  }

  @ApiOperation({
    summary: '클럽 1개 삭제',
    description: 'Club 모델 하나를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Club 모델의 Id값입니다.',
    example: 1,
  })
  @ApiOkResponse({ type: Club })
  @Delete(':id')
  deleteClub(@Param('id') id: number) {
    return this.clubService.deleteClub(id);
  }
}
