import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IncorrectPasswordError, UserNotFoundError } from './auth.errors';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login({ username, id, email }: UserDto) {
    const payload = { username, email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser({ username, password }: LoginDto) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (bcrypt.compareSync(password, user.password)) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    }

    throw new IncorrectPasswordError();
  }
}
