import {Router} from "express"
import {getMyApplications, getMyApplicationById, submitApplication} from "../../controllers/application"
import {validateQuery} from "../../middlewares/validationMiddleware"
import {paginationQuerySchema} from "../../schema/paginationSchema"

const  applicationRouter: Router = Router()

applicationRouter.get('/', validateQuery(paginationQuerySchema), getMyApplications)
applicationRouter.get('/:id',getMyApplicationById )

applicationRouter.patch('/:id/submit', submitApplication)

export default applicationRouter;
        