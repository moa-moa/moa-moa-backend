import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAvatarDto {
  @IsString()
  @ApiProperty({ description: '프로필사진' })
  avatar: string;
}
