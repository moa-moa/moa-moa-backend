import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { JwtPayload } from './jwtPayload.type';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getToken(id: string, email: string) {
    const jwtPayload: JwtPayload = {
      sub: id,
      email,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      issuer: 'moamoa.com',
      expiresIn: '2h',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      issuer: 'moamoa.com',
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken, refreshToken };
  }

  async preHash(refreshToken: string) {
    return await argon.hash(refreshToken);
  }
}
