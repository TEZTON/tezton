import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";

import { protectedProcedure, router } from "@/server";
import { companiesSchema } from "../../db/schema";
import { UpsertCompanySchema } from "@/schema/company";

export const companyMutations = router({
  createCompany: protectedProcedure
    .input(UpsertCompanySchema)
    .output(z.string())
    .mutation(async ({ ctx: { db, user }, input: { name, type } }) => {
      const result = await db
        .insert(companiesSchema)
        .values({ name, type, userId: user.id })
        .returning({ id: companiesSchema.id });

      return result[0].id;
    }),

  updateCompany: protectedProcedure
    .input(UpsertCompanySchema.extend({ companyId: z.string().uuid() }))
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
