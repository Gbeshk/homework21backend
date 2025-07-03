import { SignUpDto } from './dto/sign-up.dto';
import { Model } from 'mongoose';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signUp({ firstName, lastName, email, password, phoneNumber, gender, }: SignUpDto): Promise<{
        message: string;
        data: {
            firstName: string;
            email: string;
            lastName: string;
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    signIn({ email, password }: SignInDto): Promise<{
        token: string;
    }>;
    getCurrentUser(userId: any): Promise<(import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
