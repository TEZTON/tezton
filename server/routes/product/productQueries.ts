import { z } from "zod";
import { protectedProcedure, router } from "@/server";
import { companiesSchema, productsSchema } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { productIdAccessMiddleware } from "./acl";
import { ProductSchema, SingleProductSchema } from "@/schema/product";

export const productQueries = router({
  getProducts: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .output(z.array(ProductSchema))
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
    .input(SingleProductSchema)
    .output(ProductSchema)
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
