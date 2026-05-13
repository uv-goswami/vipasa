import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { createService } from "../../controllers/service";
import { requireRole } from "../../middlewares/roleMiddleware";
import { validateData } from "../../middlewares/validationMiddleware";
import { createServiceSchema } from "../../schema/createServiceSchema";
const serviceRouter = Router();
serviceRouter.post('/', authMiddleware, requireRole(['Admin', 'Staff']), validateData(createServiceSchema), createService);
export default serviceRouter;
