import { FastifyReply, FastifyRequest } from "fastify";
import knex from "../database";

export async function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  let session_id = request.cookies.session_id;
  if (!session_id) {
    return reply.status(401).send({
      error: "Unauthorized.",
    });
  }

  const user = await knex("user").where("session_id", session_id).first();

  if (!user) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  request.user = user;
}
