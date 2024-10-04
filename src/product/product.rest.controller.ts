import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '../types/in_music_api';

@Controller('product')
export class ProductRestController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() data: CreateProductRequest): Promise<Product> {
    return this.productService.createProduct(data);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product | null> {
    return this.productService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Omit<UpdateProductRequest, 'id'>): Promise<Product> {
    return this.productService.updateProduct({ id, ...data });
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Product> {
    return this.productService.deleteProduct({ id });
  }
}