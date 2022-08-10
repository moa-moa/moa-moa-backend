import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ description: 'id' })
  readonly id: number;

  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  @ApiProperty({ description: '카테고리 배경 색상코드' })
  backColor: string;
}
