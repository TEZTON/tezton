import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  productsSchema,
  projectsSchema,
  usersSchema,
} from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { projectAccessMiddleware, projectIdAccessMiddleware } from "./acl";
import { SingleProjectSchema, UpsertProjectSchema } from "@/schema/project";

export const projectMutations = router({
  createProject: protectedProcedure
    .input(UpsertProjectSchema)
    .output(z.string())
    .use(projectAccessMiddleware)
    .mutation(
      async ({
        ctx: { db },
        input: { name, description, productId, priority },
      }) => {
        let r = await db
          .insert(projectsSchema)
          .values({ name, priority, description, productId })
          .returning({ id: projectsSchema.id });

        return r[0].id;
      }
    ),

  updateProject: protectedProcedure
    .input(UpsertProjectSchema.extend({ projectId: z.string().uuid() }))
    .output(z.string())
    .use(projectIdAccessMiddleware)
    .mutation(
      async ({
        ctx: { db },
        input: { name, description, productId, priority, projectId },
      }) => {
        await db
          .update(projectsSchema)
          .set({
            ...(name && { name }),
            ...(description && { description }),
            ...(priority && { priority }),
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(
            and(
              eq(projectsSchema.id, projectId),
              eq(projectsSchema.productId, productId)
            )
          );

        return "OK";
      }
    ),

  deleteProduct: protectedProcedure
    .input(SingleProjectSchema)
    .output(z.string())
    .use(projectIdAccessMiddleware)
    .mutation(async ({ ctx: { db }, input: { productId, projectId } }) => {
      await db
        .delete(projectsSchema)
        .where(
          and(
            eq(projectsSchema.id, projectId),
            eq(projectsSchema.productId, productId)
          )
        );

      return "OK";
    }),
});
