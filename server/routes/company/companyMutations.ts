import { z } from "zod";

import { and, eq, sql } from "drizzle-orm";
import { protectedProcedure, router } from "@/server";
import { companyTypeEnum } from "@/common/domainValidation";

import { companiesSchema } from "../../schema";

export const companyMutations = router({
  createCompany: protectedProcedure
    .meta({
      openapi: { method: "POST", path: "/company" },
    })
    .input(
      z.object({
        name: z.string(),
        type: companyTypeEnum.optional().default("Consultoria"),
      })
    )
    .output(z.string())
    .mutation(async ({ ctx: { db, user }, input: { name, type } }) => {
      const result = await db
        .insert(companiesSchema)
        .values({ name, type, userId: user.id })
        .returning({ id: companiesSchema.id });

      return result[0].id;
    }),

  updateCompany: protectedProcedure
    .meta({
      openapi: { method: "PATCH", path: "/company/{companyId}" },
    })
    .input(
      z.object({
        companyId: z.string(),
        name: z.string().optional().nullable(),
        type: companyTypeEnum.optional().nullable(),
      })
    )
    .output(z.string())
    .mutation(
      async ({ ctx: { db, user }, input: { name, type, companyId } }) => {
        await db
          .update(companiesSchema)
          .set({
            ...(name && { name }),
            ...(type && { type }),
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(
            and(
              eq(companiesSchema.id, companyId),
              eq(companiesSchema.userId, user.id)
            )
          );

        return "OK";
      }
    ),

  deleteCompany: protectedProcedure
    .meta({
      openapi: { method: "DELETE", path: "/company/{companyId}" },
    })
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .output(z.string())
    .mutation(async ({ ctx: { db, user }, input: { companyId } }) => {
      await db
        .delete(companiesSchema)
        .where(
          and(
            eq(companiesSchema.id, companyId),
            eq(companiesSchema.userId, user.id)
          )
        );

      return "OK";
    }),
});
