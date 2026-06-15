import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { forwardRef } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[forwardRef(() => AuthModule),PrismaModule],
  exports: [UserService],
})
export class UserModule {}
