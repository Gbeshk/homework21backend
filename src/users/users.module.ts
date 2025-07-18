import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schemas/user.schema';
import { expenseSchema } from 'src/expenses/schemas/expenses.schema';
import { productSchema } from 'src/products/schemas/product.schema';
import { AwsS3Module } from 'src/awss3/awss3.module';

@Module({
  imports: [
    AwsS3Module,
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Expense', schema: expenseSchema },
      { name: 'Product', schema: productSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UserModule {}
