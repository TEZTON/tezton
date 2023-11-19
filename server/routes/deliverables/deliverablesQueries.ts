import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  deliverablesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { deliverableIdAccessMiddleware } from "./acl";

const deliverableSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().nullable(),
});

export const deliverablesQueries = router({
  getDeliverables: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/functionality/{functionalityId}/deliverable",
      },
    })
    .input(
      z.object({
        functionalityId: z.string(),
      })
    )
    .output(z.array(deliverableSchema))
    .query(async ({ ctx: { db, user }, input: { functionalityId } }) => {
      const result = await db
        .select()
        .from(deliverablesSchema)
        .leftJoin(
          functionalitiesSchema,
          eq(functionalitiesSchema.id, deliverablesSchema.functionalityId)
        )
        .leftJoin(
          projectsSchema,
          eq(projectsSchema.id, functionalitiesSchema.projectId)
        )
        .leftJoin(
          productsSchema,
          eq(productsSchema.id, projectsSchema.productId)
        )
        .leftJoin(
          companiesSchema,
          eq(companiesSchema.id, productsSchema.companyId)
        )
        .where(
          and(
            eq(functionalitiesSchema.id, functionalityId),
            eq(companiesSchema.userId, user.id)
          )
        );

      return result.map(({ deliverables }) => deliverables);
    }),

  byId: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/functionality/{functionalityId}/deliverable/{deliverableId}",
      },
    })
    .input(
      z.object({
        functionalityId: z.string(),
        deliverableId: z.string(),
      })
    )
    .output(deliverableSchema)
    .use(deliverableIdAccessMiddleware)
    .query(
      async ({
        ctx: { db, user },
        input: { functionalityId, deliverableId },
      }) => {
        const result = await db
          .select()
          .from(deliverablesSchema)
          .leftJoin(
            functionalitiesSchema,
            eq(functionalitiesSchema.id, deliverablesSchema.functionalityId)
          )
          .leftJoin(
            projectsSchema,
            eq(projectsSchema.id, functionalitiesSchema.projectId)
          )
          .leftJoin(
            productsSchema,
            eq(productsSchema.id, projectsSchema.productId)
          )
          .leftJoin(
            companiesSchema,
            eq(companiesSchema.id, productsSchema.companyId)
          )
          .where(
            and(
              eq(deliverablesSchema.id, deliverableId),
              eq(functionalitiesSchema.id, functionalityId),
              eq(companiesSchema.userId, user.id)
            )
          );

        if (result.length !== 1) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return result[0].deliverables;
      }
    ),
});
