import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './auth.dto';
import { Role } from '@generated/enums';
import { Roles } from '@/common/decorators/roles.decorator';

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  sigIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Roles(Role.ADMIN)
  @Get('profile')
  getProfile(@Request() req: any) {
    const { roles, sub: id } = req.user;
    const user = { roles, id };
    return user;
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refresh_token);
  }
}
