import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import {
  companiesSchema,
  productsSchema,
  requestAccessSchema,
} from "../../db/schema";
import { and, eq, or, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  CompanySchema,
  MyCompaniesSchema,
  MyCompaniesSchemaType,
} from "@/schema/company";

import { RequestAccessStatus } from "@/schema/requestAccess";
import { companyIdAccessMiddleware } from "./acl";

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
    .output(MyCompaniesSchema)

    .query(async ({ ctx: { db, user } }) => {
      const cids = await db
        .select({ companyId: requestAccessSchema.companyId })
        .from(requestAccessSchema)
        .where(
          and(
            eq(requestAccessSchema.userId, user.id),
            eq(requestAccessSchema.status, RequestAccessStatus.Enum.approved)
          )
        );
      const params =
        cids.length === 0
          ? eq(companiesSchema.userId, user.id)
          : or(
              eq(companiesSchema.userId, user.id),
              inArray(
                companiesSchema.id,
                cids.map(({ companyId }) => companyId)
              )
            );

      const result = await db
        .select()
        .from(companiesSchema)
        .leftJoin(
          productsSchema,
          eq(productsSchema.companyId, companiesSchema.id)
        )
        .where(params);

      const companies = result.reduce<MyCompaniesSchemaType>((acc, curr) => {
        const company = acc.find((c) => c.id === curr.companies.id);
        if (!company) {
          return acc.concat({
            ...curr.companies,
            products: curr.products ? [curr.products] : [],
          });
        }

        return acc.map((c) => {
          if (curr.products && c.id === curr.companies.id) {
            c.products.push(curr.products);
          }

          return c;
        });
      }, []);

      return companies;
    }),
  byId: protectedProcedure
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .output(CompanySchema)

    .use(companyIdAccessMiddleware)
    .query(async ({ ctx: { db }, input: { companyId } }) => {
      const companies = await db
        .select()
        .from(companiesSchema)
        .where(eq(companiesSchema.id, companyId));

      if (companies.length !== 1) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return companies[0];
    }),
});
