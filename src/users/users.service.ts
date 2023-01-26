import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  EmailAlreadyInUseError,
  UsernameAlreadyInUseError,
} from './users.errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create({ email, password, username }: CreateUserDto) {
    const userWithEmail = await this.repo.findOneBy({ email });
    if (userWithEmail) {
      throw new EmailAlreadyInUseError();
    }

    const userWithUsername = await this.repo.findOneBy({ username });
    if (userWithUsername) {
      throw new UsernameAlreadyInUseError();
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = this.repo.create({
      email,
      username,
      password: hashedPassword,
    });

    return this.repo.save(user);
  }

  update(id: string, dto: UpdateUserDto) {
    return this.repo.update({ id }, dto);
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  findByUsername(username: string) {
    return this.repo.findOneBy({ username });
  }
}
