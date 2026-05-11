import { Router } from "express";
import authRoutes from "./auth.js";
import healthRoutes from "./health.js";
import ClientRouter from "./Client/index.js"
import StaffRouter from "./Staff/index.js"

const rootRouter = Router()

rootRouter.use("/health", healthRoutes)
rootRouter.use("/auth", authRoutes);
rootRouter.use("/Client", ClientRouter)
rootRouter.use("/Staff", StaffRouter)

export default rootRouter;