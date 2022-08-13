import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import passport from 'passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
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

    res.cookie('access-token', tokens.accessToken);
    res.cookie('refresh-token', tokens.refreshToken);

    return res.status(200).json(tokens);
  }
  @Get('/logout')
  logout(@Req() req: Request) {
    console.log('req', req);
    const user = req.user;
    return this.userService.logout(user['id']);
  }

@Get('refresh')
@UseGuards(AuthGuard('jwt-refresh'))
async refreshToken(@Req() req: Request, @Res() res: Response) {
  console.log("req",req)
  const { refreshToken, sub, email } = req.user as JwtPayload & {
    refreshToken: string;
  };

  const rt = await this.authService.preHash(refreshToken);
  const user = await this.userService.findByIdAndCheckRT(sub, rt);

  const tokens = await this.authService.getToken(sub, email);

  res.cookie('access-token', tokens.accessToken);
  res.cookie('refresh-token', tokens.refreshToken);

  return await this.userService.updateHashedRefreshToken(user.id, refreshToken);

 
}



}
