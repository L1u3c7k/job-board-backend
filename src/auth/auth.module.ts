import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from './hashService.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import {JwtStrategy} from './strategies/jwt.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import { RefreshJwtStrategy } from './strategies/refresh_strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,HashService,LocalStrategy,JwtStrategy,RefreshJwtStrategy],
  imports:[UserModule,JwtModule.registerAsync(jwtConfig.asProvider()),ConfigModule.forFeature(jwtConfig),ConfigModule.forFeature(refreshJwtConfig)],
  exports: [HashService],
})
export class AuthModule {}
