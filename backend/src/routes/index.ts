import { Router } from "express";
import authRoutes from "./auth.js";
import healthRoutes from "./health.js";
import clientRouter from "./client/index.js"
import staffRouter from "./staff/index.js"

const rootRouter = Router()

rootRouter.use("/health", healthRoutes)
rootRouter.use("/auth", authRoutes);
rootRouter.use("/client", clientRouter)
rootRouter.use("/staff", staffRouter)
export default rootRouter;