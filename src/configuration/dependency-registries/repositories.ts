import { DependencyContainer, instanceCachingFactory } from 'tsyringe';
import { Mongoose } from 'mongoose';
import config from 'config-dug';

import { getReviewRepositoryInstance } from '../../infrastructure/repositories/reviews/review.repository.adapter';
import { createMongoose } from '../db.config';
import { getProductRepositoryInstance } from '../../infrastructure/repositories/products/product.repository.adapter';
import { getUserRepositoryInstance } from '../../infrastructure/repositories/users/user.repository.adapter';

interface RepositoryInjectionArgs {
  container: DependencyContainer;
}

function setupRepositoriesInjection(args: RepositoryInjectionArgs): void {
  const { container } = args;

  container.register(Mongoose, {
    useFactory: instanceCachingFactory(() => createMongoose(config.DB_CONNECTION_STRING as string)),
  });
  container.register('ReviewRepository', {
    useFactory: instanceCachingFactory(() => getReviewRepositoryInstance(container.resolve(Mongoose))),
  });
  container.register('ProductRepository', {
    useFactory: instanceCachingFactory(() => getProductRepositoryInstance(container.resolve(Mongoose))),
  });
  container.register('UserRepository', {
    useFactory: instanceCachingFactory(() => getUserRepositoryInstance(container.resolve(Mongoose))),
  });
}

export { setupRepositoriesInjection };
