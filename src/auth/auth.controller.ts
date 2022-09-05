import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import passport from 'passport';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwtPayload.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google() {
    passport.authenticate('google', { scope: ['profile', 'email'] });
  }

  // get token
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleData = req.user as CreateUserDto;

    const tokens = await this.authService.getToken(
      googleData.id,
      googleData.email,
    );
    const hashedRt = await this.authService.preHash(tokens.refreshToken);

    const userData: CreateUserDto = {
      id: googleData.id,
      provider: googleData.provider,
      email: googleData.email,
      name: googleData.name,
      hashedRt,
    };

    await this.userService.findByIdOrSaveOrTokenUpdate(userData);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
   // return res.status(200).json(tokens);
    return res.status(200).redirect('http://localhost:3001/'); // webfront home
  }
  @Get('logout')
  logout(@Req() req: Request) {
    const user = req.user;
    return this.userService.logout(user['id']);
  }

  @Get('auto-login')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, sub, email } = req.user as JwtPayload & {
      refreshToken: string;
    };
    //refresh Token 검증
    const checkUser = await this.userService.findByIdAndCheckRT(
      sub,
      refreshToken,
    );

    const tokens = await this.authService.getToken(sub, email);

    const hashtedRt = await this.authService.preHash(tokens.refreshToken);
    await this.userService.updateHashedRefreshToken(checkUser.id, hashtedRt);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json({ accessToken: tokens.accessToken });
  }
}
