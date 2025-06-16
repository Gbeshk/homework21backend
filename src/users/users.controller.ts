import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(Number(id));
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const firstName = createUserDto?.firstName;
    const lastName = createUserDto?.lastName;
    const email = createUserDto?.email;
    const phoneNumber = createUserDto?.phoneNumber;
    const gender = createUserDto?.gender;

    return this.usersService.createUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
    });
  }

  @Delete(':id')
  deleteUserById(@Param('id') id) {
    return this.usersService.deleteUserById(Number(id));
  }

  @Put(':id')
  udpateUser(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserById(Number(id), updateUserDto);
  }
}
