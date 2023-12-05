import { protectedProcedure, router } from "@/server";
import { usersSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { UserSchema } from "@/schema/users";
import { TRPCError } from "@trpc/server";

export const userQueries = router({
  myself: protectedProcedure
    .output(UserSchema)
    .query(async ({ ctx: { db, user } }) => {
      const result = await db
        .select()
        .from(usersSchema)
        .where(eq(usersSchema.id, user.id));

      if (result.length !== 1) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid user!",
        });
      }

      return result[0];
    }),
});
