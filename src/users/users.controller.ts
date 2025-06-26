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
    return this.usersService.createUser(createUserDto);
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
