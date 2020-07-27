import "reflect-metadata";
import { createConnection } from "typeorm";
import config from "../config";

export async function initTypeOrm() {
  try {
    const connection = await createConnection({
      type: "postgres",
      host: "localhost",
      port: config.pgPort,
      username: config.pgUsername,
      password: config.pgPassword,
      database: config.pgDbName,
      entities: [],
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
