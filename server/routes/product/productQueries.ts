import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { companiesSchema, productsSchema } from "../../schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { productIdAccessMiddleware } from "./acl";

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().nullable(),
});

export const productQueries = router({
  getProducts: protectedProcedure
    .meta({
      openapi: { method: "GET", path: "/company/{companyId}/product" },
    })
    .input(z.object({ companyId: z.string() }))
    .output(z.array(productSchema))
    .query(async ({ ctx: { db, user }, input: { companyId } }) => {
      const result = await db
        .select()
        .from(productsSchema)
        .leftJoin(
          companiesSchema,
          eq(productsSchema.companyId, companiesSchema.id)
        )
        .where(
          and(
            eq(productsSchema.companyId, companyId),
            eq(companiesSchema.userId, user.id)
          )
        );

      return result.map(({ products }) => products);
    }),

  byId: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/company/{companyId}/product/{productId}",
      },
    })
    .input(
      z.object({
        companyId: z.string(),
        productId: z.string(),
      })
    )
    .output(productSchema)
    .use(productIdAccessMiddleware)
    .query(async ({ ctx: { db, user }, input: { companyId, productId } }) => {
      const result = await db
        .select()
        .from(productsSchema)
        .leftJoin(
          companiesSchema,
          eq(productsSchema.companyId, companiesSchema.id)
        )
        .where(
          and(
            eq(productsSchema.id, productId),
            eq(productsSchema.companyId, companyId),
            eq(companiesSchema.userId, user.id)
          )
        );

      if (result.length !== 1) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return result[0].products;
    }),
});
