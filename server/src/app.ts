import config from './config';
import { initializeApplication } from './loaders';

const app = initializeApplication();

app.listen(config.port, () => {
  console.log(`Server running in ${ config.nodeEnv } mode and listening on port ${ config.port }.`)
});
