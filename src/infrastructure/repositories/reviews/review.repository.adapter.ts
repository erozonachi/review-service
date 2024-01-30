import { Model, Mongoose } from 'mongoose';

import { CreateInput, ReviewRepositoryPort, UpdateInput } from '../../../domain/repositories/review.repository.port';
import { ReviewDocument, getReviewSchema } from './review.schema';
import { Review } from '../../../domain/entities/review';
import { BaseRepository } from '../base.repository';

class ReviewRepositoryAdapter
  extends BaseRepository<ReviewDocument, Review, CreateInput, UpdateInput>
  implements ReviewRepositoryPort
{
  constructor(model: Model<ReviewDocument>) {
    super({ model });
  }

  /**
   * Converts the ReviewDocument into the Review type.
   */
  protected toObject(document: ReviewDocument): Review {
    return {
      id: document._id.toString(),
      productId: document.productId.toString(),
      userId: document.userId.toString(),
      rating: document.rating,
      description: document.description,
      createdAt: document.createdAt,
    };
  }
}

export const getReviewRepositoryInstance = (mongoose: Mongoose): ReviewRepositoryAdapter =>
  new ReviewRepositoryAdapter(mongoose.model<ReviewDocument>('Review', getReviewSchema()));

export { ReviewRepositoryAdapter };
