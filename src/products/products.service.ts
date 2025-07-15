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
import { v4 as uuidv4 } from 'uuid';
import { AwsS3Service } from 'src/awss3/awss3.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    private awsS3Service: AwsS3Service,
  ) {}
  async create(
    { name, price, category, quantity, description }: CreateProductDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileType = file.mimetype.split('/')[1];
    const fileId = `images/${uuidv4()}.${fileType}`;
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    let newImageUrl = product.img;

    if (file) {
      const cloudFrontPrefix = process.env.CLOUD_FRONT || '';
      const oldFileKey = product.img.replace(cloudFrontPrefix, '');

      await this.awsS3Service.deleteFileById(oldFileKey);

      const fileType = file.mimetype.split('/')[1];
      const newFileKey = `images/${uuidv4()}.${fileType}`;
      await this.awsS3Service.uploadFile(newFileKey, file);
      newImageUrl = process.env.CLOUD_FRONT + newFileKey;
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { $set: { ...updateProductDto, img: newImageUrl } },
      { new: true },
    );

    return { success: true, data: updatedProduct };
  }
  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    const cloudFrontPrefix = process.env.CLOUD_FRONT!;
    const fileKey = product.img.replace(cloudFrontPrefix, '');

    await this.awsS3Service.deleteFileById(fileKey);

    await this.productModel.findByIdAndDelete(id);

    return 'product deleted successfully';
  }
}
