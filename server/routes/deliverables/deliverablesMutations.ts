import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  deliverablesSchema,
  functionalitiesSchema,
  productsSchema,
  projectsSchema,
} from "../../schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { deliverableIdAccessMiddleware } from "./acl";

export const deliverablesMutations = router({
  createDeliverable: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/functionality/{functionalityId}/deliverable",
      },
    })
    .input(
      z.object({
        functionalityId: z.string(),
        name: z.string(),
        description: z.string().nullable().optional(),
      })
    )
    .output(z.string())
    .mutation(
      async ({
        ctx: { db, user },
        input: { name, description, functionalityId },
      }) => {
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(functionalitiesSchema)
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

        if (result.length !== 1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Functionality: ${functionalityId} does not exist.`,
          });
        }

        let r = await db
          .insert(deliverablesSchema)
          .values({ name, description, functionalityId })
          .returning({ id: deliverablesSchema.id });

        return r[0].id;
      }
    ),

  updateDeliverable: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/functionality/{functionalityId}/deliverable/{deliverableId}",
      },
    })
    .input(
      z.object({
        functionalityId: z.string(),
        deliverableId: z.string(),
        name: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
      })
    )
    .output(z.string())
    .use(deliverableIdAccessMiddleware)
    .mutation(
      async ({ ctx: { db }, input: { name, description, deliverableId } }) => {
        await db
          .update(deliverablesSchema)
          .set({
            ...(name && { name }),
            ...(description && { description }),
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(and(eq(deliverablesSchema.id, deliverableId)));

        return "OK";
      }
    ),

  deleteDeliverable: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/functionality/{functionalityId}/deliverable/{deliverableId}",
      },
    })
    .input(
      z.object({
        functionalityId: z.string(),
        deliverableId: z.string(),
      })
    )
    .output(z.string())
    .use(deliverableIdAccessMiddleware)
    .mutation(
      async ({ ctx: { db }, input: { deliverableId, functionalityId } }) => {
        await db
          .delete(deliverablesSchema)
          .where(
            and(
              eq(deliverablesSchema.id, deliverableId),
              eq(deliverablesSchema.functionalityId, functionalityId)
            )
          );

        return "OK";
      }
    ),
});
