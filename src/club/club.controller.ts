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
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from '../image/image.service';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { Club } from './model/club.model';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Prisma, User, UserJoinedClub } from '@prisma/client';
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

  @ApiOperation({
    summary: '클럽 1개 생성',
    description: 'Club 모델 하나를 생성합니다.',
  })
  @ApiCreatedResponse({ type: Club })
  @Post()
  async createClub(@Req() req: Request, @Body() createClubDto: CreateClubDto) {
    try {
      const user = req.user as User;
      createClubDto.owner = user.id;

      const createdClub = await this.clubService.createClub(createClubDto);

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
  @ApiOkResponse({ type: Club })
  @Patch(':id')
  async updateClub(@Req() req: Request, @Body() updateClubDto: UpdateClubDto) {
    const user = req.user as User;
    const id = +req.params.id;

    const club = await this.clubService.findClubById(id);

    if (club.owner !== user.id)
      throw new HttpException('You are not Club owner', HttpStatus.FORBIDDEN);
    updateClubDto.owner = club.owner;
    if (updateClubDto.imageIds !== undefined)
      await this.imageService.updateImages(id, updateClubDto.imageIds);

    return await this.clubService.updateClub(id, updateClubDto);
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

    if (club.owner !== user.id)
      throw new HttpException('You are not Club owner', HttpStatus.FORBIDDEN);

    return await this.clubService.deleteClub(id);
  }

  @ApiOperation({
    summary: '참여하기',
    description: '해당 Club에 참여합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Club 모델의 Id값입니다.',
    example: 1,
  })
  @Post('/join/:id')
  async joinClub(@Req() req: Request): Promise<UserJoinedClub> {
    const user = req.user as User;
    const clubId = +req.params.id;

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
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Club 모델의 Id값입니다.',
    example: 1,
  })
  @Post('/like/:id')
  async likeClub(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const clubId = +req.params.id;

    const club = await this.clubService.findClubById(clubId);
    if (!club)
      throw new HttpException(
        `Could not find Club with id ${clubId}`,
        HttpStatus.NOT_FOUND,
      );

    const isUserLiked = club.UserLikedClub.some((v) => v.userId === user.id);
    if (isUserLiked) {
      //찜하기 해제
      await this.clubService.deleteLikedClub(club.id, user.id);
      return res.status(200).json({ message: '찜하기가 해제되었습니다.' });
    }

    await this.clubService.likeClub(club.id, user.id);
    return res.status(200).json({ message: '해당 클럽을 찜하였습니다.' });
  }

  @ApiOperation({
    summary: '나가기',
    description: '해당 클럽에서 탈퇴합니다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Club 모델의 Id값입니다.',
    example: 1,
  })
  @Delete('/leave/:id')
  async leaveClub(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const userId = user.id;
    const clubId = +req.params.id;

    const club = await this.clubService.findClubById(clubId);
    if (!club)
      throw new HttpException(
        `Could not find Club with id ${clubId}`,
        HttpStatus.NOT_FOUND,
      );
    const joinedClub = club.UserJoinedClub.filter((x) => x.userId === userId);
    if (joinedClub.length === 0)
      throw new HttpException(
        `You didn't join the club with id ${clubId}`,
        HttpStatus.FORBIDDEN,
      );
    //해당 유저가 클럽 owner일 경우
    if (club.owner === userId)
      throw new HttpException(
        `클럽장은 클럽을 나갈 수 없습니다.`,
        HttpStatus.FORBIDDEN,
      );
    await this.clubService.leaveClub(clubId, userId);
    return res.status(200).json({ message: '해당 클럽에서 탈퇴하였습니다.' });
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
