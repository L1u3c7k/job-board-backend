import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { HashService } from './hashService.service';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';



@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService, 
    private readonly hashService: HashService, 
    private readonly jwtService: JwtService, 
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfig:ConfigType<typeof refreshJwtConfig>) { }

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

  login(user: any) {
    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    return {id:user.id,token: token,refresh_Token :refreshToken}

  }

  refreshToken(userId:string){
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload)
    return {id:userId,token:token}
    
  }



}
