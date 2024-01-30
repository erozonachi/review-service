import { Types, Document as MongoDocument, Schema } from 'mongoose';

import { Product } from '../../../domain/entities/product';

export interface ProductDocument extends MongoDocument, Omit<Product, 'id' | 'sellerId'> {
  _id: Types.ObjectId;
  sellerId: Types.ObjectId;
}

export const getProductSchema = (): Schema => {
  const schema = new Schema(
    {
      sellerId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },
      name: {
        type: Schema.Types.String,
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
