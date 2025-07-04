import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
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
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { ObjectId } from 'mongoose';

@UseGuards(IsAuthGuard)
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
      +page,
      +take,
    );
  }
  @Get('/top-spenders')
  getSpenders(@Query('limit') limit: string) {
    return this.expensesService.getSpenders(+limit);
  }
  @Get('statistic')
  getStatistic() {
    return this.expensesService.getStatistic();
  }

  @Get(':id')
  getExpenseById(@Param('id') id) {
    return this.expensesService.getExpenseById(id);
  }

  @Post()
  createExpense(
    @UserId() userId: string,
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
  deleteExpenseById(@UserId() userId: ObjectId, @Param('id') id) {
    return this.expensesService.deleteExpenseById(id, userId);
  }

  @Put(':id')
  updateExpense(
    @Param('id') id,
    @Body() UpdateExpenseDto: UpdateExpenseDto,
    @UserId() userId: ObjectId,
  ) {
    return this.expensesService.updateExpenseById(id, UpdateExpenseDto, userId);
  }
}
