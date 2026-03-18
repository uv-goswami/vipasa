import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getMe, updateMyProfile } from "../../controllers/user";
import { validateData } from "../../middlewares/validationMiddleware";
import { updateProfileSchema } from "../../schema/updateProfileSchema";


const profileRouter = Router()
profileRouter.get('/me', authMiddleware, getMe)
profileRouter.patch('/', authMiddleware, validateData(updateProfileSchema), updateMyProfile)

export default profileRouter;