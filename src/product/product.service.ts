import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import {
  CreateProductRequest,
  FindProductByIdRequest,
  RemoveProductRequest,
  UpdateProductRequest
} from '../types/in_music_api';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: CreateProductRequest): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(data: FindProductByIdRequest): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id: data.id },
    });
  }

  async updateProduct(data: UpdateProductRequest): Promise<Product> {
    return this.prisma.product.update({
      where: { id: data.id },
      data,
    });
  }

  async deleteProduct(data: RemoveProductRequest): Promise<Product> {
    return this.prisma.product.delete({
      where: { id: data.id },
    });
  }
}