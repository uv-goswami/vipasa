import {Router} from 'express'
import {validateData} from '../../middlewares/validationMiddleware'
import {createApplication, updateApplicationStatus} from '../../controllers/application'
import {createApplicationSchema, updateApplicationStatusSchema} from '../../schema/applicationSchema'

const applicationRouter:Router = Router();
applicationRouter.post('/', validateData(createApplicationSchema), createApplication)

applicationRouter.patch('/:id/status', validateData(updateApplicationStatusSchema), updateApplicationStatus)

export default applicationRouter;