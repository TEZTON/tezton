import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { companiesSchema } from "../../schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  companyImageUrl: z.string().url().optional().nullable(),
  type: z.string(),
});

export const companyQueries = router({
  getAllCompanies: protectedProcedure
    .meta({
      openapi: { method: "GET", path: "/company" },
    })
    .input(z.void())
    .output(z.array(companySchema))
    .query(async ({ ctx: { db } }) => {
      // allow everybody to see all companies, however people will have to ask for permission to view the details of a especific company
      const companies = await db.select().from(companiesSchema);

      return companies;
    }),

  getMyCompanies: protectedProcedure
    .meta({
      openapi: { method: "GET", path: "/company/allowed" },
    })
    .input(z.void())
    .output(z.array(companySchema))
    .query(async ({ ctx: { db, user } }) => {
      const companies = await db
        .select()
        .from(companiesSchema)
        .where(eq(companiesSchema.userId, user.id));

      return companies;
    }),
  byId: protectedProcedure
    .meta({
      openapi: { method: "GET", path: "/company/{companyId}" },
    })
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .output(companySchema)
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
