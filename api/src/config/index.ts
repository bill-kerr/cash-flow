import * as dotenv from "dotenv";

export function initConfig() {
  dotenv.config();

  try {
    if (
      !process.env.JWT_KEY ||
      !process.env.PG_USERNAME ||
      !process.env.PG_PASSWORD ||
      !process.env.PG_DB_NAME ||
      !process.env.PG_PORT ||
      !process.env.FIREBASE_DB_URL
    ) {
      throw new Error(
        "Please make sure all required environmental variables are defined in a .env file at the root of the project."
      );
    }
  } catch (err) {
    console.error(err);
    console.log("Server shutting down.");
    process.exit();
  }
}

initConfig();

const config = {
  port: process.env.PORT || "3333",
  nodeEnv: process.env.NODE_ENV || "development",

  jwtSecretKey: process.env.JWT_KEY,

  pgUsername: process.env.PG_USERNAME,
  pgPassword: process.env.PG_PASSWORD,
  pgPort: parseInt(process.env.PG_PORT!),
  pgDbName: process.env.PG_DB_NAME,

  firebaseDatabaseUrl: process.env.FIREBASE_DB_URL,
};

export default config;
