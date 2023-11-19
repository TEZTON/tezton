import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  productsSchema,
  projectsSchema,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { projectIdAccessMiddleware } from "./acl";
import { ProjectSchema, SingleProjectSchema } from "@/schema/project";

export const projectQueries = router({
  getProjects: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/product/{productId}/project",
      },
    })
    .input(z.object({ productId: z.string() }))
    .output(z.array(ProjectSchema))
    .query(async ({ ctx: { db, user }, input: { productId } }) => {
      const result = await db
        .select()
        .from(projectsSchema)
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
            eq(productsSchema.id, productId),
            eq(companiesSchema.userId, user.id)
          )
        );

      return result.map(({ projects }) => projects);
    }),

  byId: protectedProcedure
    .input(SingleProjectSchema)
    .use(projectIdAccessMiddleware)
    .output(ProjectSchema)
    .query(async ({ ctx: { db, user }, input: { productId, projectId } }) => {
      const result = await db
        .select()
        .from(projectsSchema)
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
            eq(projectsSchema.id, projectId),
            eq(productsSchema.id, productId),
            eq(companiesSchema.userId, user.id)
          )
        );

      if (result.length !== 1) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return result[0].projects;
    }),
});
