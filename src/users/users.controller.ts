import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailAlreadyInUseError } from './users.errors';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return sanitizeUser(user);
    } catch (error) {
      if (
        error instanceof EmailAlreadyInUseError ||
        error instanceof EmailAlreadyInUseError
      ) {
        throw new ConflictException(error.message);
      }
    }
    throw new InternalServerErrorException();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() request, @Param('id') id: string) {
    if (request.user.userId !== id) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return sanitizeUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    if (request.user.userId !== id) {
      throw new ForbiddenException();
    }

    return await this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() request, @Param('id') id: string) {
    if (request.user.userId !== id) {
      throw new ForbiddenException();
    }

    return await this.usersService.remove(id);
  }
}

function sanitizeUser({ id, username, email }: User): UserDto {
  return {
    id,
    username,
    email,
  };
}
