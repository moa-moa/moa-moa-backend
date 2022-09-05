import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { RtStrategy } from './rt.strategy';
import { PrismaModule } from '../common/prisma.module';
import { AtStrategy } from './at.strategy';

@Module({
  imports: [PrismaModule, UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService, RtStrategy, AtStrategy, JwtService],
})
export class AuthModule {}
