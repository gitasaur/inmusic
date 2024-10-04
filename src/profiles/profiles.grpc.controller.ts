import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProfilesService } from './profiles.service';
import {
  CreateProfileRequest, ProfileByIdRequest,
  UpdateProfileRequest
} from '../types/in_music_api';

@Controller()
export class ProfilesGrpcController {
  constructor(private readonly profilesService: ProfilesService) {}

  @GrpcMethod('ProfilesService', 'CreateProfile')
  async create(data: CreateProfileRequest) {
    return await this.profilesService.create(data);
  }

  @GrpcMethod('ProfilesService', 'GetProfiles')
  async findAll() {
    return this.profilesService.findAll();
  }

  @GrpcMethod('ProfilesService', 'GetProfile')
  async findOne(data: { id: number }) {
    return await this.profilesService.findOne(data);
  }

  @GrpcMethod('ProfilesService', 'UpdateProfile')
  async update(data: UpdateProfileRequest) {
    return await this.profilesService.update(data);
  }

  @GrpcMethod('ProfilesService', 'DeleteProfile')
  async remove(data: ProfileByIdRequest) {
    return await this.profilesService.remove(data);
  }
}
