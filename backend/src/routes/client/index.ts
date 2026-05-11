import{Router} from 'express'
import profileRouter from './profile'
import { requireRole } from "../../middlewares/roleMiddleware"
import { authMiddleware } from "../../middlewares/authMiddleware";


const clientRouter = Router();
clientRouter.use(authMiddleware, requireRole(['Client']))
clientRouter.use('/profile', profileRouter)

export default clientRouter;