import { Router } from "express";
import { getMe, updateMyProfile } from "../../controllers/user";
import { validateData } from "../../middlewares/validationMiddleware";
import { updateProfileSchema } from "../../schema/updateProfileSchema";


const profileRouter = Router()
profileRouter.get('/me', getMe)
profileRouter.patch('/update', validateData(updateProfileSchema), updateMyProfile)

export default profileRouter;