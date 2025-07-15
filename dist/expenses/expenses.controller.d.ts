import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './expensesdto/update-expense.dto';
import { CreateExpenseDto } from './expensesdto/create-expense.dto';
import { QueryParamsDto } from './expensesdto/query-params.dto';
import { ObjectId } from 'mongoose';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    createExpense(createExpenseDto: CreateExpenseDto, userId: ObjectId, file?: Express.Multer.File): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/expenses.schema").Expense, {}> & import("./schemas/expenses.schema").Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
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
    getSpenders(limit: string): Promise<any[]>;
    getStatistic(): Promise<any[]>;
    getExpenseById(id: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/expenses.schema").Expense, {}> & import("./schemas/expenses.schema").Expense & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteExpenseById(userId: ObjectId, id: any): Promise<string>;
    updateExpense(id: any, file: Express.Multer.File, updateExpenseDto: UpdateExpenseDto, userId: ObjectId): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/expenses.schema").Expense, {}> & import("./schemas/expenses.schema").Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
}
