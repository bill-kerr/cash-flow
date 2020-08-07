import { createConnection, getConnection } from "typeorm";
import { Schedule, Exception } from "../src/entities";
import { initExpressApp } from "../src/loaders/express";
import { Application } from "express";
import request from "supertest";

afterEach(async () => {
  await Schedule.clear();
  await Exception.clear();
});

afterAll(async () => {
  getConnection().close();
});

export const initialize = async () => {
  await createConnection({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [Schedule, Exception],
    synchronize: true,
    logging: false,
    name: "default",
  });

  return initExpressApp();
};

export interface TestClient {
  get(url?: string, headers?: {}): Promise<request.Response>;
  post(body: any, url?: string, headers?: {}): Promise<request.Response>;
  put(body: any, url?: string, headers?: {}): Promise<request.Response>;
  delete(url?: string, headers?: {}): Promise<request.Response>;
}

export const makeClient = (baseUrl: string, defaultHeaders: {}, app: Application) => {
  const makeUrl = (url?: string) => (url ? baseUrl + url : baseUrl);
  const client: TestClient = {
    get: (url?: string, headers = defaultHeaders) => {
      return request(app).get(makeUrl(url)).set(headers).send();
    },
    post: (body: any, url?: string, headers = defaultHeaders) => {
      return request(app).post(makeUrl(url)).set(headers).send(body);
    },
    put: (body: any, url?: string, headers = defaultHeaders) => {
      return request(app).put(makeUrl(url)).set(headers).send(body);
    },
    delete: (url?: string, headers = defaultHeaders) => {
      return request(app).delete(makeUrl(url)).set(headers).send();
    },
  };
  return client;
};
