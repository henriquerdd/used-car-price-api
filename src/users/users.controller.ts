import { Controller, Body, Param, Query, Post, Get, Patch, Delete } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('/signup')
  createUser (@Body() body: CreateUserDto) {
    this.service.create(body)
  }

  @Get('/:id')
  findUser (@Param('id') id: string) {
    return this.service.findOne(parseInt(id));
  }

  @Get()
  findAllUsers (@Query('email') email: string) {
    return this.service.find(email);
  }

  @Patch('/:id')
  updateUser (@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser (@Param('id') id: string) {
    return this.service.remove(parseInt(id));
  }
}
