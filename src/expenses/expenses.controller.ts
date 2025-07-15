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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
import { CategoryPipe } from './pipes/category.pipe';
import { CreateExpenseDto } from './expensesdto/create-expense.dto';
import { QueryParamsDto } from './expensesdto/query-params.dto';
import { IsAuthGuard } from 'src/auth/guards/is-auth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(IsAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
    @UserId() userId: ObjectId,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.expensesService.createExpense(userId, createExpenseDto, file);
  }
  // @Put(':id')
  // @UseInterceptors(FileInterceptor('file'))
  // updateExpenseById(
  //   @Param('id') id,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() updateExpenseDto: UpdateExpenseDto,
  //   @UserId() userId: ObjectId,
  // ) {
  //   return this.expensesService.updateExpenseById(
  //     id,
  //     updateExpenseDto,
  //     userId,
  //     file,
  //   );
  // }
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

  @Delete(':id')
  deleteExpenseById(@UserId() userId: ObjectId, @Param('id') id) {
    return this.expensesService.deleteExpenseById(id, userId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateExpense(
    @Param('id') id,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @UserId() userId: ObjectId,
  ) {
    return this.expensesService.updateExpenseById(
      id,
      updateExpenseDto,
      userId,
      file,
    );
  }
}
