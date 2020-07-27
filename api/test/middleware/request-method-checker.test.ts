import request from "supertest";
import { initExpressApp } from "../../src/loaders/express";

const app = initExpressApp();
const url = "/api/v1/schedules";
const headers = {
  Authorization: "Bearer sldjflk",
  "Content-Type": "application/json",
};

it("rejects unallowed request methods", async () => {
  const res = await request(app).propfind(url).set(headers).send();
  expect(res.status).toBe(405);
});

it("allows GET, POST, PUT, and DELETE requests", async () => {
  let res = await request(app).get(url).set(headers).send();
  expect(res.status).toBe(200);

  res = await request(app).post(url).set(headers).send({
    amount: 100,
    description: "test",
    frequency: "ONCE",
    startDate: "2020-05-01",
  });
  expect(res.status).toBe(201);
  const { id } = res.body;

  res = await request(app).put(`${url}/${id}`).set(headers).send({
    description: "new description",
  });
  expect(res.status).toBe(200);

  res = await request(app).delete(`${url}/${id}`).set(headers).send();
  expect(res.status).toBe(200);
});
