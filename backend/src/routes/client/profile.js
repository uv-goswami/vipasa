import { Router } from "express";
import { updateMyProfile } from "../../controllers/user";
import { validateData } from "../../middlewares/validationMiddleware";
import { updateProfileSchema } from "../../schema/updateProfileSchema";
const profileRouter = Router();
profileRouter.patch('/update', validateData(updateProfileSchema), updateMyProfile);
export default profileRouter;
