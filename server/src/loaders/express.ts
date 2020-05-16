import express, { Application } from 'express';

function init(): Application {
  const app = express();

  return app;
}

export { init as initExpressApp };