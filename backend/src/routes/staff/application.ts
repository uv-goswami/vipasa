import {Router} from 'express'
import {validateData, validateQuery} from '../../middlewares/validationMiddleware'
import {createApplication, updateApplicationStatus, getStaffApplications, getStaffApplicationById, updateApplication } from '../../controllers/application'
import {createApplicationSchema, updateApplicationStatusSchema, staffClientApplicationsQuerySchema, updateApplicationSchema} from '../../schema/applicationSchema'

const applicationRouter:Router = Router();
applicationRouter.post('/', validateData(createApplicationSchema), createApplication)

applicationRouter.patch('/:id/status', validateData(updateApplicationStatusSchema), updateApplicationStatus)

applicationRouter.get('/',validateQuery(staffClientApplicationsQuerySchema), getStaffApplications)

applicationRouter.get('/:id', getStaffApplicationById)

applicationRouter.patch('/:id', validateData(updateApplicationSchema),updateApplication)


export default applicationRouter;