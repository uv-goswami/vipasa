import {Router} from 'express'
import serviceRouter from './service'
import clientRouter from './client'
import applicationRouter from './application'
import {requireRole} from '../../middlewares/roleMiddleware'
import {authMiddleware} from '../../middlewares/authMiddleware'


const staffRouter = Router();
staffRouter.use(authMiddleware, requireRole(["Admin", "Staff"]))

staffRouter.use('/services', serviceRouter);
staffRouter.use('/clients', clientRouter)
staffRouter.use('/applications', applicationRouter)

export default staffRouter;