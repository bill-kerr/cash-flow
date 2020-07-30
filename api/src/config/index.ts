import * as dotenv from "dotenv";

export function initConfig() {
  dotenv.config();

  try {
    if (
      !process.env.JWT_KEY ||
      !process.env.DB_USERNAME ||
      !process.env.DB_PASSWORD ||
      !process.env.DB_NAME ||
      !process.env.DB_PORT ||
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

  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: parseInt(process.env.DB_PORT!),
  dbName: process.env.DB_NAME,

  firebaseDatabaseUrl: process.env.FIREBASE_DB_URL,

  maxYears: process.env.MAX_YEARS || 25,
};

export default config;
