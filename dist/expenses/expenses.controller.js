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
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const expenses_service_1 = require("./expenses.service");
const update_expense_dto_1 = require("./expensesdto/update-expense.dto");
const category_pipe_1 = require("./pipes/category.pipe");
const create_expense_dto_1 = require("./expensesdto/create-expense.dto");
const query_params_dto_1 = require("./expensesdto/query-params.dto");
const is_auth_guard_1 = require("../auth/guards/is-auth.guard");
const user_decorator_1 = require("../users/decorators/user.decorator");
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    getAllExpenses(category, { page, take, priceFrom, priceTo }) {
        const start = (page - 1) * take;
        const end = page * take;
        return this.expensesService.getAllExpenses(category, start, end, priceFrom, priceTo, +page, +take);
    }
    getExpenseById(id) {
        return this.expensesService.getExpenseById(id);
    }
    createExpense(userId, createExpenseDto) {
        const category = createExpenseDto?.category;
        const productName = createExpenseDto?.productName;
        const quantity = createExpenseDto?.quantity;
        const price = createExpenseDto?.price;
        const totalPrice = price * quantity;
        return this.expensesService.createExpense({
            category,
            productName,
            quantity,
            price,
            totalPrice,
            userId,
        });
    }
    deleteExpenseById(userId, id) {
        return this.expensesService.deleteExpenseById(id, userId);
    }
    updateExpense(id, UpdateExpenseDto, userId) {
        return this.expensesService.updateExpenseById(id, UpdateExpenseDto, userId);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category', new category_pipe_1.CategoryPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_params_dto_1.QueryParamsDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getAllExpenses", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getExpenseById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, user_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, user_decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "deleteExpenseById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_expense_dto_1.UpdateExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "updateExpense", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard),
    (0, common_1.Controller)('expenses'),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map