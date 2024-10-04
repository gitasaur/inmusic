import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductRegistrationsService } from './product-registrations.service';
import {
  CreateProductRegistrationRequest,
  ProductRegistrationByIdRequest,
  ProductRegistrationByProfileRequest,
  UpdateProductRegistrationRequest
} from '../types/in_music_api';

@Controller()
export class ProductRegistrationsRootGrpcController {
  constructor(
    protected readonly productRegistrationsService: ProductRegistrationsService
  ) {}

  @GrpcMethod('ProductRegistrationsService', 'GetAllProductRegistrations')
  async findAll() {
    return this.productRegistrationsService.findAll();
  }

  @GrpcMethod('ProductRegistrationsService', 'GetProductRegistrationById')
  findOneById(data: ProductRegistrationByIdRequest) {
    return this.productRegistrationsService.findOneById(data);
  }
}

@Controller()
export class ProductRegistrationsGrpcController {
  constructor(protected readonly productRegistrationsService: ProductRegistrationsService) {}

  @GrpcMethod('ProductRegistrationsService', 'CreateProductRegistration')
  async createProductRegistration(data: CreateProductRegistrationRequest) {
    return await this.productRegistrationsService.create(data);
  }

  @GrpcMethod('ProductRegistrationsService', 'GetProductRegistration')
  async findOneByProfile(data: ProductRegistrationByIdRequest) {
    return await this.productRegistrationsService.findOneByProfile(data);
  }

  @GrpcMethod('ProductRegistrationsService', 'GetProductRegistrationsByProfile')
  async findAllByProfile(data: ProductRegistrationByProfileRequest) {
    return this.productRegistrationsService.findAllByProfile(data);
  }

  @GrpcMethod('ProductRegistrationsService', 'UpdateProductRegistration')
  async update(data: UpdateProductRegistrationRequest) {
    return this.productRegistrationsService.update(data);
  }

  @GrpcMethod('ProductRegistrationsService', 'DeleteProductRegistration')
  async remove(data: ProductRegistrationByIdRequest) {
    return await this.productRegistrationsService.remove(data);
  }
}
