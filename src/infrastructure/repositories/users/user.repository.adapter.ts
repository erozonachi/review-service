import { Model, Mongoose } from 'mongoose';

import { CreateInput, UserRepositoryPort, UpdateInput } from '../../../domain/repositories/user.repository.port';
import { UserDocument, getUserSchema } from './user.schema';
import { User } from '../../../domain/entities/user';
import { BaseRepository } from '../base.repository';

class UserRepositoryAdapter
  extends BaseRepository<UserDocument, User, CreateInput, UpdateInput>
  implements UserRepositoryPort
{
  constructor(model: Model<UserDocument>) {
    super({ model });
  }

  /**
   * Converts the UserDocument into the User type.
   */
  protected toObject(document: UserDocument): User {
    return {
      id: document._id.toString(),
      firstName: document.firstName,
      lastName: document.lastName,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

export const getUserRepositoryInstance = (mongoose: Mongoose): UserRepositoryAdapter =>
  new UserRepositoryAdapter(mongoose.model<UserDocument>('User', getUserSchema()));

export { UserRepositoryAdapter };
