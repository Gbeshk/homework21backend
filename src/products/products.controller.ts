import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SafeGuard } from './guards/safe.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const name = createProductDto?.name;
    const price = createProductDto?.price;
    const category = createProductDto?.category;
    const description = createProductDto?.description;
    const quantity = createProductDto?.quantity;

    return this.productsService.create({
      name,
      price,
      category,
      description,
      quantity,
    });
  }
  @Get()
  @UseGuards(SafeGuard)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return this.productsService.remove(id);
  }
}
