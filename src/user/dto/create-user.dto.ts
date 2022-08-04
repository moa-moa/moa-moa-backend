import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '이메일' })
  email: string;
  @ApiProperty({ description: '이름' })
  name: string;
}
