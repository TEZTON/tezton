import { router } from ".";
import { userRouter } from "./routes/users";
import { companyRouter } from "./routes/company";
import { productRouter } from "./routes/product";
import { projectRouter } from "./routes/project";
import { functionalityRouter } from "./routes/functionalities";
import { deliverableRouter } from "./routes/deliverables";

export const appRouter = router({
  users: userRouter,
  companies: companyRouter,
  products: productRouter,
  projects: projectRouter,
  functionalities: functionalityRouter,
  delivrables: deliverableRouter,
});

export type AppRouter = typeof appRouter;
