import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './expensesdto/create-expense.dto';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  getAllUsers() {
    return this.expensesService.getAllExpenses();
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.expensesService.getExpenseById(Number(id));
  }

  @Post()
  createUser(@Body() createExpenseDto: CreateExpenseDto) {
    const category = createExpenseDto?.category;
    const productName = createExpenseDto?.productName;
    const quantity = createExpenseDto?.quantity;
    const price = createExpenseDto?.price;
    const email = createExpenseDto?.email;

    const totalPrice = price * quantity;
    return this.expensesService.createExpense({
      email,
      category,
      productName,
      quantity,
      price,
      totalPrice,
    });
  }

  @Delete(':id')
  deleteUserById(@Param('id') id) {
    return this.expensesService.deleteExpenseById(Number(id));
  }

  @Put(':id')
  udpateUser(@Param('id') id, @Body() UpdateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.updateExpenseById(Number(id), UpdateExpenseDto);
  }
}
