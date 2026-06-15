import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: any) {
    return this.authService.login(req.user);

  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req:any) {
    return req.logout();
  }
x
  @UseGuards(RefreshJwtAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req:any){

    return this.authService.refreshToken(req.user)
  }
}
