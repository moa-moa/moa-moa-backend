import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClubDto {
  @IsNumber()
  @ApiProperty({ description: '카테고리 id' })
  categoryId: number;

  @IsString()
  @ApiProperty({ description: '클럽 제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '클럽 내용' })
  description: string;

  @IsString()
  @ApiProperty({ description: 'user id' })
  owner: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '최대 인원', required: false })
  max?: number;
}
