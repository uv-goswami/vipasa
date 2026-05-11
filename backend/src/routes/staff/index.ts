import {Router} from 'express'
import serviceRouter from './service'
import ClientRouter from './Client'
import {requireRole} from '../../middlewares/roleMiddleware'
import {authMiddleware} from '../../middlewares/authMiddleware'

const StaffRouter = Router();
StaffRouter.use(authMiddleware, requireRole(["Admin", "Staff"]))

StaffRouter.use('/services', serviceRouter);
StaffRouter.use('/Clients', ClientRouter)

export default StaffRouter;