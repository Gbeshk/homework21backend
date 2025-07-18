import { Module } from '@nestjs/common';
import { AwsS3Service } from './awss3.service';

@Module({
  providers: [AwsS3Service],
  exports: [AwsS3Service]
})
export class AwsS3Module {}