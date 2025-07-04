import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, ObjectId, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { Expense } from 'src/expenses/schemas/expenses.schema';
import { Product } from 'src/products/schemas/product.schema';
export declare class UsersService {
    private userModel;
    private expenseModel;
    private productModel;
    constructor(userModel: Model<User>, expenseModel: Model<Expense>, productModel: Model<Product>);
    getAllUsers(start: number, end: number, gender: string, email: string): Promise<(import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getUserById(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createUser({ firstName, lastName, email, phoneNumber, gender, }: CreateUserDto): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, User, {}> & User & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteUserById(id: string): Promise<string>;
    updateUserById(id: string, updateUserDto: UpdateUserDto): Promise<string>;
    updateSubscription(email: string): Promise<{
        message: string;
    }>;
    changeRole(userId: ObjectId, userToChange: string, newRole: string): Promise<(import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getStatistics(userId: ObjectId): Promise<{
        totalUsers: number;
        totalExpenses: number;
        totalProducts: number;
    }>;
    getStatistic(): Promise<any[]>;
}
