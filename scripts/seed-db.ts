/* eslint-disable no-console */
import 'reflect-metadata';
import { Mongoose } from 'mongoose';
import readlineSync from 'readline-sync';

import { DependencyRegistry, getDependencyRegistryInstance } from '../src/configuration/dependency-registry';
import { Product } from '../src/domain/entities/product';
import { Review } from '../src/domain/entities/review';
import { User } from '../src/domain/entities/user';
import { ProductRepositoryPort } from '../src/domain/repositories/product.repository.port';
import { ReviewRepositoryPort } from '../src/domain/repositories/review.repository.port';
import { UserRepositoryPort } from '../src/domain/repositories/user.repository.port';
import { connect } from '../src/configuration/db.config';

interface SeedReviewArgs {
  dependencyRegistry: DependencyRegistry;
  productId: string;
  userId: string;
}

const seedProductFn = async (dependencyRegistry: DependencyRegistry): Promise<Product> => {
  const repository = dependencyRegistry.resolve<ProductRepositoryPort>('ProductRepository');

  return repository.create({
    sellerId: '661e6d2a867540be8bc0361b',
    name: 'seed product name',
    description: 'seed product description',
  });
};

const seedUserFn = async (dependencyRegistry: DependencyRegistry): Promise<User> => {
  const repository = dependencyRegistry.resolve<UserRepositoryPort>('UserRepository');

  return repository.create({
    firstName: 'John',
    lastName: 'Doe',
  });
};

const seedReviewFn = async (args: SeedReviewArgs): Promise<Review> => {
  const repository = args.dependencyRegistry.resolve<ReviewRepositoryPort>('ReviewRepository');

  return repository.create({
    productId: args.productId,
    userId: args.userId,
    rating: 3,
    description: 'Nice product',
  });
};

const seed = async (): Promise<void> => {
  try {
    console.log('Seeding database...');

    const dependencyRegistry = getDependencyRegistryInstance();
    const mongoose = dependencyRegistry.resolve(Mongoose);
    const db = await connect(mongoose);

    for (const collection of await db.connection.db.collections()) {
      await collection.deleteMany({});
    }

    const product = await seedProductFn(dependencyRegistry);
    const user = await seedUserFn(dependencyRegistry);

    const review = await seedReviewFn({
      dependencyRegistry,
      productId: product.id,
      userId: user.id,
    });

    console.log('productId <<>>', product.id);
    console.log('userId <<>>', user.id);
    console.log('reviewId <<>>', review.id);

    console.log('Done seeding database.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

(async (): Promise<void> => {
  const assumeYes = process.argv.length > 2 && process.argv[2] === '-y';
  const answer = assumeYes ? true : readlineSync.keyInYN('Seeding will erase ALL data in your database. Continue?');

  if (answer) {
    try {
      await seed();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
})();
