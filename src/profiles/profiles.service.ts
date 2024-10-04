import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProfileRequest,
  FindProductByIdRequest,
  RemoveProductRequest,
  UpdateProfileRequest,
} from '../types/in_music_api';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create({ email, firstname, lastname }: CreateProfileRequest) {
    return this.prisma.profile.create({
      data: {
        email,
        firstname,
        lastname,
      },
    });
  }

  async findAll() {
    return this.prisma.profile.findMany({
      include: { productRegistrations: true },
    });
  }

  async findOne(data: FindProductByIdRequest) {
    return this.prisma.profile.findUnique({
      where: { id: data.id },
      include: {
        productRegistrations: {
          include: {
            product: true
          }
        }
      },
    });
  }

  async update({ id, email, firstname, lastname }: UpdateProfileRequest) {
    return this.prisma.profile.update({
      where: { id },
      data: {
        email,
        firstname,
        lastname,
      },
    });
  }

  async remove(data: RemoveProductRequest) {
    return this.prisma.profile.delete({
      where: { id: data.id },
    });
  }
}
