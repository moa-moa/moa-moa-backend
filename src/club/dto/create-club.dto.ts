import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { File } from 'src/common/file.interface';

export class CreateClubDto {
  //@IsNumber()
  @IsString()
  @ApiProperty({ description: '카테고리 id' })
  categoryId: string;

  @IsString()
  @ApiProperty({ description: '클럽 제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '클럽 내용' })
  description: string;

  @IsString()
  @ApiProperty({ description: 'user id' })
  owner: string;

  //  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '최대 인원', required: false, default: 4 })
  max?: string;

  @IsOptional()
  @ApiPropertyOptional({ type: [String], format: 'binary' })
  images?: any[];
}
