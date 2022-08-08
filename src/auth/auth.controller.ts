import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
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

  // get token (login)
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = await this.userService.findByProviderIdOrSave(
      req.user as CreateUserDto,
    );

    const payload = { id: user.id, name: user.name, email: user.email };

    const data = await this.authService.loginGetToken(payload);

    return res.status(200).json(data);
  }
}
