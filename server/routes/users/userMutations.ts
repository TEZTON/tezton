import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { publicProcedure, router } from "@/server";
import { usersSchema } from "../../db/schema";
import { CreateUserSchema } from "@/schema/users";

export const userMutations = router({
  createUser: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/user" },
    })
    .input(CreateUserSchema)
    .output(z.string())
    .mutation(
      async ({
        ctx: { db, auth },
        input: { email, firstName, lastName, password },
      }) => {
        const { uid } = await auth
          .createUser({
            displayName: `${firstName} ${lastName}`,
            email,
            password,
          })
          .catch((e) => {
            console.error(e);
            if (
              (e as unknown as any).errorInfo?.code ===
              "auth/email-already-exists"
            ) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "This email address is taken.",
              });
            }

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something went wrong. Please try again later.",
            });
          });

        await db
          .insert(usersSchema)
          .values({ email, firstName, lastName, id: uid })
          .catch((err) => {
            if (err.message?.includes("SQLITE_CONSTRAINT_UNIQUE")) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "This email address is taken.",
              });
            }
          });

        return "OK";
      }
    ),
});
