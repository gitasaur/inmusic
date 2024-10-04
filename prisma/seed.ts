import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const createFakerProfile = () => ({
  email: faker.internet.email(),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
});

const createFakerProduct = () => ({
  SKU: faker.string.alphanumeric(6).toUpperCase(),
  name: faker.commerce.productName(),
});

const createFakerProductRegistration = (profileId: number, productId: number) => ({
  profileId,
  productId,
  purchaseDate: faker.date.past().toISOString(),
  expiryAt: faker.date.future().toISOString(),
  serialCode: faker.string.alphanumeric(10).toUpperCase(),
});

const createFakerProductBundle = (mainProductId: number, bundledProductId: number) => ({
  mainProductId,
  bundledProductId,
});

async function main() {
  console.log('Seeding the database...');

  await prisma.profile.createMany({
    data: [
      createFakerProfile(),
      createFakerProfile(),
    ],
  });

  const allProfiles = await prisma.profile.findMany();

  await prisma.product.createMany({
    data: [
      createFakerProduct(),
      createFakerProduct(),
      createFakerProduct(),
    ],
  });

  const allProducts = await prisma.product.findMany();

  for (const profile of allProfiles) {
    for (const product of allProducts.slice(0, 2)) {
      const fakeRegistration= createFakerProductRegistration(profile.id, product.id);
      await prisma.productRegistration.create({
        data: {
          purchaseDate: fakeRegistration.purchaseDate,
          expiryAt: fakeRegistration.expiryAt,
          serialCode: fakeRegistration.serialCode,
          profile: {
            connect: { id: fakeRegistration.profileId },
          },
          product: {
            connect: { id: fakeRegistration.productId },
          },
        },
      });
    }
  }

  // Create Product Bundles (Assume each product has a bundle)
  for (const mainProduct of allProducts.slice(0, 2)) {
    const bundledProduct = allProducts[2];
    const fakeBundledProduct = createFakerProductBundle(mainProduct.id, bundledProduct.id);
    await prisma.productBundle.create({
      data: {
        mainProduct: { connect: { id: fakeBundledProduct.mainProductId } },
        bundledProduct: { connect: { id: fakeBundledProduct.bundledProductId } },
      },
    });
  }

  console.log('Database has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
