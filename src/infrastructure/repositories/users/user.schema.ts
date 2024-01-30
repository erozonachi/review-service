import { Types, Document as MongoDocument, Schema } from 'mongoose';

import { User } from '../../../domain/entities/user';

export interface UserDocument extends MongoDocument, Omit<User, 'id'> {
  _id: Types.ObjectId;
}

export const getUserSchema = (): Schema => {
  const schema = new Schema(
    {
      firstName: {
        type: Schema.Types.String,
        required: true,
      },
      lastName: {
        type: Schema.Types.String,
        required: true,
      },
    },
    { timestamps: true }
  );

  return schema;
};
