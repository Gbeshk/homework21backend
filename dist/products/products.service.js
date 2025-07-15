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
const uuid_1 = require("uuid");
const awss3_service_1 = require("../awss3/awss3.service");
let ProductsService = class ProductsService {
    productModel;
    awsS3Service;
    constructor(productModel, awsS3Service) {
        this.productModel = productModel;
        this.awsS3Service = awsS3Service;
    }
    async create({ name, price, category, quantity, description }, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const fileType = file.mimetype.split('/')[1];
        const fileId = `images/${(0, uuid_1.v4)()}.${fileType}`;
        await this.awsS3Service.uploadFile(fileId, file);
        const pictureUrl = process.env.CLOUD_FRONT + fileId;
        const newProduct = await this.productModel.create({
            category,
            name,
            quantity,
            price,
            description,
            img: pictureUrl,
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
    async update(id, updateProductDto, file) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException('product not found');
        }
        let newImageUrl = product.img;
        if (file) {
            const cloudFrontPrefix = process.env.CLOUD_FRONT || '';
            const oldFileKey = product.img.replace(cloudFrontPrefix, '');
            await this.awsS3Service.deleteFileById(oldFileKey);
            const fileType = file.mimetype.split('/')[1];
            const newFileKey = `images/${(0, uuid_1.v4)()}.${fileType}`;
            await this.awsS3Service.uploadFile(newFileKey, file);
            newImageUrl = process.env.CLOUD_FRONT + newFileKey;
        }
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, { $set: { ...updateProductDto, img: newImageUrl } }, { new: true });
        return { success: true, data: updatedProduct };
    }
    async remove(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException('product not found');
        }
        const cloudFrontPrefix = process.env.CLOUD_FRONT;
        const fileKey = product.img.replace(cloudFrontPrefix, '');
        await this.awsS3Service.deleteFileById(fileKey);
        await this.productModel.findByIdAndDelete(id);
        return 'product deleted successfully';
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Product')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        awss3_service_1.AwsS3Service])
], ProductsService);
//# sourceMappingURL=products.service.js.map