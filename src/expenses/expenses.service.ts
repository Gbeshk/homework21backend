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

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel('Expense') private expenseModel: Model<Expense>,
    @InjectModel('user') private userModel: Model<User>,
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

  async createExpense({
    category,
    productName,
    quantity,
    price,
    totalPrice,
    userId,
  }) {
    const existExpense = await this.userModel.findById(userId);
    if (!existExpense) throw new BadRequestException('expense not found');
    const newExpense = await this.expenseModel.create({
      category,
      productName,
      quantity,
      price,
      totalPrice,
      author: existExpense._id,
    });
    await this.userModel.findByIdAndUpdate(existExpense._id, {
      $push: { expenses: newExpense._id },
    });

    return { success: 'ok', data: newExpense };
  }

  async deleteExpenseById(id: string, userId: ObjectId) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const expense = await this.expenseModel.findById(id);
    if (expense?.author != userId) {
      throw new BadRequestException('you dont have permission');
    }
    if (!expense) {
      throw new NotFoundException('Expense not found');
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
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid expense ID');
    }
    const expense = await this.expenseModel.findById(id);

    if (expense?.author != userId) {
      throw new BadRequestException('you dont have permission');
    }
    const updatedExpense = await this.expenseModel.findByIdAndUpdate(
      id,
      { $set: updateExpenseDto },
      { new: true },
    );

    if (!updatedExpense) {
      throw new NotFoundException('Expense not found');
    }

    return 'Expense updated successfully';
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
