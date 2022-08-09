import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  findClubs() {
    return this.clubService.findClubs();
  }

  @Get(':id')
  findClubById(@Param('id') id: number) {
    return this.clubService.findClubById(id);
  }

  @Post()
  createClub(@Body() createClubDto: CreateClubDto) {
    createClubDto.owner = '로그인userid';
    return this.clubService.createClub(createClubDto);
  }

  @Patch(':id')
  updateClub(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.updateClub(id, updateClubDto);
  }

  @Delete(':id')
  deleteClub(@Param('id') id: number) {
    return this.clubService.deleteClub(id);
  }
}
