import request from 'supertest';
import { initExpressApp } from '../src/loaders/express';

const app = initExpressApp();
const url = '/api/v1/schedules';

it('rejects a request without an authorization header', async () => {
  const res = await request(app).post(url).set({
    'Content-Type': 'application/json'
  }).send({});
  expect(res.status).toBe(401);
  expect(res.body.errors[0].detail).toBe('User is not authorized to access this resource.');
});

it('rejects a request with an invalid authorization header', async () => {
  const res = await request(app).post(url).set({
    'Content-Type': 'application/json',
    'Authorization': 'slkjfdlskf'
  }).send({});
  expect(res.status).toBe(401);
  expect(res.body.errors[0].detail)
    .toBe('The Authorization header must be formatted as \'Bearer <token>\' where <token> is a valid auth key.');
});

it('accepts a request with a valid authorization header', async () => {
  const res = await request(app).get(url).set({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer slkjfdlskf'
  }).send();
  expect(res.status).toBe(200);
});