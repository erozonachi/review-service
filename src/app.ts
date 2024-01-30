import { Mongoose } from 'mongoose';
import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';

import reviewApiSchema from './application/api/schemas/review.schema';
import reviewApiResolvers from './application/api/resolvers/review.resolver';

type ExtendedFastifyInstance = FastifyInstance & {
  db?: Mongoose;
};

const createApp = async (database: Mongoose): Promise<ExtendedFastifyInstance> => {
  const app: FastifyInstance = fastify({
    logger: true,
    forceCloseConnections: true,
  });

  app.decorate('db', database);

  await app.register(cors, {});

  const apollo = new ApolloServer<BaseContext>({
    typeDefs: reviewApiSchema,
    resolvers: reviewApiResolvers,
    plugins: [fastifyApolloDrainPlugin(app)],
  });

  await apollo.start();

  // Register fastifyApollo
  await app.register(fastifyApollo(apollo));

  await app.ready();

  return app;
};

export default createApp;
export { ExtendedFastifyInstance };
