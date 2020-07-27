import config from "./config";
import { initializeApp } from "./loaders";

async function startApp() {
  const app = await initializeApp();

  app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode and listening on port ${config.port}.`);
  });

  return app;
}

const app = startApp();
export { app };
