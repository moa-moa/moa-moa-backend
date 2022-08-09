import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async loginGetToken(payload) {
    const accessToken = this.jwtService.sign(payload, {
      issuer: 'moamoa.com',
      expiresIn: '2h',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      issuer: 'moamoa.com',
      expiresIn: '14d',
      secret: process.env.JWT_SECRET,
    });
    return { accessToken, refreshToken };
  }
}
