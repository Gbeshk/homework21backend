import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products = [
    {
      id: 1,
      name: 'magida',
      price: 200,
      category: 'aveji',
      quantity: 23,
      description: 'magari magidaa',
    },
    {
      id: 2,
      name: 'magida',
      price: 200,
      category: 'aveji',
      quantity: 23,
      description: 'magari magidaa',
    },
    {
      id: 3,
      name: 'samsung',
      price: 2000,
      category: 'telefonebi',
      quantity: 23,
      description: 'magari samsungi',
    },
    {
      id: 4,
      name: 'skami',
      price: 100,
      category: 'aveji',
      quantity: 23,
      description: 'magari skamia',
    },
  ];
  private users = [
    {
      id: 1,
      firstName: 'giorgi',
      lastName: 'beshkenadze',
      email: 'giorgi@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
    {
      id: 2,
      firstName: 'luka',
      lastName: 'beshkenadze',
      email: 'luka@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
    {
      id: 3,
      firstName: 'giorgi',
      lastName: 'beshkenadze',
      email: 'user@gmail.com',
      phoneNumber: '551537703',
      gender: 'male',
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
    {
      id: 4,
      firstName: 'mariami',
      lastName: 'meladze',
      email: 'user@gmail.com',
      phoneNumber: '1541212412',
      gender: 'female',
      subscriptionStartDate: '2025-06-21T20:29:47.326Z',
      subscriptionEndDate: '2025-07-21T20:29:47.326Z',
    },
  ];
  create({ name, price, category, quantity, description }: CreateProductDto) {
    if (!name || !price || !category || !quantity || !description) {
      throw new HttpException('all fields are requied', HttpStatus.BAD_REQUEST);
    }

    const lastId = this.products[this.products.length - 1]?.id || 0;

    const newProduct = {
      id: lastId + 1,
      name,
      price,
      category,
      quantity,
      description,
    };
    this.products.push(newProduct);

    return 'created successfully';
  }
  findAll(req) {
    const user = this.users.find((u) => u.email === req.email);

    const isSubscribed =
      user &&
      user.subscriptionEndDate &&
      new Date(user.subscriptionEndDate) > new Date();

    if (isSubscribed) {
      return this.products.map((product) => ({
        ...product,
        price: product.price * 0.7,
      }));
    }

    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((el) => el.id === id);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    const updateReq: UpdateProductDto = {};
    if (updateProductDto.name) {
      updateReq.name = updateProductDto.name;
    }
    if (updateProductDto.price) {
      updateReq.price = updateProductDto.price;
    }
    if (updateProductDto.quantity) {
      updateReq.quantity = updateProductDto.quantity;
    }
    if (updateProductDto.description) {
      updateReq.description = updateProductDto.description;
    }
    if (updateProductDto.category) {
      updateReq.category = updateProductDto.category;
    }
    this.products[index] = {
      ...this.products[index],
      ...updateReq,
    };

    return 'updated successfully';
  }

  remove(id: number) {
    const index = this.products.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    this.products.splice(index, 1);

    return 'deleted successfully';
  }
}
