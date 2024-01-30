import { GraphQLScalarType, Kind } from 'graphql';

import { getDependencyRegistryInstance } from '../../../configuration/dependency-registry';
import { Review } from '../../../domain/entities/review';
import { CreateReviewArgs, ReviewProviderPort } from '../../../domain/providers/review.provider.port';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value): string {
    if (value instanceof Date) {
      return value.toISOString();
    }

    throw new Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value): Date {
    if (typeof value === 'string') {
      return new Date(value);
    }

    throw new Error('GraphQL Date Scalar parser expected a `string`');
  },
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    return null;
  },
});

const dependencyRegistry = getDependencyRegistryInstance();
const reviewProvider = dependencyRegistry.resolve<ReviewProviderPort>('ReviewProvider');

const reviewApiResolvers = {
  Date: dateScalar,
  Query: {
    getReviews: async (_: unknown, args: { input: Partial<Review> }): Promise<Review[]> => {
      const result = await reviewProvider.getReviews(args.input);

      return result;
    },
  },
  Mutation: {
    createReview: async (_: unknown, args: { input: CreateReviewArgs }): Promise<Review> => {
      const result = await reviewProvider.createReview(args.input);

      return result;
    },
  },
};

export default reviewApiResolvers;
