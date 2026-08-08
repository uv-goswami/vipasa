import {Router} from 'express'
import {validateData, validateQuery} from '../../middlewares/validationMiddleware'
import {createApplication, updateApplicationStatus, getStaffApplications, getStaffApplicationById, } from '../../controllers/application'
import {createApplicationSchema, updateApplicationStatusSchema, staffClientApplicationsQuerySchema} from '../../schema/applicationSchema'

const applicationRouter:Router = Router();
applicationRouter.post('/', validateData(createApplicationSchema), createApplication)

applicationRouter.patch('/:id/status', validateData(updateApplicationStatusSchema), updateApplicationStatus)

applicationRouter.get('/',validateQuery(staffClientApplicationsQuerySchema), getStaffApplications)

applicationRouter.get('/:id', getStaffApplicationById)


export default applicationRouter;