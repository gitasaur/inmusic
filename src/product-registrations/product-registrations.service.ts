import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductRegistrationRequest,
  ProductRegistrationByIdRequest,
  ProductRegistrationByProfileRequest,
  UpdateProductRegistrationRequest
} from '../types/in_music_api';

@Injectable()
export class ProductRegistrationsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data : CreateProductRegistrationRequest) {
    return await this.prisma.$transaction(async (prisma: PrismaService) => {
      const productRegistration = await prisma.productRegistration.create({
        data: {
          purchaseDate: data.purchaseDate,
          expiryAt: data.expiryAt,
          serialCode: data.serialCode,
          profileId: data.profileId,
          productId: data.productId
        },
      });

      // Check for products in `ProductBundles` table
      const bundles = await prisma.productBundle.findMany({
        where: { mainProductId: data.productId },
        include: { bundledProduct: true },
      });

      if (bundles.length) {
        // Register bundle products
        await prisma.productRegistration.createMany({
          data: bundles.map(bundle => ({
            purchaseDate: data.purchaseDate,
            expiryAt: data.expiryAt,
            serialCode: `bundle-${data.productId}`,
            profileId: data.profileId,
            productId: bundle.bundledProductId
          }))
        })
      }

      return prisma.productRegistration.findUnique({
        where: { id: productRegistration.id },
        include: {
          profile: {
            include: {
              productRegistrations: true,
            },
          },
          product: true,
        }
      });
    });
  }

  async findAll() {
    return this.prisma.productRegistration.findMany({
      include: { product: true },
    });
  }

  async findOneById(data: ProductRegistrationByIdRequest) {
    return this.prisma.productRegistration.findUnique({
      where: {
        id: data.id,
      },
      include: { product: true },
    });
  }

  async findOneByProfile(data: ProductRegistrationByIdRequest) {
    return this.prisma.productRegistration.findUnique({
      where: {
        id: data.id,
        profileId: data.profileId,
      },
      include: { product: true },
    });
  }

  async findAllByProfile(data: ProductRegistrationByProfileRequest) {
    return this.prisma.productRegistration.findMany({
      where: {
        profileId: data.profileId
      },
      include: { product: true },
    });
  }

  async update(data: UpdateProductRegistrationRequest) {
    return this.prisma.productRegistration.update({
      where: { id: data.id },
      data: {
        purchaseDate: data.purchaseDate,
        expiryAt: data.expiryAt,
        serialCode: data.serialCode,
      },
    });
  }

  async remove(data: ProductRegistrationByIdRequest) {
    return this.prisma.productRegistration.delete({
      where: { id: data.id },
    });
  }
}