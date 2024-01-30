import { buildSchema } from 'graphql';

const reviewApiSchema = buildSchema(`#graphql
  scalar Date

  type Review {
    id: ID! ## ObjectId string
    productId: String! ## ObjectId string
    userId: String! ## ObjectId string
    rating: Int!
    description: String!
    createdAt: Date!
  }

  input CreateReviewInput {
    productId: String! ## ObjectId string
    userId: String! ## ObjectId string
    rating: Int!
    description: String!
  }

  input GetReviewsInput {
    id: ID
    productId: String
    userId: String
  }

  type Query {
    getReviews(input: GetReviewsInput!): [Review]!
  }

  type Mutation {
    createReview(input: CreateReviewInput!): Review!
  }
`);

export default reviewApiSchema;
