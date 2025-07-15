import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { AwsS3Service } from 'src/awss3/awss3.service';
export declare class ProductsService {
    private productModel;
    private awsS3Service;
    constructor(productModel: Model<Product>, awsS3Service: AwsS3Service);
    create({ name, price, category, quantity, description }: CreateProductDto, file: Express.Multer.File): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, Product, {}> & Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, Product, "find", {}>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, Product, {}> & Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    remove(id: string): Promise<string>;
}
