import { Mongoose } from 'mongoose';

import { getDependencyRegistryInstance } from '../../../src/configuration/dependency-registry';
import { connect } from '../../../src/configuration/db.config';
import { CreateInput, ProductRepositoryPort } from '../../../src/domain/repositories/product.repository.port';

describe('ProductRepositoryAdapter', () => {
  let repository: ProductRepositoryPort;
  let db: Mongoose;

  const dependencyRegistry = getDependencyRegistryInstance();

  const setupDependencies = async () => {
    db = dependencyRegistry.resolve(Mongoose);

    await connect(db);

    repository = dependencyRegistry.resolve('ProductRepository');
  };

  beforeAll(async () => {
    await setupDependencies();

    await db.models.Product.ensureIndexes();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await db.models.Product.deleteMany({});
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await db?.disconnect();
  });

  const createInput: CreateInput = {
    sellerId: '518cbb1389da79d3a25453f9',
    name: 'test name',
    description: 'test description',
  };

  describe('create/toObject', () => {
    it('should create and return a product', async () => {
      const result = await repository.create(createInput);

      expect(result).toStrictEqual({
        id: result.id,
        ...createInput,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findByFields', () => {
    it('should find and return found products', async () => {
      const createInput2: CreateInput = {
        ...createInput,
        sellerId: '651e6d2a857340be8bc0351b',
      };
      const createdResults = await Promise.all([repository.create(createInput), repository.create(createInput2)]);
      const result = await repository.findByFields({});
      const resultForSingleAccount = await repository.findByFields({ sellerId: createdResults[0].sellerId });

      expect(createdResults).toStrictEqual(result);
      expect([createdResults[0]]).toStrictEqual(resultForSingleAccount);
    });
  });
});
