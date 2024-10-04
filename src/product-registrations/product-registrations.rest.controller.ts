import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ProductRegistrationsService } from './product-registrations.service';
import {
  CreateProductRegistrationRequest, UpdateProductRegistrationRequest,
} from '../types/in_music_api';

@Controller('product_registrations')
export class ProductRegistrationsRootRestController {
  constructor(protected readonly productRegistrationsService: ProductRegistrationsService) {}

  @Get()
  findAll() {
    return this.productRegistrationsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: number) {
    return this.productRegistrationsService.findOneById({ id });
  }
}

@Controller('profiles/:profile_id/product-registrations')
export class ProductRegistrationsProfileRestController{
  constructor(protected readonly productRegistrationsService: ProductRegistrationsService) {}

  @Post()
  create(
    @Param('profile_id') profileId: number,
    @Body() data: Omit<CreateProductRegistrationRequest, 'profileId'>,
  ) {
    return this.productRegistrationsService.create({ profileId, ...data });
  }

  @Get()
  findAll(@Param('profile_id') profileId: number) {
    return this.productRegistrationsService.findAllByProfile({ profileId });
  }

  @Get(':id')
  findOneByProfile(
    @Param('profile_id') profileId: number,
    @Param('id') id: number
  ) {
    return this.productRegistrationsService.findOneByProfile({ profileId, id });
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Omit<UpdateProductRegistrationRequest, 'id'>
  ) {
    return this.productRegistrationsService.update({ id, ...data });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productRegistrationsService.remove({ id });
  }
}