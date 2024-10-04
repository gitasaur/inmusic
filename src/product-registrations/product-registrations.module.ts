import { Module } from '@nestjs/common';
import { ProductRegistrationsService } from './product-registrations.service';
import {
  ProductRegistrationsProfileRestController,
  ProductRegistrationsRootRestController
} from './product-registrations.rest.controller';
import {
  ProductRegistrationsGrpcController,
  ProductRegistrationsRootGrpcController
} from './product-registrations.grpc.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [
    ProductRegistrationsProfileRestController,
    ProductRegistrationsRootRestController,
    ProductRegistrationsGrpcController,
    ProductRegistrationsRootGrpcController
  ],
  providers: [ProductRegistrationsService, PrismaService],
})
export class ProductRegistrationsModule {}
