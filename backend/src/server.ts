import app from './app';
import { config } from './config';
import { initCache } from './utils/cache';

const port = Number(config.port);

const start = async () => {
  await initCache();
  app.listen(port, () => {
    console.log(`MovieMind API listening on port ${port}`);
  });
};

start();
