import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResumesModule } from './resumes/resumes.module';
import { ApplicationsModule } from './applications/applications.module';
import { AdminModule } from './admin/admin.module';
import { ReportingModule } from './reporting/reporting.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [ResumesModule, ApplicationsModule, AdminModule, ReportingModule, AuthModule, UserModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
