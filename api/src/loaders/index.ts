import { initExpressApp } from './express';
import { initMongoose } from './mongoose';
import { initFirebase } from './firebase';

async function initializeApplication() {
  initFirebase();
  await initMongoose();
  return initExpressApp();
}

export { initializeApplication };