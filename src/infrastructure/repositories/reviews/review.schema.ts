import { Types, Document as MongoDocument, Schema } from 'mongoose';

import { Review } from '../../../domain/entities/review';
import { validateRating } from '../../../lib/db-helper';

export interface ReviewDocument extends MongoDocument, Omit<Review, 'id' | 'productId' | 'userId'> {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
}

export const getReviewSchema = (): Schema => {
  const schema = new Schema(
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },
      rating: {
        type: Schema.Types.Number,
        validate: validateRating,
        required: true,
      },
      description: {
        type: Schema.Types.String,
        required: true,
      },
    },
    { timestamps: true }
  );

  return schema;
};
