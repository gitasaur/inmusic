import { ProductRegistrationsService } from './product-registrations.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProductRegistrationRequest,
  ProductBundleResponse,
  ProductRegistration,
} from '../types/in_music_api';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

const FIXED_DATE = '2023-01-01T00:00:00.000Z';
const PRODUCT_ID = 1;
const PROFILE_ID = 1;
const SERIAL_CODE = 'ABC123';

describe('ProductRegistrationsService', () => {
  let service: ProductRegistrationsService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRegistrationsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProductRegistrationsService>(ProductRegistrationsService);

    jest.resetAllMocks();
  });

  const createTestRequest = (): CreateProductRegistrationRequest => ({
    productId: PRODUCT_ID,
    profileId: PROFILE_ID,
    serialCode: SERIAL_CODE,
    purchaseDate: new Date(FIXED_DATE).toISOString(),
    expiryAt: new Date(FIXED_DATE).toISOString(),
  });

  const createTestRegistration = (request: CreateProductRegistrationRequest): ProductRegistration => ({
    ...request,
    id: 1,
    profile: undefined,
    product: undefined,
  });

  describe('create', () => {
    it('should register a product without bundles', async () => {
      const request = createTestRequest();
      const testRegistration = createTestRegistration(request);

      const expectedResult: ProductRegistration = {
        ...testRegistration,
        profile: {
          id: PROFILE_ID,
          productRegistrations: [testRegistration],
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
        },
        product: {
          id: PRODUCT_ID,
          SKU: SERIAL_CODE,
          name: 'Test Product',
        },
      };

      // @ts-ignore (prisma <> proto datetimes are 🚮)
      prismaMock.productRegistration.create.mockResolvedValue(testRegistration);
      prismaMock.productBundle.findMany.mockResolvedValue([]);
      // @ts-ignore
      prismaMock.productRegistration.findUnique.mockResolvedValue(expectedResult);
      prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));

      // Execute the service method
      const result = await service.create(request);

      // Assertions
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.productRegistration.create).toHaveBeenCalledWith({
        data: {
          purchaseDate: request.purchaseDate,
          expiryAt: request.expiryAt,
          serialCode: request.serialCode,
          profileId: request.profileId,
          productId: request.productId,
        },
      });
      expect(prismaMock.productBundle.findMany).toHaveBeenCalledWith({
        where: { mainProductId: request.productId },
        include: { bundledProduct: true },
      });
      expect(prismaMock.productRegistration.createMany).not.toHaveBeenCalled();
      expect(prismaMock.productRegistration.findUnique).toHaveBeenCalledWith({
        where: { id: testRegistration.id },
        include: {
          profile: { include: { productRegistrations: true } },
          product: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should register a product and bundled products if bundles exist', async () => {
      const request = createTestRequest();
      const testRegistration = createTestRegistration(request);

      const expectedResult: ProductRegistration = {
        ...testRegistration,
        profile: {
          id: PROFILE_ID,
          productRegistrations: [testRegistration],
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
        },
        product: {
          id: PRODUCT_ID,
          SKU: SERIAL_CODE,
          name: 'Test Product',
        },
      };

      // Mock product bundle data
      const testBundle: ProductBundleResponse = {
        id: 1,
        mainProductId: 1,
        bundledProductId: 2,
      };

      // @ts-ignore
      prismaMock.productRegistration.create.mockResolvedValue(testRegistration);
      prismaMock.productBundle.findMany.mockResolvedValue([testBundle]);
      prismaMock.productRegistration.createMany.mockResolvedValue({ count: 1 });
      // @ts-ignore
      prismaMock.productRegistration.findUnique.mockResolvedValue(expectedResult);
      prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));

      const result = await service.create(request);

      expect(prismaMock.productRegistration.create).toHaveBeenCalledWith({
        data: {
          purchaseDate: request.purchaseDate,
          expiryAt: request.expiryAt,
          serialCode: request.serialCode,
          profileId: request.profileId,
          productId: request.productId,
        },
      });

      expect(prismaMock.productBundle.findMany).toHaveBeenCalledWith({
        where: { mainProductId: request.productId },
        include: { bundledProduct: true },
      });
      expect(prismaMock.productRegistration.createMany).toHaveBeenCalledWith({
        data: [
          {
            purchaseDate: request.purchaseDate,
            expiryAt: request.expiryAt,
            serialCode: `bundle-${request.productId}`,
            profileId: request.profileId,
            productId: testBundle.bundledProductId,
          },
        ],
      });

      expect(prismaMock.productRegistration.findUnique).toHaveBeenCalledWith({
        where: { id: testRegistration.id },
        include: {
          profile: { include: { productRegistrations: true } },
          product: true,
        },
      });

      expect(result).toEqual(expectedResult);
    });

    it('should rollback if transaction fails', async () => {
      const request = createTestRequest();
      const errorMessage = 'Transaction failed';

      prismaMock.$transaction.mockRejectedValue(new Error(errorMessage));
      await expect(service.create(request)).rejects.toThrow(errorMessage);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
