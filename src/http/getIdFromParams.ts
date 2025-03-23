import { FastifyRequest } from "fastify";
import { z } from "zod";

export class GetIdFromParams {
  private createSchema(): z.ZodObject<{
    id: z.ZodString;
  }> {
    const getParamsSchema = z.object({
      id: z.string().uuid(),
    });
    return getParamsSchema;
  }

  getId(request: FastifyRequest): string {
    const getParamsSchema = this.createSchema();
    const requestParams = getParamsSchema.parse(request.params);
    return requestParams.id;
  }
}
