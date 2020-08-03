import "reflect-metadata";
import { createConnection } from "typeorm";
import config from "../config";
import { Schedule, Exception } from "../entities";

export async function initTypeOrm() {
  if (config.nodeEnv === "test") {
    return testConnection();
  }

  try {
    const connection = await createConnection({
      type: "postgres",
      host: "localhost",
      port: config.dbPort,
      username: config.dbUsername,
      password: config.dbPassword,
      database: config.dbName,
      entities: [Schedule, Exception],
      synchronize: true,
      logging: false,
    });
    console.log("Connected to PostgreSQL database.");
    return connection;
  } catch (error) {
    console.error(error);
    console.log("Server shutting down.");
    process.exit();
  }
}

const testConnection = async () => {
  try {
    const connection = await createConnection({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [Schedule, Exception],
      synchronize: true,
      logging: false,
    });

    return connection;
  } catch (error) {
    console.error(error);
    console.log("Server shutting down.");
    process.exit();
  }
};
