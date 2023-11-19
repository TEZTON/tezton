import { z } from "zod";

import { protectedProcedure, router } from "@/server";
import { companiesSchema, productsSchema } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { productIdAccessMiddleware } from "./acl";
import { SingleProductSchema, UpsertProductSchema } from "@/schema/product";

export const productMutations = router({
  createProduct: protectedProcedure
    .input(UpsertProductSchema)
    .output(z.string())
    .mutation(
      async ({
        ctx: { db, user },
        input: { name, description, companyId },
      }) => {
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(companiesSchema)
          .where(
            and(
              eq(companiesSchema.id, companyId),
              eq(companiesSchema.userId, user.id)
            )
          );

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Company: ${companyId} does not exist.`,
          });
        }

        const insert = await db
          .insert(productsSchema)
          .values({ name, description, companyId })
          .returning({ id: productsSchema.id });

        return insert[0].id;
      }
    ),

  updateProduct: protectedProcedure
    .input(UpsertProductSchema.extend({ productId: z.string().uuid() }))
    .output(z.string())
    .use(productIdAccessMiddleware)
    .mutation(
      async ({
        ctx: { db },
        input: { name, description, companyId, productId },
      }) => {
        await db
          .update(productsSchema)
          .set({
            ...(name && { name }),
            ...(description && { description }),
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(
            and(
              eq(productsSchema.id, productId),
              eq(productsSchema.companyId, companyId)
            )
          );

        return "OK";
      }
    ),

  deleteProduct: protectedProcedure
    .input(SingleProductSchema)
    .output(z.string())
    .use(productIdAccessMiddleware)
    .mutation(async ({ ctx: { db }, input: { companyId, productId } }) => {
      await db
        .delete(productsSchema)
        .where(
          and(
            eq(productsSchema.id, productId),
            eq(productsSchema.companyId, companyId)
          )
        );

      return "OK";
    }),
});
