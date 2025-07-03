import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { ObjectId } from 'mongoose';
import { ChangeRoleDto } from './dto/change-role.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUsers({ page, take, gender, email }: QueryParamsDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getStatistics(userId: ObjectId): Promise<{
        totalUsers: number;
        totalExpenses: number;
        totalProducts: number;
    }>;
    getUserById(id: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createUser(createUserDto: CreateUserDto): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteUserById(id: any): Promise<string>;
    udpateUser(id: any, updateUserDto: UpdateUserDto): Promise<string>;
    updateSubscription(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    changeUserRole(userId: ObjectId, body: ChangeRoleDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
