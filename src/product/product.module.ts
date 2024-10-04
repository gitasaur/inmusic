import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRestController } from './product.rest.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProductGrpcController } from './product.grpc.controller';

@Module({
  controllers: [
    ProductRestController,
    ProductGrpcController
  ],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
