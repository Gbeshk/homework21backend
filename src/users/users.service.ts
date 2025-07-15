import {
  BadRequestException,
  ForbiddenException,
  HttpException,
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
import { AwsS3Service } from 'src/awss3/awss3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Expense') private expenseModel: Model<Expense>,
    @InjectModel('Product') private productModel: Model<Product>,
    private awsS3Service: AwsS3Service,
  ) {}

  //  async onModuleInit() {
  //   const users = await this.userModel.find({ isActive: { $exists: false } });

  //   for (let i = 0; i < users.length; i++) {
  //     const isActive = Math.random() < 0.5;
  //     await this.userModel.updateOne(
  //       { _id: users[i]._id },
  //       { $set: { isActive } }
  //     );
  //   }
  // }

  // async onModuleInit() {
  //   const users = await this.userModel.find();

  //   for (let i = 0; i < users.length; i++) {
  //     const age = Math.floor(Math.random() * 80) + 1;

  //     await this.userModel.updateOne({ _id: users[i]._id }, { $set: { age } });
  //   }
  // }

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
  async uploadFiles(files: Express.Multer.File[]) {
    const uploadFileIds: string[] = [];

    for (let file of files) {
      const fileType = file.mimetype.split('/')[1];
      const fileId = `images/${uuidv4()}.${fileType}`;
      await this.awsS3Service.uploadFile(fileId, file);
      uploadFileIds.push(fileId);
    }

    return uploadFileIds;
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileType = file.mimetype.split('/')[1];
    const fileId = `images/${uuidv4()}.${fileType}`;
    await this.awsS3Service.uploadFile(fileId, file);
    const pictureUrl = process.env.CLOUD_FRONT + fileId;
    return pictureUrl;
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
  async getStatistic() {
    const expenses = await this.userModel.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
          averageAge: { $avg: '$age' },
        },
      },
    ]);
    return expenses;
  }
}
