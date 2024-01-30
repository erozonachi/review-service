import { Review } from '../entities/review';

export type CreateReviewArgs = Omit<Review, 'id' | 'createdAt'>;

export interface ReviewProviderPort {
  createReview(args: CreateReviewArgs): Promise<Review>;
  getReviews(filter: Partial<Review>): Promise<Review[]>;
}
