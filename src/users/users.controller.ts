import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(@Query() { page, take, gender, email }: QueryParamsDto) {
    const start = (page - 1) * take;
    const end = page * take;
    return this.usersService.getAllUsers(start, end, gender, email);
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(id);
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
    return this.usersService.deleteUserById(id);
  }

  @Put(':id')
  udpateUser(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
  @Post('upgrade-subscription')
  updateSubscription(@Body() body: { email: string }) {
    return this.usersService.updateSubscription(body.email);
  }
}
