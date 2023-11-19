import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { companiesSchema, productsSchema } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { CompanySchema } from "@/schema/company";
import { ProductSchema } from "@/schema/product";

export const companyQueries = router({
  getAllCompanies: protectedProcedure
    .input(z.void())
    .output(z.array(CompanySchema))
    .query(async ({ ctx: { db } }) => {
      // allow everybody to see all companies, however people will have to ask for permission to view the details of a especific company
      const companies = await db.select().from(companiesSchema);

      return companies;
    }),

  getMyCompanies: protectedProcedure
    .input(z.void())
    .output(z.array(CompanySchema.extend({ products: z.array(ProductSchema) })))
    .query(async ({ ctx: { db, user } }) => {
      const result = await db
        .select()
        .from(companiesSchema)
        .where(eq(companiesSchema.userId, user.id));

      const companies = await Promise.all(
        result.map(async (c) => {
          return {
            ...c,
            products: await db
              .select()
              .from(productsSchema)
              .where(eq(productsSchema.companyId, c.id)),
          };
        })
      );

      return companies;
    }),
  byId: protectedProcedure
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .output(CompanySchema)
    .query(async ({ ctx: { db, user }, input: { companyId } }) => {
      const companies = await db
        .select()
        .from(companiesSchema)
        .where(
          and(
            eq(companiesSchema.userId, user.id),
            eq(companiesSchema.id, companyId)
          )
        );

      if (companies.length !== 1) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return companies[0];
    }),
});
