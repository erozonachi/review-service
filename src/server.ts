/* eslint-disable no-console */
import config from 'config-dug';
import 'reflect-metadata';
import { Mongoose } from 'mongoose';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import createApp, { ExtendedFastifyInstance } from './app';
import { getDependencyRegistryInstance } from './configuration/dependency-registry';
import { connect } from './configuration/db.config';

let app: ExtendedFastifyInstance;

const PORT = (config.PORT || 3000) as number;

const executeShutDownSequence = (): void => {
  try {
    setTimeout(() => {
      app.close(async () => {
        if (app.db) {
          app.db.connection
            .close()
            .then((): void => {
              return;
            })
            .catch((error: Error): void => console.error(error));
        }

        process.exit(0);
      });
    }, 1000);
  } catch (error) {
    console.error('Unhandled Rejection', error);
  }
};

(async (): Promise<void> => {
  const dependencyRegistry = getDependencyRegistryInstance();

  const dbMongoose = dependencyRegistry.resolve(Mongoose);

  const db = await connect(dbMongoose);

  app = await createApp(db);

  app.listen({ port: PORT }, (error, address): void => {
    if (error) {
      executeShutDownSequence();

      throw error;
    }

    console.log(`Server listening on ${address}`);
  });
})();
