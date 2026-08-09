import{Router} from 'express'
import profileRouter from './profile'
import { requireRole } from "../../middlewares/roleMiddleware"
import { authMiddleware } from "../../middlewares/authMiddleware";
import applicationRouter from "./application"
import documentRouter from "./document"


const clientRouter = Router();
clientRouter.use(authMiddleware, requireRole(['Client']))
clientRouter.use('/profile', profileRouter)
clientRouter.use('/applications', applicationRouter)
clientRouter.use('/documents', documentRouter)
export default clientRouter;