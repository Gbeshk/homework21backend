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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const query_params_dto_1 = require("./dto/query-params.dto");
const is_auth_guard_1 = require("../auth/guards/is-auth.guard");
const user_decorator_1 = require("./decorators/user.decorator");
const change_role_dto_1 = require("./dto/change-role.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAllUsers({ page, take, gender, email }) {
        const start = (page - 1) * take;
        const end = page * take;
        return this.usersService.getAllUsers(start, end, gender, email);
    }
    async getStatistics(userId) {
        return this.usersService.getStatistics(userId);
    }
    getStatistic() {
        return this.usersService.getStatistic();
    }
    getUserById(id) {
        return this.usersService.getUserById(id);
    }
    createUser(createUserDto) {
        return this.usersService.createUser(createUserDto);
    }
    deleteUserById(id) {
        return this.usersService.deleteUserById(id);
    }
    udpateUser(id, updateUserDto) {
        return this.usersService.updateUserById(id, updateUserDto);
    }
    updateSubscription(body) {
        return this.usersService.updateSubscription(body.email);
    }
    async changeUserRole(userId, body) {
        return this.usersService.changeRole(userId, body.userToChange, body.newRole);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_params_dto_1.QueryParamsDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard),
    __param(0, (0, user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('statistic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getStatistic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "udpateUser", null);
__decorate([
    (0, common_1.Post)('upgrade-subscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Post)('change-role'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard),
    __param(0, (0, user_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_role_dto_1.ChangeRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeUserRole", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map