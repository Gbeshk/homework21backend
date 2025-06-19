import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
import { CategoryPipe } from './pipes/category.pipe';
import { CreateExpenseDto } from './expensesdto/create-expense.dto';
import { QueryParamsDto } from './expensesdto/query-params.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  getAllExpenses(
    @Query('category', new CategoryPipe()) category: string,
    @Query() { page, take, priceFrom, priceTo }: QueryParamsDto,
  ) {
    const start = (page - 1) * take;
    const end = page * take;
    return this.expensesService.getAllExpenses(
      category,
      start,
      end,
      priceFrom,
      priceTo,
    );
  }
  @Get(':id')
  getExpenseById(@Param('id', ParseIntPipe) id) {
    return this.expensesService.getExpenseById(id);
  }

  @Post()
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
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
  deleteExpenseById(@Param('id', ParseIntPipe) id) {
    return this.expensesService.deleteExpenseById(id);
  }

  @Put(':id')
  updateExpense(
    @Param('id', ParseIntPipe) id,
    @Body() UpdateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpenseById(id, UpdateExpenseDto);
  }
}
