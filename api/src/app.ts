import config from './config';
import { initializeApplication } from './loaders';

import RRule from 'rrule';

async function startApp() {
  const app = await initializeApplication();

  app.listen(config.port, () => {
    console.log(`Server running in ${ config.nodeEnv } mode and listening on port ${ config.port }.`)
  });

  return app;
}

const app = startApp();

export { app };