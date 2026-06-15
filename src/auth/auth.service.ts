import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { HashService } from './hashService.service';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import * as argon2 from "argon2"



@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>) { }

  async validateion(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials1');
    }
    const isPasswordValid = await this.hashService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id };
  }

  async login(user: any) {
    // const payload = { sub: user.id };
    // const token = this.jwtService.sign(payload);
    // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    const { accessToken, refreshToken } = await this.generateToken(user.id)
    const hashedRefreshToken = await argon2.hash(refreshToken)
    await this.userService.updateHashedRefreshToken(user.id, hashedRefreshToken)
    return { id: user.id, access_token: accessToken, refresh_Token: refreshToken }

  }
  async generateToken(userId: string) {
    const payload = { sub: userId }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig)
    ])
    return { accessToken, refreshToken }
  }

  async refreshToken(user: any) {
    const { accessToken, refreshToken } = await this.generateToken(user.id)
    const hashedRefreshToken = await argon2.hash(refreshToken)
    await this.userService.updateHashedRefreshToken(user.id, hashedRefreshToken)
    return { id: user.id, access_token: accessToken, refresh_Token: refreshToken }

  }
  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId)
    if (!user || !user.hashedRefreshToken) { throw new UnauthorizedException("Invalid refresh token") }

    if (!user || !user.hashedRefreshToken) {
    throw new UnauthorizedException('Access Denied: Invalid session or logged out.');
    }
    const verifyRefreshToken = await argon2.verify(user.hashedRefreshToken,refreshToken)
    if(!verifyRefreshToken) throw new UnauthorizedException("invalid refresh token")
    return { id: userId }
  }

  async logout(userId: string) {
    await this.userService.updateHashedRefreshToken(userId, null)
  }


}
