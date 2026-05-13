import { Router } from "express";
import { getMyApplications, getMyApplicationById } from "../../controllers/application";
import { validateQuery } from "../../middlewares/validationMiddleware";
import { paginationQuerySchema } from "../../schema/paginationSchema";
const applicationRouter = Router();
applicationRouter.get('/', validateQuery(paginationQuerySchema), getMyApplications);
applicationRouter.get('/:id', getMyApplicationById);
export default applicationRouter;
