import { Expense } from './schemas/expenses.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
import { AwsS3Service } from 'src/awss3/awss3.service';
export declare class ExpensesService {
    private expenseModel;
    private userModel;
    private awsS3Service;
    constructor(expenseModel: Model<Expense>, userModel: Model<User>, awsS3Service: AwsS3Service);
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
    createExpense(userId: any, createExpenseDto: any, file: any): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteExpenseById(id: string, userId: ObjectId): Promise<string>;
    updateExpenseById(id: string, updateExpenseDto: UpdateExpenseDto, userId: ObjectId, file?: Express.Multer.File): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    getStatistic(): Promise<any[]>;
    getSpenders(limit: number): Promise<any[]>;
}
