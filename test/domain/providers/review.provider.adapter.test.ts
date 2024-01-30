import { stub } from 'jest-auto-stub';

import { ReviewRepositoryPort } from '../../../src/domain/repositories/review.repository.port';
import { ReviewProviderAdapter } from '../../../src/domain/providers/review.provider.adapter';
import { CreateReviewArgs } from '../../../src/domain/providers/review.provider.port';
import { Review } from '../../../src/domain/entities/review';
import { ProductRepositoryPort } from '../../../src/domain/repositories/product.repository.port';
import { UserRepositoryPort } from '../../../src/domain/repositories/user.repository.port';
import { Product } from '../../../src/domain/entities/product';
import { User } from '../../../src/domain/entities/user';

describe('ReviewProviderAdapter', () => {
  const stubReviewRepository = stub<ReviewRepositoryPort>();
  const stubProductRepository = stub<ProductRepositoryPort>();
  const stubUserRepository = stub<UserRepositoryPort>();
  const provider = new ReviewProviderAdapter(stubReviewRepository, stubProductRepository, stubUserRepository);

  const input: CreateReviewArgs = {
    productId: '518cbb1389da79d3a25453f9',
    userId: '618cbb1389da79d3a26463f9',
    rating: 4,
    description: 'test description',
  };
  const createdReview: Review = {
    ...input,
    id: '651e6d2a857340be8bc0351b',
    createdAt: new Date(),
  };
  const product: Product = {
    id: input.productId,
    sellerId: '551e5d2a867340be8bc0361b',
    name: 'test name',
    description: 'test description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const user: User = {
    id: input.userId,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('createReview', () => {
    beforeEach(() => {
      stubReviewRepository.create.mockResolvedValue(createdReview);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('should create review', async () => {
      stubProductRepository.findById.mockResolvedValue(product);
      stubUserRepository.findById.mockResolvedValue(user);

      const result = await provider.createReview(input);

      expect(result).toStrictEqual(createdReview);
      expect(stubProductRepository.findById).toHaveBeenCalledTimes(1);
      expect(stubUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(stubReviewRepository.create).toHaveBeenCalledTimes(1);
      expect(stubReviewRepository.create).toHaveBeenCalledWith(input);
    });

    test('should throw when product not found', async () => {
      stubProductRepository.findById.mockImplementation(() => {
        throw new Error('product not found');
      });
      stubUserRepository.findById.mockResolvedValue(user);

      await expect(provider.createReview(input)).rejects.toThrow('product not found');

      expect(stubProductRepository.findById).toHaveBeenCalledTimes(1);
      expect(stubUserRepository.findById).toHaveBeenCalledTimes(0);
      expect(stubReviewRepository.create).toHaveBeenCalledTimes(0);
    });

    test('should throw when user not found', async () => {
      stubProductRepository.findById.mockResolvedValue(product);
      stubUserRepository.findById.mockImplementation(() => {
        throw new Error('user not found');
      });

      await expect(provider.createReview(input)).rejects.toThrow('user not found');

      expect(stubProductRepository.findById).toHaveBeenCalledTimes(1);
      expect(stubUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(stubReviewRepository.create).toHaveBeenCalledTimes(0);
    });
  });
});
