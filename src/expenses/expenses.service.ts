import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

  async getAllExpenses(
    category: string,
    start: number,
    end: number,
    priceFrom: number,
    priceTo: number,
  ) {
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (priceFrom !== undefined && priceTo !== undefined) {
      filter.price = { $gte: priceFrom, $lte: priceTo };
    }

    const limit = end - start;
    const skip = start;

    const expenses = await this.expenseModel
      .find(filter)
      .skip(skip)
      .limit(limit);

    return expenses;
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
}
