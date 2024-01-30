module.exports = {
  mongodbMemoryServerOptions: {
    autoStart: false,
    instance: {
      dbName: 'test',
      storageEngine: 'wiredTiger',
    },
    binary: {
      version: process.env.MONGO_VERSION || 'latest',
    },
  },
};
