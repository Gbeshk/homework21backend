import { Expense } from './schemas/expenses.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
export declare class ExpensesService {
    private expenseModel;
    private userModel;
    constructor(expenseModel: Model<Expense>, userModel: Model<User>);
    getAllExpenses(category: string, start: number, end: number, priceFrom: number, priceTo: number, page: number, take: number): Promise<{
        total: number;
        take: number;
        page: number;
        expenses: (import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getExpenseById(id: string): Promise<import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createExpense({ category, productName, quantity, price, totalPrice, userId, }: {
        category: any;
        productName: any;
        quantity: any;
        price: any;
        totalPrice: any;
        userId: any;
    }): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteExpenseById(id: string, userId: ObjectId): Promise<string>;
    updateExpenseById(id: string, updateExpenseDto: UpdateExpenseDto, userId: ObjectId): Promise<string>;
}
