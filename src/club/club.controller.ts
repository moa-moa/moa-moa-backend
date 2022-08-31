import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { File } from '../common/file.interface';
import { ImageService } from '../image/image.service';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { Club } from './model/club.model';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

@ApiTags('Club')
@Controller('club')
export class ClubController {
  constructor(
    private readonly clubService: ClubService,
    private readonly imageService: ImageService,
  ) {}

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

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryId: {
          type: 'string',
          nullable: false,
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        max: {
          type: 'string',
          nullable: true,
        },
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
    summary: '클럽 1개 생성',
    description: 'Club 모델 하나를 생성합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10)) //업로드파일을 10개로 제한
  @ApiCreatedResponse({ type: Club })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createClub(
    @Req() req: Request,
    @UploadedFiles() files: File[],
    @Body() createClubDto: CreateClubDto,
  ) {
    const user = req.user as User;
    createClubDto.owner = user.id;

    const createdClub = await this.clubService.createClub(createClubDto);
    if (files.length > 0) {
      await this.imageService.uploadImageOnClub(createdClub.id, files);
    }
    return await this.findClubById(createdClub.id);
  }

  // TODO:
  // form-data는 key-value로 문자열데이터를 보냅니다.
  // 수정할 데이터만 스프레드연산자(...)로 넘겨야합니다. 그렇게 하려면 type을 일치시키십시오.
  // @ApiOperation({
  //   summary: '클럽 1개 수정',
  //   description: 'Club 모델 하나를 수정합니다.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   required: true,
  //   description: 'Club 모델의 Id값입니다.',
  //   example: 1,
  // })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FilesInterceptor('files', 10)) //업로드파일을 10개로 제한
  // @ApiOkResponse({ type: Club })
  // @UseGuards(AuthGuard('jwt'))
  // @Patch(':id')
  // async updateClub(
  //   @Req() req: Request, @Res() res: Response,
  //   @UploadedFiles() files: File[],
  //   @Body() updateClubDto: UpdateClubDto,
  // ) {

  //   const user = req.user as User;
  //   const id = +req.params.id;

  //   const club = await this.clubService.findClubById(id);
  //   if(!club) return  res.status(403).json({ message: `Could not find Book with id ${id}` });

  //   if(club.owner !== user.id) return  res.status(403).json({ message: "You are not Club owner" });

  //   if (files.length > 0) {
  //     await this.imageService.uploadImageOnClub(id, files);
  //   }
  //   return this.clubService.updateClub(id, updateClubDto);
  // }

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
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteClub(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const id = +req.params.id;

    const club = await this.clubService.findClubById(id);
    if (!club)
      return res
        .status(403)
        .json({ message: `Could not find Club with id ${id}` });

    if (club.owner !== user.id)
      return res.status(403).json({ message: 'You are not Club owner' });

    return this.clubService.deleteClub(id);
  }
}
