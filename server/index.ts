import { TRPCError, initTRPC } from "@trpc/server";

import { Context } from "./context";

export const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next, ...rest }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
    ...rest,
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const mergeRouter = t.mergeRouters;
