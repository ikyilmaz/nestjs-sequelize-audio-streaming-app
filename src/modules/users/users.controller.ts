import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags("users")
export class UsersController {
  @Get("/")
  getMany() {

  }

  @Post("/")
  create(@Body() createUserDto: CreateUserDto) {

  }

  @Get('/:id')
  get() {

  }

  @Patch("/:id")
  update() {

  }

  @Delete("/:id")
  delete() {

  }
}
