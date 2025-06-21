import {
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
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
    {
      id: 2,
      firstName: 'luka',
      lastName: 'beshkenadze',
      email: 'luka@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
    {
      id: 3,
      firstName: 'giorgi',
      lastName: 'beshkenadze',
      email: 'user@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
    {
      id: 4,
      firstName: 'mariami',
      lastName: 'meladze',
      email: 'user@gmail.com',
      phoneNumber: '1541212412',
      gender: 'female',
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
  ];
  getAllUsers(
    start: number,
    end: number,
    gender: string,
    email: string,
  ): CreateUserDto[] {
    let filtered = this.users;
    let genderFilter: string;
    if (gender == 'm') {
      genderFilter = 'male';
    }
    if (gender == 'f') {
      genderFilter = 'female';
    }
    if (gender) {
      filtered = filtered.filter((user) => user.gender === genderFilter);
    }
    if (email) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().startsWith(email.toLowerCase()),
      );
    }

    return filtered.slice(start, end);
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
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const newUser = {
      id: lastId + 1,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      subscriptionStartDate: now.toISOString(),
      subscriptionEndDate: oneMonthLater.toISOString(),
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
  updateSubscription(email: string) {
    const user = this.users.find((u) => u.email === email);

    if (!user) {
      return { message: 'User not found' };
    }

    const currentDate = new Date(user.subscriptionEndDate);

    const newSubEnd = new Date(currentDate);
    newSubEnd.setMonth(newSubEnd.getMonth() + 1);

    user.subscriptionEndDate = newSubEnd.toISOString();

    return {
      message: 'Subscription extended by 1 month',
    };
  }
}
