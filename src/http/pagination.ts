import { FastifyRequest } from "fastify";
import { z } from "zod";

export class Pagination {
  private createSchema(): z.ZodObject<{
    limits: z.ZodString;
    page: z.ZodString;
  }> {
    const getQuerySchema = z.object({
      limits: z.string(),
      page: z.string(),
    });
    return getQuerySchema;
  }

  private getPaginationQuery(request: FastifyRequest): {
    limits: string;
    page: string;
  } {
    const getQuerySchema = this.createSchema();
    const { limits, page } = getQuerySchema.parse(request.query);
    return { limits, page };
  }

  private trasnformPageInInt(page: string): {
    pagesOffset: number;
  } {
    let pagesOffset = parseInt(page);
    if (pagesOffset == 1) {
      pagesOffset = 0;
    } else {
      pagesOffset = (pagesOffset - 1) * 10;
    }
    return { pagesOffset };
  }

  getPaginationData(request: FastifyRequest): {
    limit: number;
    pagesOffset: number;
    page: string;
  } {
    const { limits, page } = this.getPaginationQuery(request);
    const limit = parseInt(limits);
    const { pagesOffset } = this.trasnformPageInInt(page);

    return { limit, pagesOffset, page };
  }
}
