"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const awss3_service_1 = require("../awss3/awss3.service");
const uuid_1 = require("uuid");
let UsersService = class UsersService {
    userModel;
    expenseModel;
    productModel;
    awsS3Service;
    constructor(userModel, expenseModel, productModel, awsS3Service) {
        this.userModel = userModel;
        this.expenseModel = expenseModel;
        this.productModel = productModel;
        this.awsS3Service = awsS3Service;
    }
    async getAllUsers(start, end, gender, email) {
        const filter = {};
        if (gender === 'm')
            filter.gender = 'male';
        if (gender === 'f')
            filter.gender = 'female';
        if (email) {
            filter.email = { $regex: `^${email}`, $options: 'i' };
        }
        const limit = end - start;
        const skip = start;
        const result = await this.userModel.find(filter).skip(skip).limit(limit);
        return result;
    }
    async uploadFiles(files) {
        const uploadFileIds = [];
        for (let file of files) {
            const fileType = file.mimetype.split('/')[1];
            const fileId = `images/${(0, uuid_1.v4)()}.${fileType}`;
            await this.awsS3Service.uploadFile(fileId, file);
            uploadFileIds.push(fileId);
        }
        return uploadFileIds;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const fileType = file.mimetype.split('/')[1];
        const fileId = `images/${(0, uuid_1.v4)()}.${fileType}`;
        await this.awsS3Service.uploadFile(fileId, file);
        const pictureUrl = process.env.CLOUD_FRONT + fileId;
        return pictureUrl;
    }
    async getUserById(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async createUser({ firstName, lastName, email, phoneNumber, gender, }) {
        const existUser = await this.userModel.findOne({ email });
        if (existUser) {
            throw new common_1.BadRequestException('Email alredy in use');
        }
        const currentDate = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(currentDate.getMonth() + 1);
        const newUser = await this.userModel.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            gender,
            subscriptionStartDate: currentDate.toISOString(),
            subscriptionEndDate: oneMonthLater.toISOString(),
        });
        return { success: 'ok', data: newUser };
    }
    async deleteUserById(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.expenseModel.deleteMany({ author: id });
        return 'User deleted successfully';
    }
    async updateUserById(id, updateUserDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(id, { $set: updateUserDto }, { new: true });
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return 'User updated successfully';
    }
    async updateSubscription(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { message: 'User not found' };
        }
        const currentDate = new Date(user.subscriptionEndDate);
        const newSubEnd = new Date(currentDate);
        newSubEnd.setMonth(newSubEnd.getMonth() + 1);
        user.subscriptionEndDate = newSubEnd.toISOString();
        await user.save();
        return { message: 'Subscription extended by 1 month' };
    }
    async changeRole(userId, userToChange, newRole) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const currentRole = user.role;
        console.log(currentRole);
        if (currentRole != 'admin') {
            throw new common_1.ForbiddenException('only admins have permission');
        }
        return this.userModel.findByIdAndUpdate(userToChange, { role: newRole }, { new: true });
    }
    async getStatistics(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const currentRole = user.role;
        console.log(currentRole);
        if (currentRole != 'admin') {
            throw new common_1.ForbiddenException('only admins have permission');
        }
        const totalUsers = await this.userModel.countDocuments();
        const totalExpenses = await this.expenseModel.countDocuments();
        const totalProducts = await this.productModel.countDocuments();
        return {
            totalUsers,
            totalExpenses,
            totalProducts,
        };
    }
    async getStatistic() {
        const expenses = await this.userModel.aggregate([
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 },
                    averageAge: { $avg: '$age' },
                },
            },
        ]);
        return expenses;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('Expense')),
    __param(2, (0, mongoose_1.InjectModel)('Product')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        awss3_service_1.AwsS3Service])
], UsersService);
//# sourceMappingURL=users.service.js.map