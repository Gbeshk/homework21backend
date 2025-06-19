import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ICreateExpense,
  IUpdateExpense,
} from './interfaces/expenses.interface';

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

  getAllExpenses(
    category: string,
    start: number,
    end: number,
    priceFrom: number,
    priceTo: number,
  ) {
    let filtered = this.expenses;

    if (category) {
      filtered = filtered.filter((expense) => expense.category === category);
    }
    if (priceFrom !== undefined && priceTo !== undefined) {
      filtered = filtered.filter(
        (expense) => expense.price >= priceFrom && expense.price <= priceTo,
      );
    }
    return filtered.slice(start, end);
  }

  getExpenseById(id: number) {
    const user = this.expenses.find((el) => el.id === id);
    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }
    return user;
  }

  createExpense({
    category,
    productName,
    quantity,
    price,
    email,
    totalPrice,
  }: ICreateExpense) {
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
      totalPrice,
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

  updateExpenseById(id: number, updateExpenseDto: IUpdateExpense) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    const updateReq: IUpdateExpense = {};

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

    const currentExpense = this.expenses[index];
    const newPrice = updateReq.price ?? currentExpense.price;
    const newQuantity = updateReq.quantity ?? currentExpense.quantity;
    updateReq.totalPrice = newPrice * newQuantity;

    this.expenses[index] = {
      ...this.expenses[index],
      ...updateReq,
    };

    return 'updated successfully';
  }
}
