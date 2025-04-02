import { FastifyInstance } from "fastify";
import { z } from "zod";
import { Resource, ResourceCollections } from "../http/resource";
import { randomUUID } from "node:crypto";
import knex from "../database";
import { Pagination } from "../http/pagination";
import { checkSessionIdExist } from "../middlewares/check-session-id-exist";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const createMealsSchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
      });
      const { name, description, isDiet } = createMealsSchema.parse(
        request.body
      );
      console.log(name, description);

      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        isDiet,
        session_id: request.user?.session_id,
      });

      return reply.status(201).send();
    }
  );

  app.get("/", { preHandler: [checkSessionIdExist] }, async (request) => {
    const paginator = new Pagination();
    const { limit, pagesOffset, page } = paginator.getPaginationData(request);
    const meals = await knex("meals")
      .select()
      .where("session_id", request.user?.session_id)
      .limit(limit)
      .offset(pagesOffset);
    const resource = new ResourceCollections(meals, {
      paginationData: { page, limit },
    });
    console.log(resource);
    return resource;
  });

  app.get("/:id", { preHandler: [checkSessionIdExist] }, async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getMealsParamsSchema.parse(request.params);
    const meals = await knex("meals")
      .select()
      .where({ id, session_id: request.user?.session_id })
      .first();
    const resource = new Resource(meals);
    return resource;
  });

  app.delete(
    "/:id",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      });
      const { id } = getMealsParamsSchema.parse(request.params);
      await knex("meals")
        .where({ id, session_id: request.user?.session_id })
        .del();
      return reply.status(204).send();
    }
  );

  app.put("/:id", { preHandler: [checkSessionIdExist] }, async (request) => {
    const updateMealsSchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    });
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getMealsParamsSchema.parse(request.params);
    const { name, description, isDiet } = updateMealsSchema.parse(request.body);
    console.log(id, name, description);
    const date = knex.fn.now();
    await knex("meals")
      .where({ id, session_id: request.user?.session_id })
      .update({
        id,
        name,
        description,
        isDiet,
        date,
      });
  });

  app.get(
    "/metricas",
    { preHandler: [checkSessionIdExist] },
    async (request) => {
      const totalMeals = await knex("meals")
        .where("session_id", request.user?.session_id)
        .orderBy("date");

      const totalMealsonDiet = await knex("meals").where({
        session_id: request.user?.session_id,
        isDiet: true,
      });
      const totalMealsOutDiet =
        totalMeals?.length - totalMealsonDiet?.length
          ? totalMeals?.length - totalMealsonDiet?.length
          : 0;

      function calculatorBestSequencieOnDiet(): number {
        let cont = 0;
        let bestSequencie = 0;
        totalMeals.forEach((meals) => {
          console.log(cont, bestSequencie);
          if (meals.isDiet) {
            cont += 1;
            if (cont > bestSequencie) {
              bestSequencie = cont;
            }
          } else {
            console.log(0);
            cont = 0;
          }
        });
        return bestSequencie;
      }

      const meals = {
        totalMeals: totalMeals?.length,
        totalMealsonDiet: totalMealsonDiet?.length,
        totalMealsOutDiet,
        bestSequencieOnDiet: calculatorBestSequencieOnDiet(),
      };

      const resource = new Resource(meals);
      return resource;
    }
  );
}
