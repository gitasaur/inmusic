import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductBundleService } from './product-bundle.service';
import {
  CreateProductBundleRequest,
  UpdateProductBundleRequest,
} from '../types/in_music_api';

@Controller('product-bundles')
export class ProductBundleRestController {
  constructor(private readonly productBundleService: ProductBundleService) {}

  @Post()
  create(@Body() data: CreateProductBundleRequest) {
    return this.productBundleService.create(data);
  }

  @Get()
  findAll() {
    return this.productBundleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productBundleService.findOne({ id });
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Omit<UpdateProductBundleRequest, 'id'>,
  ) {
    return this.productBundleService.update({ id, ...data });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productBundleService.remove({ id });
  }
}