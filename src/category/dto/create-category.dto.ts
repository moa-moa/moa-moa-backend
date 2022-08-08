import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ description: '이메일' })
  name: string;

  @IsString()
  @ApiProperty({ description: '배경 색상코드' })
  backColor: string;
}
