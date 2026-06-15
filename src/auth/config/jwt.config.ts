import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwt', (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET ,
  signOptions: {
    // 💡 Using 'as any' here satisfies the JwtModuleOptions signature seamlessly
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  },
}));