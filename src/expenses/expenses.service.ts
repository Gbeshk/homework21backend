import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Expense } from './schemas/expenses.schema';
import { isValidObjectId, Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
import { AwsS3Service } from 'src/awss3/awss3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel('Expense') private expenseModel: Model<Expense>,
    @InjectModel('user') private userModel: Model<User>,
    private awsS3Service: AwsS3Service,
  ) {}

  // async onModuleInit() {
  //   const expenses: any = [];
  //   for (let i = 0; i < 100; i++) {
  //     expenses.push({
  //       productName: `name ${i}`,
  //       category: `category ${i}`,
  //       quantity: i,
  //       price: i * 100,
  //       author: '685d1ebb384a5f39750b1f54',
  //       totalPrice: i * i * 100,
  //     });
  //   }
  //   await this.expenseModel.insertMany(expenses);
  //   console.log("done");

  // }

  async getAllExpenses(
    category: string,
    start: number,
    end: number,
    priceFrom: number,
    priceTo: number,
    page: number,
    take: number,
  ) {
    const total = await this.expenseModel.countDocuments();
    const expenses = await this.expenseModel
      .find()
      .populate({ path: 'author', select: 'email firstName lastName' })
      .skip((page - 1) * take)
      .limit(take)
      .sort({ _id: -1 });
    return { total, take, page, expenses };
  }

  async getExpenseById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const expense = await this.expenseModel.findById(id);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async createExpense(userId, createExpenseDto, file) {
    const existUser = await this.userModel.findById(userId);
    if (!existUser) throw new BadRequestException('user not found');

    let imageUrl: string | undefined;

    if (file) {
      const fileType = file.mimetype.split('/')[1];
      const fileKey = `images/${uuidv4()}.${fileType}`;
      await this.awsS3Service.uploadFile(fileKey, file);
      imageUrl = process.env.CLOUD_FRONT + fileKey;
    }

    const totalPrice = createExpenseDto.quantity * createExpenseDto.price;

    const newExpense = await this.expenseModel.create({
      category: createExpenseDto.category,
      productName: createExpenseDto.productName,
      quantity: createExpenseDto.quantity,
      price: createExpenseDto.price,
      totalPrice: totalPrice,
      img: imageUrl,
      author: existUser._id,
    });

    await this.userModel.findByIdAndUpdate(existUser._id, {
      $push: { expenses: newExpense._id },
    });

    return { success: 'ok', data: newExpense };
  }

  async deleteExpenseById(id: string, userId: ObjectId) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const expense = await this.expenseModel.findById(id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.author.toString() !== userId.toString()) {
      throw new BadRequestException('you dont have permission');
    }

    if (expense.img) {
      const cloudFrontPrefix = process.env.CLOUD_FRONT!;
      const fileKey = expense.img.replace(cloudFrontPrefix, '');
      await this.awsS3Service.deleteFileById(fileKey);
    }

    await this.expenseModel.findByIdAndDelete(id);
    await this.userModel.updateOne(
      { _id: expense.author },
      { $pull: { expenses: new Types.ObjectId(id) } },
    );

    return 'Expense deleted successfully';
  }

  async updateExpenseById(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    userId: ObjectId,
    file?: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const expense = await this.expenseModel.findById(id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.author.toString() !== userId.toString()) {
      throw new BadRequestException('you dont have permission');
    }

    let newImageUrl = expense.img;

    if (file) {
      const cloudFrontPrefix = process.env.CLOUD_FRONT || '';
      const oldFileKey = expense.img?.replace(cloudFrontPrefix, '');
      if (oldFileKey) {
        await this.awsS3Service.deleteFileById(oldFileKey);
      }

      const fileType = file.mimetype.split('/')[1];
      const newFileKey = `images/${uuidv4()}.${fileType}`;
      await this.awsS3Service.uploadFile(newFileKey, file);
      newImageUrl = process.env.CLOUD_FRONT + newFileKey;
    }

    const updatedExpense = await this.expenseModel.findByIdAndUpdate(
      id,
      { $set: { ...updateExpenseDto, img: newImageUrl } },
      { new: true },
    );

    return { success: true, data: updatedExpense };
  }

  async getStatistic() {
    const expenses = await this.expenseModel.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$price' },
          count: { $sum: 1 },
          items: { $push: '$$ROOT' },
        },
      },
    ]);
    return expenses;
  }
  async getSpenders(limit: number) {
    const expenses = await this.expenseModel.aggregate([
      {
        $group: {
          _id: '$author',
          total: { $sum: '$price' },
          count: { $sum: 1 },
        },
      },
      {
        $limit: limit,
      },
    ]);
    return expenses;
  }
}
