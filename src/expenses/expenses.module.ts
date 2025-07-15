import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { expenseSchema } from './schemas/expenses.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/schemas/user.schema';
import { AwsS3Module } from 'src/awss3/awss3.module';

@Module({
  imports: [
    AwsS3Module,
    MongooseModule.forFeature([
      { name: 'Expense', schema: expenseSchema },
      { schema: userSchema, name: 'user' },
    ]),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpenseModule {}
