import {Router} from 'express'
import serviceRouter from './service'
import clientRouter from './client'
import {requireRole} from '../../middlewares/roleMiddleware'
import {authMiddleware} from '../../middlewares/authMiddleware'

const staffRouter = Router();
staffRouter.use(authMiddleware, requireRole(["Admin", "Staff"]))

staffRouter.use('/services', serviceRouter);
staffRouter.use('/clients', clientRouter)

export default staffRouter;