import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ClubModule } from './club/club.module';

@Module({
  imports: [UserModule, AuthModule, CategoryModule, ClubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
