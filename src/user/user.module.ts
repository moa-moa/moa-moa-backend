import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { PrismaModule } from '../common/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, ImageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
