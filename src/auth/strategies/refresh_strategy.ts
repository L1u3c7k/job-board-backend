import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common'; // 1. Added Inject here
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import refreshJwtConfig from '../config/refresh-jwt.config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,"refresh-Jwt") {
  constructor(
    // 2. Added @Inject wrapper here to properly load the custom config namespace
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refreshJwtConfiguration.secret as string,
    });

  }
 

  async validate(payload: any) {
    return { id: payload.sub };
  }

}