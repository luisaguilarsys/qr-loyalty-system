import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { SaveUser, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { type UUID } from 'crypto';
// TODO: refactor all responses to use ResponseFactory

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto):Promise<SaveUser> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll():Promise<SaveUser[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id:UUID):Promise<SaveUser> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto):Promise<SaveUser> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: UUID):Promise<SaveUser> {
    return this.usersService.remove(id);
  }
}
