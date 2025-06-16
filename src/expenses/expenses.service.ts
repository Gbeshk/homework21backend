import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './expensesdto/create-expense.dto';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';

@Injectable()
export class ExpensesService {
  private expenses = [
    {
      id: 1,
      category: 'electronics',
      productName: 'iphone',
      quantity: 2,
      price: 2000,
      totalPrice: 4000,
    },
    {
      id: 2,
      category: 'electronics',
      productName: 'tablet',
      quantity: 2,
      price: 1000,
      totalPrice: 2000,
    },
    {
      id: 3,
      category: 'clothes',
      productName: 'shirt',
      quantity: 2,
      price: 50,
      totalPrice: 100,
    },
  ];

  getAllExpenses() {
    return this.expenses;
  }

  getExpenseById(id: number) {
    const user = this.expenses.find((el) => el.id === id);
    return user;
  }

  createExpense({
    category,
    productName,
    quantity,
    price,
    email,
  }: CreateExpenseDto) {
    if (!email || !category || !productName || !quantity || !price) {
      throw new HttpException('all fields are requied', HttpStatus.BAD_REQUEST);
    }

    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;
    const newExpense = {
      id: lastId + 1,
      email,
      category,
      productName,
      quantity,
      price,
      totalPrice: price * quantity,
    };
    this.expenses.push(newExpense);

    return 'created successfully';
  }

  deleteExpenseById(id: number) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    this.expenses.splice(index, 1);

    return 'deleted successfully';
  }

  updateExpenseById(id: number, updateExpenseDto: UpdateExpenseDto) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    const updateReq: UpdateExpenseDto = {};
    if (updateExpenseDto.category) {
      updateReq.category = updateExpenseDto.category;
    }
    if (updateExpenseDto.productName) {
      updateReq.productName = updateExpenseDto.productName;
    }
    if (updateExpenseDto.quantity) {
      updateReq.quantity = updateExpenseDto.quantity;
    }

    if (updateExpenseDto.price) {
      updateReq.price = updateExpenseDto.price;
    }
    this.expenses[index] = {
      ...this.expenses[index],
      ...updateReq,
    };

    return 'updated successfully';
  }
}
