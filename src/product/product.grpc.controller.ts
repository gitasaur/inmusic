import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import {
  CreateProductRequest,
  FindProductByIdRequest, RemoveProductRequest, UpdateProductRequest
} from '../types/in_music_api';

@Controller()
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  async create(data: CreateProductRequest) {
    return await this.productService.createProduct(data);
  }

  @GrpcMethod('ProductService', 'FindAllProducts')
  async findAll() {
    return await this.productService.findAll();
  }

  @GrpcMethod('ProductService', 'FindProductById')
  async findOne(data: FindProductByIdRequest) {
    return await this.productService.findOne(data);
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  async update(data: UpdateProductRequest) {
    return await this.productService.updateProduct(data);
  }

  @GrpcMethod('ProductService', 'RemoveProduct')
  async remove(data: RemoveProductRequest) {
    return await this.productService.deleteProduct(data);
  }
}