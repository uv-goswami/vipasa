import {Router} from 'express'
import {authMiddleware} from '../../middlewares/authMiddleware'
import {requireRole} from '../../middlewares/roleMiddleware'
import {validateData} from '../../middlewares/validationMiddleware'
import {onboardClient} from '../../controllers/staff'

const clientRouter:Router = Router();
clientRouter.post('/', authMiddleware, requireRole(["ADMIN", "STAFF"]), validateData(schema), onboardClient)


export default clientRouter;