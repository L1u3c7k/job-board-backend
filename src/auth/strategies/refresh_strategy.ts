import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common'; // 1. Added Inject here
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,"refresh-Jwt") {
  constructor(
    // 2. Added @Inject wrapper here to properly load the custom config namespace
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService:AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refreshJwtConfiguration.secret as string,
      passReqToCallback:true
    });
  }
 

  validate(req:Request, payload: any) {
    const authHeader = req.get("authorization");
  if (!authHeader) {
    throw new UnauthorizedException('Refresh token missing');
  }
    const refreshToken = authHeader.replace("Bearer", "").trim();
    const userId = payload.sub
    return this.authService.validateRefreshToken(userId,refreshToken)
  }

}