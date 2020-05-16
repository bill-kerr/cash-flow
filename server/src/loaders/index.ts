import { initExpressApp } from './express';
import { initMongoose } from './mongoose';

async function initializeApplication() {
  await initMongoose();
  return initExpressApp();
}

export { initializeApplication };