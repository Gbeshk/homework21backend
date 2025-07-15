import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UserId } from './decorators/user.decorator';
import { ObjectId } from 'mongoose';
import { ChangeRoleDto } from './dto/change-role.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(@Query() { page, take, gender, email }: QueryParamsDto) {
    const start = (page - 1) * take;
    const end = page * take;
    return this.usersService.getAllUsers(start, end, gender, email);
  }
  // @Post('get-file')
  // getFile(@Body('fileId') fileId: string) {
  //   return this.usersService.getFileById(fileId);
  // }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadFile(file);
  }

  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.usersService.uploadFiles(files);
  }

  @Get('analytics')
  @UseGuards(IsAuthGuard)
  async getStatistics(@UserId() userId: ObjectId) {
    return this.usersService.getStatistics(userId);
  }
  @Get('statistic')
  getStatistic() {
    return this.usersService.getStatistic();
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

  @Post('change-role')
  @UseGuards(IsAuthGuard)
  async changeUserRole(
    @UserId() userId: ObjectId,
    @Body() body: ChangeRoleDto,
  ) {
    return this.usersService.changeRole(
      userId,
      body.userToChange,
      body.newRole,
    );
  }
}
