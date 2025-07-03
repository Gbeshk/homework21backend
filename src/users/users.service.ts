import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, ObjectId, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { Expense } from 'src/expenses/schemas/expenses.schema';
import { Product } from 'src/products/schemas/product.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Expense') private expenseModel: Model<Expense>,
    @InjectModel('Product') private productModel: Model<Product>,
  ) {}

  async getAllUsers(start: number, end: number, gender: string, email: string) {
    const filter: any = {};

    if (gender === 'm') filter.gender = 'male';
    if (gender === 'f') filter.gender = 'female';

    if (email) {
      filter.email = { $regex: `^${email}`, $options: 'i' };
    }

    const limit = end - start;
    const skip = start;

    const result = await this.userModel.find(filter).skip(skip).limit(limit);

    return result;
  }

  async getUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async createUser({
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
  }: CreateUserDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('Email alredy in use');
    }
    const currentDate = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(currentDate.getMonth() + 1);
    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      subscriptionStartDate: currentDate.toISOString(),
      subscriptionEndDate: oneMonthLater.toISOString(),
    });

    return { success: 'ok', data: newUser };
  }

  async deleteUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    await this.expenseModel.deleteMany({ author: id });

    return 'User deleted successfully';
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return 'User updated successfully';
  }

  async updateSubscription(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return { message: 'User not found' };
    }
    const currentDate = new Date(user.subscriptionEndDate);

    const newSubEnd = new Date(currentDate);
    newSubEnd.setMonth(newSubEnd.getMonth() + 1);

    user.subscriptionEndDate = newSubEnd.toISOString();

    await user.save();

    return { message: 'Subscription extended by 1 month' };
  }
  async changeRole(userId: ObjectId, userToChange: string, newRole: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const currentRole = user.role;
    console.log(currentRole);
    if (currentRole != 'admin') {
      throw new ForbiddenException('only admins have permission');
    }
    return this.userModel.findByIdAndUpdate(
      userToChange,
      { role: newRole },
      { new: true },
    );
  }
  async getStatistics(userId: ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const currentRole = user.role;
    console.log(currentRole);
    if (currentRole != 'admin') {
      throw new ForbiddenException('only admins have permission');
    }

    const totalUsers = await this.userModel.countDocuments();
    const totalExpenses = await this.expenseModel.countDocuments();
    const totalProducts = await this.productModel.countDocuments();

    return {
      totalUsers,
      totalExpenses,
      totalProducts,
    };
  }
}
