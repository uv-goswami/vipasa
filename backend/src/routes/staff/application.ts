import {Router} from 'express'
import {validateData} from '../../middlewares/validationMiddleware'
import {createApplication} from '../../controllers/application'
import {createApplicationSchema} from '../../schema/applicationSchema'

const applicationRouter:Router = Router();
applicationRouter.post('/', validateData(createApplicationSchema), createApplication)

export default applicationRouter;