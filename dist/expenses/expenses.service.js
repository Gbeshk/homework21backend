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
let ExpensesService = class ExpensesService {
    expenseModel;
    userModel;
    constructor(expenseModel, userModel) {
        this.expenseModel = expenseModel;
        this.userModel = userModel;
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
    async createExpense({ category, productName, quantity, price, totalPrice, userId, }) {
        const existExpense = await this.userModel.findById(userId);
        if (!existExpense)
            throw new common_1.BadRequestException('expense not found');
        const newExpense = await this.expenseModel.create({
            category,
            productName,
            quantity,
            price,
            totalPrice,
            author: existExpense._id,
        });
        await this.userModel.findByIdAndUpdate(existExpense._id, {
            $push: { expenses: newExpense._id },
        });
        return { success: 'ok', data: newExpense };
    }
    async deleteExpenseById(id, userId) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid expense ID');
        }
        const expense = await this.expenseModel.findById(id);
        if (expense?.author != userId) {
            throw new common_1.BadRequestException('you dont have permission');
        }
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        await this.expenseModel.findByIdAndDelete(id);
        await this.userModel.updateOne({ _id: expense.author }, { $pull: { expenses: new mongoose_1.Types.ObjectId(id) } });
        return 'Expense deleted successfully';
    }
    async updateExpenseById(id, updateExpenseDto, userId) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid expense ID');
        }
        const expense = await this.expenseModel.findById(id);
        if (expense?.author != userId) {
            throw new common_1.BadRequestException('you dont have permission');
        }
        const updatedExpense = await this.expenseModel.findByIdAndUpdate(id, { $set: updateExpenseDto }, { new: true });
        if (!updatedExpense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return 'Expense updated successfully';
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
        mongoose_1.Model])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map