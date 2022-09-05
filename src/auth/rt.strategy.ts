import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from './jwtPayload.type';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['refreshToken'];
        },
      ]),
      secretOrKey: process.env.REFRSH_JWT_SECRET,
      passReqToCallback: true,
      // //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies['refreshToken'];
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.REFRSH_JWT_SECRET,
      });
      return {
        ...payload,
        refreshToken,
      };
    } catch (e: any) {
      this.userService.logout(payload.sub);
      throw new HttpException('토큰이 만료되었습니다.', 410);
    }
  }
}
