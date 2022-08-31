import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
  @ApiProperty({ description: 'user id', required: false })
  owner: string;

  //  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '최대 인원', required: false, default: 4 })
  max?: string;

  @IsOptional()
  @ApiPropertyOptional({ type: [String], required: false, format: 'binary' })
  files?: File[];
}
