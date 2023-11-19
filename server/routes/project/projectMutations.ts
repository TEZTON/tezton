import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  productsSchema,
  projectsSchema,
  usersSchema,
} from "../../schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { projectIdAccessMiddleware } from "./acl";
import { priorityTypeEnum } from "@/common/domainValidation";

export const projectMutations = router({
  createProject: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/product/{productId}/project",
      },
    })
    .input(
      z.object({
        productId: z.string(),
        name: z.string(),
        description: z.string().nullable().optional(),
        priority: priorityTypeEnum.optional().default("Low"),
      })
    )
    .output(z.string())
    .mutation(
      async ({
        ctx: { db, user },
        input: { name, description, productId, priority },
      }) => {
        // ACL Check
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(productsSchema)
          .leftJoin(
            companiesSchema,
            eq(companiesSchema.id, productsSchema.companyId)
          )
          .leftJoin(usersSchema, eq(usersSchema.id, companiesSchema.userId))
          .where(
            and(
              eq(companiesSchema.userId, user.id),
              eq(productsSchema.id, productId)
            )
          );

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product: ${productId} does not exist.`,
          });
        }

        let r = await db
          .insert(projectsSchema)
          .values({ name, priority, description, productId })
          .returning({ id: projectsSchema.id });

        return r[0].id;
      }
    ),

  updateProject: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/product/{productId}/project/{projectId}",
      },
    })
    .input(
      z.object({
        productId: z.string(),
        projectId: z.string(),
        name: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        priority: priorityTypeEnum.optional().nullable(),
      })
    )
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
    .meta({
      openapi: {
        method: "DELETE",
        path: "/product/{productId}/project/{projectId}",
      },
    })
    .input(
      z.object({
        productId: z.string(),
        projectId: z.string(),
      })
    )
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
