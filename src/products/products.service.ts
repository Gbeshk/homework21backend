import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}
  async create({
    name,
    price,
    category,
    quantity,
    description,
  }: CreateProductDto) {
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

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductDto },
      { new: true },
    );

    if (!updatedProduct) {
      throw new NotFoundException('product not found');
    }

    return 'product updated successfully';
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    await this.productModel.findByIdAndDelete(id);

    return 'product deleted successfully';
  }
}
