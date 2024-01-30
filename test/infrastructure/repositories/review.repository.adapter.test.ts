import { Mongoose } from 'mongoose';

import { getDependencyRegistryInstance } from '../../../src/configuration/dependency-registry';
import { connect } from '../../../src/configuration/db.config';
import { CreateInput, ReviewRepositoryPort } from '../../../src/domain/repositories/review.repository.port';

describe('ReviewRepositoryAdapter', () => {
  let repository: ReviewRepositoryPort;
  let db: Mongoose;

  const dependencyRegistry = getDependencyRegistryInstance();

  const setupDependencies = async () => {
    db = dependencyRegistry.resolve(Mongoose);

    await connect(db);

    repository = dependencyRegistry.resolve('ReviewRepository');
  };

  beforeAll(async () => {
    await setupDependencies();

    await db.models.Review.ensureIndexes();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await db.models.Review.deleteMany({});
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await db?.disconnect();
  });

  const createInput: CreateInput = {
    productId: '518cbb1389da79d3a25453f9',
    userId: '518cbb1389da79d7a25493f9',
    rating: 3,
    description: 'test description',
  };

  describe('create/toObject', () => {
    it('should create and return a review', async () => {
      const result = await repository.create(createInput);

      expect(result).toStrictEqual({
        id: result.id,
        ...createInput,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('findByFields', () => {
    it('should find and return found reviews', async () => {
      const createInput2: CreateInput = {
        ...createInput,
        productId: '651e6d2a857340be8bc0351b',
      };
      const createdResults = await Promise.all([repository.create(createInput), repository.create(createInput2)]);
      const result = await repository.findByFields({});
      const resultForSingleAccount = await repository.findByFields({ productId: createdResults[0].productId });

      expect(createdResults).toStrictEqual(result);
      expect([createdResults[0]]).toStrictEqual(resultForSingleAccount);
    });
  });
});
