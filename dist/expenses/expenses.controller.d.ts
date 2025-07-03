import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
import { CreateExpenseDto } from './expensesdto/create-expense.dto';
import { QueryParamsDto } from './expensesdto/query-params.dto';
import { ObjectId } from 'mongoose';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    getAllExpenses(category: string, { page, take, priceFrom, priceTo }: QueryParamsDto): Promise<{
        total: number;
        take: number;
        page: number;
        expenses: (import("mongoose").Document<unknown, {}, import("./schemas/expenses.schema").Expense, {}> & import("./schemas/expenses.schema").Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getExpenseById(id: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/expenses.schema").Expense, {}> & import("./schemas/expenses.schema").Expense & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createExpense(userId: string, createExpenseDto: CreateExpenseDto): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/expenses.schema").Expense, {}> & import("./schemas/expenses.schema").Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteExpenseById(userId: ObjectId, id: any): Promise<string>;
    updateExpense(id: any, UpdateExpenseDto: UpdateExpenseDto, userId: ObjectId): Promise<string>;
}
