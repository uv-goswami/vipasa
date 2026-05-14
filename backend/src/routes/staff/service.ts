import { Router } from "express";
import { createService, getStaffServices } from "../../controllers/service";
import { validateData, validateQuery } from "../../middlewares/validationMiddleware";
import { createServiceSchema } from "../../schema/createServiceSchema";
import { staffServiceQuerySchema} from "../../schema/paginationSchema"


const serviceRouter:Router = Router()
serviceRouter.get('/', validateQuery(staffServiceQuerySchema), getStaffServices )
serviceRouter.post('/',validateData(createServiceSchema),createService)

export default serviceRouter;   