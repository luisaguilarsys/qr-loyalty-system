import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports :[JwtModule.register({secret:process.env.JWT_SECRET,signOptions:{expiresIn:'15m'}})],
  controllers: [AuthController],
  providers: [AuthService,UsersService,PrismaService,{ provide:APP_GUARD,useClass :AuthGuard},{provide:APP_GUARD,useClass:RolesGuard}]
})
export class AuthModule {}
