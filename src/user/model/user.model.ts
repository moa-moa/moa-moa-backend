import { ApiProperty } from '@nestjs/swagger';
import { Image } from '@prisma/client';

export class User {
  @ApiProperty({ description: 'id' })
  readonly id: string;
  @ApiProperty({ description: '제공자' })
  provider: string;
  @ApiProperty({ description: '이메일' })
  email: string;
  @ApiProperty({ description: '이름' })
  name: string;
  @ApiProperty({ description: '프로필 사진' })
  Avatar?: Image;
  @ApiProperty({ description: '해싱된 refresh token' })
  hashedRt?: string;

  @ApiProperty({ description: '생성일' })
  createdAt?: Date;
  @ApiProperty({ description: '수정일' })
  updatedAt?: Date;
}
