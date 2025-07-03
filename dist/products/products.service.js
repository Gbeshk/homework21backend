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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create({ name, price, category, quantity, description, }) {
        const newProduct = await this.productModel.create({
            category,
            name,
            quantity,
            price,
            description,
        });
        return { success: 'ok', data: newProduct };
    }
    findAll() {
        return this.productModel.find();
    }
    async findOne(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException('product not found');
        }
        return product;
    }
    async update(id, updateProductDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, { $set: updateProductDto }, { new: true });
        if (!updatedProduct) {
            throw new common_1.NotFoundException('product not found');
        }
        return 'product updated successfully';
    }
    async remove(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException('product not found');
        }
        await this.productModel.findByIdAndDelete(id);
        return 'product deleted successfully';
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Product')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map