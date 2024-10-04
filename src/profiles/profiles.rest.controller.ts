import { Controller, Post, Get, Param, Put, Delete, Body } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  CreateProfileRequest,
  UpdateProfileRequest
} from '../types/in_music_api';

@Controller('profiles')
export class ProfilesRestController {
  constructor(protected readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileRequest) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.profilesService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Omit<UpdateProfileRequest, 'id'>) {
    return this.profilesService.update({ id, ...data });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.profilesService.remove({ id });
  }
}
