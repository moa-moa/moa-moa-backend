import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { File } from '../common/file.interface';
import { ImageService } from '../image/image.service';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { Club } from './model/club.model';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Prisma, User } from '@prisma/client';
import { UpdateClubDto } from './dto/update-club.dto';

@ApiTags('Club')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
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
  @ApiQuery({
    name: 'joinedUser',
    description: '클럽에 참여한 유저정보를 함께 가져올지 결정합니다.',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'likedUser',
    description: '클럽을 찜한 유저정보를 함께 가져올지 결정합니다.',
    type: Boolean,
    required: false,
  })
  @ApiOkResponse({ type: [Club] })
  @Get()
  findClubs(
    @Query('joinedUser') joinedUser?: boolean,
    @Query('likedUser') likedUser?: boolean,
  ) {
    return this.clubService.findClubs(buildQuery({ joinedUser, likedUser }));
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
          type: 'number',
          nullable: false,
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        max: {
          type: 'number',
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
  @Post()
  async createClub(
    @Req() req: Request,
    @UploadedFiles() files: File[],
    @Body() createClubDto: CreateClubDto,
  ) {
    try {
      const user = req.user as User;
      createClubDto.owner = user.id;

      const createdClub = await this.clubService.createClub(createClubDto);

      if (files !== undefined && files.length > 0) {
        await this.imageService.uploadImageOnClub(createdClub.id, files);
      }

      await this.clubService.joinClub(createdClub.id, user.id);
      return await this.findClubById(createdClub.id);
    } catch (e) {
      // e instanceof Error 로는 catch 안됨
      if ((e as Error).name === 'NotFoundError') {
        throw new NotFoundException(e);
      }
      throw e;
    }
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10)) //업로드파일을 10개로 제한
  @ApiOkResponse({ type: Club })
  @Patch(':id')
  async updateClub(
    @Req() req: Request,
    @UploadedFiles() files: File[],
    @Body() updateClubDto: UpdateClubDto,
  ) {
    try {
      const user = req.user as User;
      const id = +req.params.id;

      const club = await this.clubService.findClubById(id);
      if (!club)
        throw new HttpException(
          `Could not find Club with id ${id}`,
          HttpStatus.NOT_FOUND,
        );

      if (club.owner !== user.id)
        throw new HttpException('You are not Club owner', HttpStatus.FORBIDDEN);

      if (files !== undefined && files.length > 0) {
        await this.imageService.uploadImageOnClub(id, files);
      }
      return this.clubService.updateClub(id, updateClubDto);
    } catch (e) {
      // e instanceof Error 로는 catch 안됨
      if ((e as Error).name === 'NotFoundError') {
        throw new NotFoundException(e);
      }
      throw e;
    }
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
  async deleteClub(@Req() req: Request) {
    const user = req.user as User;
    const id = +req.params.id;

    const club = await this.clubService.findClubById(id);
    if (!club)
      throw new HttpException(
        `Could not find Club with id ${id}`,
        HttpStatus.NOT_FOUND,
      );

    if (club.owner !== user.id)
      throw new HttpException('You are not Club owner', HttpStatus.FORBIDDEN);

    return this.clubService.deleteClub(id);
  }

  @ApiOperation({
    summary: '참여하기',
    description: '해당 Club에 참여합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clubId: {
          type: 'number',
          nullable: false,
        },
      },
    },
  })
  @Post('/join')
  async joinClub(@Req() req: Request) {
    const user = req.user as User;
    const clubId = +req.body.clubId;

    const club = await this.clubService.findClubById(clubId);
    if (!club)
      throw new HttpException(
        `Could not find Club with id ${clubId}`,
        HttpStatus.NOT_FOUND,
      );
    const joinedUser = club.UserJoinedClub;
    const isUserJoined = joinedUser.some((v) => v.userId === user.id);
    if (isUserJoined)
      throw new HttpException(
        '이미 해당 클럽에 소속 된 유저입니다.',
        HttpStatus.FORBIDDEN,
      );

    if (club.max <= joinedUser.length)
      throw new HttpException(
        '클럽 모집인원이 마감되었습니다.',
        HttpStatus.FORBIDDEN,
      );

    return await this.clubService.joinClub(club.id, user.id);
  }

  //TODO : 찜하기, 찜 해제하기를 한번에 묶었습니다. 이미 찜하기를 눌렀다면 찜하기가 해제됩니다.
  @ApiOperation({
    summary: '찜하기',
    description: '해당 Club을 찜합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clubId: {
          type: 'number',
          nullable: false,
        },
      },
    },
  })
  @Post('/like')
  async likeClub(@Req() req: Request) {
    const user = req.user as User;
    const clubId = +req.body.clubId;

    const club = await this.clubService.findClubById(clubId);
    if (!club)
      throw new HttpException(
        `Could not find Club with id ${clubId}`,
        HttpStatus.NOT_FOUND,
      );

    const isUserLiked = club.UserLikedClub.some((v) => v.userId === user.id);
    if (isUserLiked) {
      //찜하기 해제
      return this.clubService.deleteLikedClub(club.id, user.id);
    }

    return await this.clubService.likeClub(club.id, user.id);
  }
}

export type BuildQueryOptions = {
  joinedUser: boolean;
  likedUser: boolean;
};

function buildQuery(
  options?: Partial<BuildQueryOptions>,
): Prisma.ClubFindManyArgs {
  const query: Prisma.ClubFindManyArgs = {
    include: {
      UserJoinedClub: true,
      UserLikedClub: true,
    },
  };
  if (!options) {
    return query;
  }

  const { joinedUser, likedUser } = options;

  if (joinedUser) {
    query.include.UserJoinedClub = {
      include: {
        User: true,
      },
    };
  }
  if (likedUser) {
    query.include.UserLikedClub = {
      include: {
        User: true,
      },
    };
  }

  return query;
}
