import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common'; // 1. Added Inject here
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // 2. Added @Inject wrapper here to properly load the custom config namespace
    @Inject(jwtConfig.KEY)
    private jwtConfigure: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigure.secret as string,
    });
  }

  validate(payload: any) {
    return { id: payload.sub };
  }

}