import {Router} from 'express'
import {validateData} from '../../middlewares/validationMiddleware'
import {createApplication, updateApplicationStatus, getApplications} from '../../controllers/application'
import {createApplicationSchema, updateApplicationStatusSchema} from '../../schema/applicationSchema'

const applicationRouter:Router = Router();
applicationRouter.post('/', validateData(createApplicationSchema), createApplication)

applicationRouter.patch('/:id/status', validateData(updateApplicationStatusSchema), updateApplicationStatus)

applicationRouter.get('/', getApplications);

export default applicationRouter;