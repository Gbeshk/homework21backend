import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from './schemas/product.schema';
import { AwsS3Module } from 'src/awss3/awss3.module';

@Module({
  imports: [
    AwsS3Module,
    MongooseModule.forFeature([{ schema: productSchema, name: 'Product' }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
