import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesGrpcController } from './profiles.grpc.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesRestController } from './profiles.rest.controller';

@Module({
  controllers: [
    ProfilesGrpcController,
    ProfilesRestController
  ],
  providers: [
    ProfilesService,
    PrismaService
  ],
})
export class ProfilesModule {}
