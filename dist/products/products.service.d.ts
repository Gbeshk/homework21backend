import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<Product>);
    create({ name, price, category, quantity, description, }: CreateProductDto): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto): Promise<string>;
    remove(id: string): Promise<string>;
}
