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
const platform_express_1 = require("@nestjs/platform-express");
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    createExpense(createExpenseDto, userId, file) {
        return this.expensesService.createExpense(userId, createExpenseDto, file);
    }
    getAllExpenses(category, { page, take, priceFrom, priceTo }) {
        const start = (page - 1) * take;
        const end = page * take;
        return this.expensesService.getAllExpenses(category, start, end, priceFrom, priceTo, +page, +take);
    }
    getSpenders(limit) {
        return this.expensesService.getSpenders(+limit);
    }
    getStatistic() {
        return this.expensesService.getStatistic();
    }
    getExpenseById(id) {
        return this.expensesService.getExpenseById(id);
    }
    deleteExpenseById(userId, id) {
        return this.expensesService.deleteExpenseById(id, userId);
    }
    updateExpense(id, file, updateExpenseDto, userId) {
        return this.expensesService.updateExpenseById(id, updateExpenseDto, userId, file);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.UserId)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto, Object, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category', new category_pipe_1.CategoryPipe())),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_params_dto_1.QueryParamsDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getAllExpenses", null);
__decorate([
    (0, common_1.Get)('/top-spenders'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getSpenders", null);
__decorate([
    (0, common_1.Get)('statistic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getStatistic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getExpenseById", null);
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
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_expense_dto_1.UpdateExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "updateExpense", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard),
    (0, common_1.Controller)('expenses'),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map