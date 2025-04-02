import { beforeAll, afterAll, describe, it, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";

describe("Meals routes", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("knex migrate:rollback --all");
    execSync("knex migrate:latest");
  });

  it("should be able to create a new meal", async () => {
    const responseUsers = await request(app.server)
      .post("/users")
      .send({ name: "Augusto", email: "Augusto", phone_number: "2154864545" })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .send({
        name: "Teste",
        description: "teste",
        isDiet: true,
      })
      .expect(201);
  });

  it("should be able to read the meals", async () => {
    const responseUsers = await request(app.server)
      .post("/users")
      .send({ name: "Augusto", email: "Augusto", phone_number: "2154864545" })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .send({
        name: "Teste",
        description: "teste",
        isDiet: true,
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .send({
        name: "Teste1",
        description: "teste1",
        isDiet: true,
      })
      .expect(201);

    const page = "1";
    const limits = "10";

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .query({ page, limits })
      .expect(200);

    console.log(mealsResponse.body.data);
    expect(mealsResponse.body.data).toHaveLength(2);
    expect(mealsResponse.body.data[0].name).toBe("Teste");
    expect(mealsResponse.body.data[1].name).toBe("Teste1");
  });
  it("Should be able to get a specifc meal", async () => {
    const responseUsers = await request(app.server)
      .post("/users")
      .send({ name: "Augusto", email: "Augusto", phone_number: "2154864545" })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .send({
        name: "Teste",
        description: "teste",
        isDiet: true,
        session_id: responseUsers.get("Set-Cookie"),
      })
      .expect(201);
    const page = "1";
    const limits = "10";

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .query({ page, limits })
      .expect(200);

    const id = mealsResponse.body.data[0].id;
    const mealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .expect(200);
    console.log(mealResponse.body.data);
    expect(mealResponse.body).toEqual({
      data: expect.objectContaining({
        name: "Teste",
        description: "teste",
        isDiet: 1,
      }),
    });
  });

  it("Should be able to delete a specifc meal", async () => {
    const responseUsers = await request(app.server)
      .post("/users")
      .send({ name: "Augusto", email: "Augusto", phone_number: "2154864545" })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .send({
        name: "Teste",
        description: "teste",
        isDiet: true,
        session_id: responseUsers.get("Set-Cookie"),
      })
      .expect(201);
    const page = "1";
    const limits = "10";

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .query({ page, limits })
      .expect(200);

    const id = mealsResponse.body.data[0].id;
    await request(app.server)
      .delete(`/meals/${id}`)
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .expect(204);
  });
  it("Should be able to update a specifc meal", async () => {
    const responseUsers = await request(app.server)
      .post("/users")
      .send({ name: "Augusto", email: "Augusto", phone_number: "2154864545" })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .send({
        name: "Teste",
        description: "teste",
        isDiet: true,
        session_id: responseUsers.get("Set-Cookie"),
      })
      .expect(201);
    const page = "1";
    const limits = "10";

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .query({ page, limits })
      .expect(200);

    const id = mealsResponse.body.data[0].id;
    await request(app.server)
      .put(`/meals/${id}`)
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .send({
        name: "Teste1",
        description: "teste1",
        isDiet: true,
        session_id: responseUsers.get("Set-Cookie"),
      })
      .expect(200);

    const mealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .expect(200);
    console.log(mealResponse.body.data);
    expect(mealResponse.body).toEqual({
      data: expect.objectContaining({
        name: "Teste1",
        description: "teste1",
        isDiet: 1,
      }),
    });
  });

  it("should be able to get metricas", async () => {
    const responseUsers = await request(app.server)
      .post("/users")
      .send({ name: "Augusto", email: "Augusto", phone_number: "2154864545" })
      .expect(201);

    await request(app.server)
      .get("/meals/metricas")
      .set("Cookie", responseUsers.get("Set-Cookie"))
      .expect(200);
  });
});
