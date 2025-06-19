import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CategoryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const knowcategory = ['electronics', 'clothes'];

    if (value && !knowcategory.includes(value))
      throw new BadRequestException('uknow category');

    return value;
  }
}
