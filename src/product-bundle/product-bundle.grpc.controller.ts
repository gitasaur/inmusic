import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductBundleService } from './product-bundle.service';
import {
  CreateProductBundleRequest,
  FindProductBundleByIdRequest,
  RemoveProductBundleRequest,
  UpdateProductBundleRequest
} from '../types/in_music_api';

@Controller()
export class ProductBundleGrpcController {
  constructor(private readonly productBundleService: ProductBundleService) {}

  @GrpcMethod('ProductBundleService', 'CreateProductBundle')
  async create(data: CreateProductBundleRequest) {
    return await this.productBundleService.create(data);
  }

  @GrpcMethod('ProductBundleService', 'FindAllProductBundles')
  async findAll() {
    return await this.productBundleService.findAll();
  }

  @GrpcMethod('ProductBundleService', 'FindProductBundleById')
  async findOne(data: FindProductBundleByIdRequest) {
    return await this.productBundleService.findOne(data);
  }

  @GrpcMethod('ProductBundleService', 'UpdateProductBundle')
  async update(data: UpdateProductBundleRequest) {
    return await this.productBundleService.update(data);
  }

  @GrpcMethod('ProductBundleService', 'RemoveProductBundle')
  async remove(data: RemoveProductBundleRequest) {
    return await this.productBundleService.remove(data);
  }
}