/* eslint-disable no-console */
import { MongodbUriParser } from 'mongodb-uri';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

declare module 'mongoose' {
  export let connectionString: string;
}

const getTestConnectionString = (connectionString: string, mongoUriParser?: MongodbUriParser): string => {
  const uriParser = mongoUriParser || new MongodbUriParser();
  const mongoUri = uriParser.parse(connectionString.endsWith('?') ? connectionString.slice(0, -1) : connectionString);

  mongoUri.database = uuid();
  console.debug('Using test database connection.');

  return uriParser.format(mongoUri);
};

/**
 * @param connectionString
 * ```typescript
 * // this must evaluate to true to support the use of a testing-oriented database:
 * process.env.MONGO_URL && process.env.NODE_ENV === 'test'
 * ```
 */
const createMongoose = (connectionString: string): mongoose.Mongoose => {
  const instance = new mongoose.Mongoose();

  instance.connectionString =
    process.env.MONGO_URL && process.env.NODE_ENV === 'test'
      ? getTestConnectionString(process.env.MONGO_URL, new MongodbUriParser())
      : connectionString;

  return instance;
};

/**
 * @param mongooseInstance Mongoose instance derived from the "mongoose" module.
 *
 */
const connect = (mongooseInstance: mongoose.Mongoose): Promise<mongoose.Mongoose> => {
  try {
    return mongooseInstance.connect(mongooseInstance.connectionString);
  } catch (err) {
    console.error(err);

    throw err;
  }
};

export { connect, createMongoose, getTestConnectionString };
