import { FastifyInstance } from "fastify";
import { z } from "zod";
import knex from "../database";
import { randomUUID } from "node:crypto";
import { Resource, ResourceCollections } from "../http/resource";
import { Pagination } from "../http/pagination";
import { GetIdFromParams } from "../http/getIdFromParams";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const getUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      phone_number: z.string(),
    });
    const { name, email, phone_number } = getUserBodySchema.parse(request.body);
    const session_id = randomUUID();
    reply.cookie("session_id", session_id, {
      path: "/",
    });

    await knex("user").insert({
      id: randomUUID(),
      session_id,
      name,
      email,
      phone_number,
    });
    return reply.status(201).send();
  });
  app.get("/", async (request) => {
    const paginator = new Pagination();
    const { limit, pagesOffset, page } = paginator.getPaginationData(request);
    const users = await knex("user").select().limit(limit).offset(pagesOffset);
    const resource = new ResourceCollections(users, {
      paginationData: {
        limit,
        page,
      },
    });
    return resource;
  });

  app.get("/:id", async (request) => {
    const getId = new GetIdFromParams();
    const id = getId.getId(request);
    const user = await knex("user").select().where("id", id);
    const resource = new Resource(user);
    return resource;
  });

  app.delete("/:id", async (request) => {
    const getId = new GetIdFromParams();
    const id = getId.getId(request);
    await knex("user").where("id", id).del();
  });

  app.put("/:id", async (request) => {
    const getId = new GetIdFromParams();
    const id = getId.getId(request);
    const getUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      phone_number: z.string(),
    });
    const { name, email, phone_number } = getUserBodySchema.parse(request.body);
    await knex("user").where("id", id).update({
      id,
      name,
      email,
      phone_number,
    });
  });
}
