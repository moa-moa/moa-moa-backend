import { ApiProperty } from '@nestjs/swagger';
import { ClubImage } from '@prisma/client';

export class Club {
  @ApiProperty({ description: 'id' })
  readonly id: number;
  @ApiProperty({ description: '카테고리 id' })
  categoryId: number;
  @ApiProperty({ description: '타이틀' })
  title: string;
  @ApiProperty({ description: '내용' })
  description: string;
  @ApiProperty({ description: 'user id' })
  owner: string;
  @ApiProperty({ description: '최대인원' })
  max?: number;
  @ApiProperty({ description: '이미지' })
  ClubImage: ClubImage[];
}
