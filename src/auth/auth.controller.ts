import { Controller, UseGuards, Post, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: UserDto }) {
    return this.authService.login(req.user);
  }
}
