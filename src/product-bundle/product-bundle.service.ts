import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductBundle } from '@prisma/client';
import {
  CreateProductBundleRequest,
  FindProductBundleByIdRequest, RemoveProductBundleRequest,
  UpdateProductBundleRequest
} from '../types/in_music_api';

@Injectable()
export class ProductBundleService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // Create a new product bundle
  async create(data: CreateProductBundleRequest): Promise<ProductBundle> {
    return this.prisma.productBundle.create({
      data: {
        mainProduct: { connect: { id: data.mainProductId } },
        bundledProduct: { connect: { id: data.bundledProductId } },
      },
    });
  }

  async findAll(): Promise<ProductBundle[]> {
    return this.prisma.productBundle.findMany({
      include: {
        mainProduct: true,
        bundledProduct: true,
      },
    });
  }

  async findOne(data: FindProductBundleByIdRequest): Promise<ProductBundle | null> {
    return this.prisma.productBundle.findUnique({
      where: { id: data.id },
      include: {
        mainProduct: true,
        bundledProduct: true,
      },
    });
  }

  async update(data: UpdateProductBundleRequest): Promise<ProductBundle> {
    return this.prisma.productBundle.update({
      where: { id: data.id },
      data: {
        mainProduct: { connect: { id: data.mainProductId } },
        bundledProduct: { connect: { id: data.bundledProductId } },
      },
    });
  }

  async remove(data: RemoveProductBundleRequest): Promise<ProductBundle> {
    return this.prisma.productBundle.delete({
      where: { id: data.id },
    });
  }
}