import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      firstName: 'giorgi',
      lastName: 'beshkenadze',
      email: 'giorgi@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      expenses: [],
    },
    {
      id: 2,
      firstName: 'luka',
      lastName: 'beshkenadze',
      email: 'luka@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      expenses: [],
    },
    {
      id: 3,
      firstName: 'giorgi',
      lastName: 'beshkenadze',
      email: 'user@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      expenses: [],
    },
    {
      id: 4,
      firstName: 'mariami',
      lastName: 'meladze',
      email: 'user@gmail.com',
      phoneNumber: '1541212412',
      gender: 'felame',
      expenses: [],
    },
  ];

  getAllUsers() {
    return this.users;
  }

  getUserById(id: number) {
    const user = this.users.find((el) => el.id === id);
    return user;
  }

  createUser({
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
  }: CreateUserDto) {
    if (!firstName || !lastName || !email || !phoneNumber || !gender) {
      throw new HttpException('all fields are requied', HttpStatus.BAD_REQUEST);
    }

    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser = {
      id: lastId + 1,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      expenses: [],
    };
    this.users.push(newUser);

    return 'created successfully';
  }

  deleteUserById(id: number) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    this.users.splice(index, 1);

    return 'deleted successfully';
  }

  updateUserById(id: number, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    const updateReq: UpdateUserDto = {};
    if (updateUserDto.firstName) {
      updateReq.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName) {
      updateReq.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.email) {
      updateReq.email = updateUserDto.email;
    }
    if (updateUserDto.phoneNumber) {
      updateReq.phoneNumber = updateUserDto.phoneNumber;
    }
    if (updateUserDto.gender) {
      updateReq.gender = updateUserDto.gender;
    }
    this.users[index] = {
      ...this.users[index],
      ...updateReq,
    };

    return 'updated successfully';
  }
}
