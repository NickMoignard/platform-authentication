import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IncorrectPasswordError, UserNotFoundError } from '../auth.errors';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    try {
      return await this.authService.validateUser({ username, password });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException();
      }
      if (error instanceof IncorrectPasswordError) {
        throw new UnauthorizedException();
      }
    }
  }
}
