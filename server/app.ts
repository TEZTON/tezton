import { router } from ".";
import { userRouter } from "./routes/users";
import { companyRouter } from "./routes/company";
import { productRouter } from "./routes/product";
import { projectRouter } from "./routes/project";
import { functionalityRouter } from "./routes/functionalities";
import { deliverableRouter } from "./routes/deliverables";
import { deliverableTypeRouter } from "./routes/deliverableTypes";
import { deliverablePhasesRouter } from "./routes/deliverablesPhases";
import { deliverableDiagramsRouter } from "./routes/deliverableDiagrams";

export const appRouter = router({
  users: userRouter,
  companies: companyRouter,
  products: productRouter,
  projects: projectRouter,
  functionalities: functionalityRouter,
  deliverables: deliverableRouter,
  deliverableTypes: deliverableTypeRouter,
  deliverablePhases: deliverablePhasesRouter,
  deliverableDiagrams: deliverableDiagramsRouter,
});

export type AppRouter = typeof appRouter;
