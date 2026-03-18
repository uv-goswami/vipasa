import {Router} from 'express'
import serviceRouter from './service'
import clientRouter from './client'

const staffRouter = Router();

staffRouter.use('/services', serviceRouter);
staffRouter.use('/clients', clientRouter)

export default staffRouter;