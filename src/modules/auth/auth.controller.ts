import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './jwt.utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() 
  @Post('login')
  async login(@Body() body: { phone: string }) {
    return await this.authService.login(body.phone);
  }
}