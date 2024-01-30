import { Mongoose } from 'mongoose';

import { getDependencyRegistryInstance } from '../../../src/configuration/dependency-registry';
import { connect } from '../../../src/configuration/db.config';
import { CreateInput, UserRepositoryPort } from '../../../src/domain/repositories/user.repository.port';

describe('UserRepositoryAdapter', () => {
  let repository: UserRepositoryPort;
  let db: Mongoose;

  const dependencyRegistry = getDependencyRegistryInstance();

  const setupDependencies = async () => {
    db = dependencyRegistry.resolve(Mongoose);

    await connect(db);

    repository = dependencyRegistry.resolve('UserRepository');
  };

  beforeAll(async () => {
    await setupDependencies();

    await db.models.User.ensureIndexes();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await db.models.User.deleteMany({});
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await db?.disconnect();
  });

  const createInput: CreateInput = {
    firstName: 'John',
    lastName: 'Doe',
  };

  describe('create/toObject', () => {
    it('should create and return a user', async () => {
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
    it('should find and return found users', async () => {
      const createInput2: CreateInput = {
        ...createInput,
        firstName: 'Betty',
      };
      const createdResults = await Promise.all([repository.create(createInput), repository.create(createInput2)]);
      const result = await repository.findByFields({});
      const resultForSingleAccount = await repository.findByFields({ firstName: createdResults[0].firstName });

      expect(createdResults).toStrictEqual(result);
      expect([createdResults[0]]).toStrictEqual(resultForSingleAccount);
    });
  });
});
