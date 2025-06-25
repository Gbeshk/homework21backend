import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
import { CategoryPipe } from './pipes/category.pipe';
import { CreateExpenseDto } from './expensesdto/create-expense.dto';
import { QueryParamsDto } from './expensesdto/query-params.dto';
import { HasUserId } from 'src/common/guards/has-user-id.guard';

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
  getExpenseById(@Param('id') id) {
    return this.expensesService.getExpenseById(id);
  }

  @Post()
  @UseGuards(HasUserId)
  createExpense(
    @Headers('user-id') userId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    const category = createExpenseDto?.category;
    const productName = createExpenseDto?.productName;
    const quantity = createExpenseDto?.quantity;
    const price = createExpenseDto?.price;

    const totalPrice = price * quantity;
    return this.expensesService.createExpense({
      category,
      productName,
      quantity,
      price,
      totalPrice,
      userId,
    });
  }

  @Delete(':id')
  deleteExpenseById(@Param('id') id) {
    return this.expensesService.deleteExpenseById(id);
  }

  @Put(':id')
  updateExpense(@Param('id') id, @Body() UpdateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.updateExpenseById(id, UpdateExpenseDto);
  }
}
