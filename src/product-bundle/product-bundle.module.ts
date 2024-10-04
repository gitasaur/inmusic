import { Module } from '@nestjs/common';
import { ProductBundleService } from './product-bundle.service';
import { ProductBundleRestController } from './product-bundle.rest.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProductBundleGrpcController } from './product-bundle.grpc.controller';

@Module({
  controllers: [
    ProductBundleRestController,
    ProductBundleGrpcController
  ],
  providers: [ProductBundleService, PrismaService],
})
export class ProductBundleModule {}
