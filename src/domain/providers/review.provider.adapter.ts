import { inject, injectable } from 'tsyringe';

import { CreateReviewArgs, ReviewProviderPort } from './review.provider.port';
import { ReviewRepositoryPort } from '../repositories/review.repository.port';
import { Review } from '../entities/review';
import { ProductRepositoryPort } from '../repositories/product.repository.port';
import { UserRepositoryPort } from '../repositories/user.repository.port';

@injectable()
class ReviewProviderAdapter implements ReviewProviderPort {
  constructor(
    @inject('ReviewRepository') private reviewRepository: ReviewRepositoryPort,
    @inject('ProductRepository') private productRepository: ProductRepositoryPort,
    @inject('UserRepository') private userRepository: UserRepositoryPort
  ) {}

  public async createReview(args: CreateReviewArgs): Promise<Review> {
    await Promise.all([
      this.productRepository.findById(args.productId), // throws if product not found
      this.userRepository.findById(args.userId), // throws if user not found
    ]);

    return this.reviewRepository.create({
      productId: args.productId,
      userId: args.userId,
      rating: args.rating,
      description: args.description,
    });
  }

  public async getReviews(args: Partial<Review>): Promise<Review[]> {
    return this.reviewRepository.findByFields({ ...args });
  }
}

export { ReviewProviderAdapter };
