import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { initExpressApp } from '../src/loaders/express';
import request from 'supertest';
jest.mock('firebase-admin');

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const initApp = () => {
  return initExpressApp();
};

export const emptyMessage = (field: string) => {
  return `The ${ field } field is required and should not be empty.`;
};

export const badTypeMessage = (field: string, contains: string) => {
  return `The ${ field } field must contain ${ contains }.`;
};

export const shouldNotBeEmptyMessage = (field: string, frequencySetTo: string) => {
  return `The ${ field } field should not be empty if frequency is set to ${ frequencySetTo }.`;
};

export const buildMakeRequest = (
  url: string, 
  app = initExpressApp(), 
  headers = {
    'Authorization': 'Bearer sldjflk',
    'Content-Type': 'application/json'
  }
) => {
  return { 
    makeRequest: async (body: {}) => {
      return request(app)
        .post(url)
        .set(headers)
        .send(body);
    },
    url,
    headers
  };
};