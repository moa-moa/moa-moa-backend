import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import passport from 'passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

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

    const tokens = await this.authService.loginGetToken(googleData);
    const hashedRt = await this.authService.preHash(tokens.refreshToken);

    const userData: CreateUserDto = {
      id: googleData.id,
      provider: googleData.provider,
      email: googleData.email,
      name: googleData.name,
      hashedRt,
    };

    await this.userService.findByProviderIdOrSave(userData);

    return res.status(200).json(tokens);
  }

  @Post('/logout')
  logout() {}

  @Post('/refresh')
  refreshToken() {}
}
