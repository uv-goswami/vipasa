import{Router} from 'express'
import profileRouter from './profile'

const clientRouter = Router();
clientRouter.use('/profile', profileRouter)

export default clientRouter;