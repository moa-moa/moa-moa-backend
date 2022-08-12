import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async loginGetToken(payload: CreateUserDto) {
    const accessToken = this.jwtService.sign(payload, {
      issuer: 'moamoa.com',
      expiresIn: 60 * 30, //30분
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      issuer: 'moamoa.com',
      expiresIn: 60 * 60 * 24 * 7, //7일
      secret: process.env.JWT_SECRET,
    });
    return { accessToken, refreshToken };
  }

  async preHash(refreshToken: string) {
    return await bcrypt.hash(refreshToken, 5);
  }
  logout() {}
  refreshToken() {}
}
