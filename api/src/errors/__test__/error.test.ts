import request from 'supertest';
import { initExpressApp } from '../../loaders/express';

const app = initExpressApp();
const url = '/api/v1/schedules';
const errorFormat = {
  object: 'list',
  statusCode: expect.any(Number),
  errors: expect.arrayContaining([{
    object: 'error-detail',
    title: expect.any(String),
    detail: expect.any(String)
  }])
}

it('rejects requests with incorrect content type', async () => {
  const res = await request(app)
    .post(url)
    .set({
      'Authorization': 'Bearer lsdjkf',
      'Content-Type': 'application/json+'
    })
    .send({})

  expect(res.status).toBe(415);
  expect(res.body).toEqual(errorFormat);
});

it('rejects requests with no Authorization header', async () => {
  const res = await request(app)
    .post(url)
    .send({})

  expect(res.status).toBe(401);
  expect(res.body).toEqual(errorFormat);
});

it('sends a 404 when a bogus url is entered', async () => {
  const res = await request(app)
  .post('/api/v1/this-is-bogus')
  .set({
    'Authorization': 'Bearer lsdjkf',
    'Content-Type': 'application/json'
  })
  .send({})

  expect(res.status).toBe(404);
  expect(res.body).toEqual(errorFormat);
});

it('rejects an invalid token', async () => {
  const res = await request(app)
  .post(url)
  .set({
    'Authorization': 'Bearer reject-me',
    'Content-Type': 'application/json'
  })
  .send({})

  expect(res.status).toBe(401);
  expect(res.body).toEqual(errorFormat);
});

it('rejects Authorization headers without Bearer prefixes', async () => {
  const res = await request(app)
  .post(url)
  .set({
    'Authorization': 'dsfsdfsdf',
    'Content-Type': 'application/json'
  })
  .send({})

  expect(res.status).toBe(401);
  expect(res.body).toEqual(errorFormat);
});

it('rejects request with a 400 if no data is supplied', async () => {
  const res = await request(app)
  .post(url)
  .set({
    'Authorization': 'Bearer dsfsdfsdf',
    'Content-Type': 'application/json'
  })
  .send({})

  expect(res.status).toBe(400);
  expect(res.body).toEqual(errorFormat);
});

it('rejects HTTP methods that are not allowed', async () => {
  const res = await request(app)
  .patch(url)
  .set({
    'Authorization': 'Bearer dsfsdfsdf',
    'Content-Type': 'application/json'
  })
  .send({})

  expect(res.status).toBe(405);
  expect(res.body).toEqual(errorFormat);
});