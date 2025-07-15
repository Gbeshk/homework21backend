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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const awss3_service_1 = require("../awss3/awss3.service");
const uuid_1 = require("uuid");
let ExpensesService = class ExpensesService {
    expenseModel;
    userModel;
    awsS3Service;
    constructor(expenseModel, userModel, awsS3Service) {
        this.expenseModel = expenseModel;
        this.userModel = userModel;
        this.awsS3Service = awsS3Service;
    }
    async getAllExpenses(category, start, end, priceFrom, priceTo, page, take) {
        const total = await this.expenseModel.countDocuments();
        const expenses = await this.expenseModel
            .find()
            .populate({ path: 'author', select: 'email firstName lastName' })
            .skip((page - 1) * take)
            .limit(take)
            .sort({ _id: -1 });
        return { total, take, page, expenses };
    }
    async getExpenseById(id) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid expense ID');
        }
        const expense = await this.expenseModel.findById(id);
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense;
    }
    async createExpense(userId, createExpenseDto, file) {
        const existUser = await this.userModel.findById(userId);
        if (!existUser)
            throw new common_1.BadRequestException('user not found');
        let imageUrl;
        if (file) {
            const fileType = file.mimetype.split('/')[1];
            const fileKey = `images/${(0, uuid_1.v4)()}.${fileType}`;
            await this.awsS3Service.uploadFile(fileKey, file);
            imageUrl = process.env.CLOUD_FRONT + fileKey;
        }
        const totalPrice = createExpenseDto.quantity * createExpenseDto.price;
        const newExpense = await this.expenseModel.create({
            category: createExpenseDto.category,
            productName: createExpenseDto.productName,
            quantity: createExpenseDto.quantity,
            price: createExpenseDto.price,
            totalPrice: totalPrice,
            img: imageUrl,
            author: existUser._id,
        });
        await this.userModel.findByIdAndUpdate(existUser._id, {
            $push: { expenses: newExpense._id },
        });
        return { success: 'ok', data: newExpense };
    }
    async deleteExpenseById(id, userId) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid expense ID');
        }
        const expense = await this.expenseModel.findById(id);
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        if (expense.author.toString() !== userId.toString()) {
            throw new common_1.BadRequestException('you dont have permission');
        }
        if (expense.img) {
            const cloudFrontPrefix = process.env.CLOUD_FRONT;
            const fileKey = expense.img.replace(cloudFrontPrefix, '');
            await this.awsS3Service.deleteFileById(fileKey);
        }
        await this.expenseModel.findByIdAndDelete(id);
        await this.userModel.updateOne({ _id: expense.author }, { $pull: { expenses: new mongoose_1.Types.ObjectId(id) } });
        return 'Expense deleted successfully';
    }
    async updateExpenseById(id, updateExpenseDto, userId, file) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid expense ID');
        }
        const expense = await this.expenseModel.findById(id);
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        if (expense.author.toString() !== userId.toString()) {
            throw new common_1.BadRequestException('you dont have permission');
        }
        let newImageUrl = expense.img;
        if (file) {
            const cloudFrontPrefix = process.env.CLOUD_FRONT || '';
            const oldFileKey = expense.img?.replace(cloudFrontPrefix, '');
            if (oldFileKey) {
                await this.awsS3Service.deleteFileById(oldFileKey);
            }
            const fileType = file.mimetype.split('/')[1];
            const newFileKey = `images/${(0, uuid_1.v4)()}.${fileType}`;
            await this.awsS3Service.uploadFile(newFileKey, file);
            newImageUrl = process.env.CLOUD_FRONT + newFileKey;
        }
        const updatedExpense = await this.expenseModel.findByIdAndUpdate(id, { $set: { ...updateExpenseDto, img: newImageUrl } }, { new: true });
        return { success: true, data: updatedExpense };
    }
    async getStatistic() {
        const expenses = await this.expenseModel.aggregate([
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$price' },
                    count: { $sum: 1 },
                    items: { $push: '$$ROOT' },
                },
            },
        ]);
        return expenses;
    }
    async getSpenders(limit) {
        const expenses = await this.expenseModel.aggregate([
            {
                $group: {
                    _id: '$author',
                    total: { $sum: '$price' },
                    count: { $sum: 1 },
                },
            },
            {
                $limit: limit,
            },
        ]);
        return expenses;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Expense')),
    __param(1, (0, mongoose_2.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        awss3_service_1.AwsS3Service])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map