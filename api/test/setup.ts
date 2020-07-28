import { initExpressApp } from "../src/loaders/express";
import request from "supertest";
import { createConnection } from "typeorm";
import { Schedule, Exception } from "../src/entities";
jest.mock("firebase-admin");

beforeAll(async () => {
  console.clear();
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
});

beforeEach(async () => {
  await Schedule.delete({});
  await Exception.delete({});
});

afterAll(async () => {
  //await getConnection().close();
});

export const initApp = () => {
  return initExpressApp();
};

export const emptyMessage = (field: string) => {
  return `The ${field} field is required and should not be empty.`;
};

export const badTypeMessage = (field: string, contains: string) => {
  return `The ${field} field must contain ${contains}.`;
};

export const shouldNotBeEmptyMessage = (field: string, frequencySetTo: string) => {
  return `The ${field} field should not be empty if frequency is set to ${frequencySetTo}.`;
};

export const buildMakeRequest = (
  url: string,
  app = initExpressApp(),
  headers = {
    Authorization: "Bearer sldjflk",
    "Content-Type": "application/json",
  }
) => {
  return {
    makeRequest: async (body: {}) => {
      return request(app).post(url).set(headers).send(body);
    },
    url,
    headers,
  };
};
