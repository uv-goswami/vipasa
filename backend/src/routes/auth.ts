import { Router } from "express";
import {registerClient, loginClient} from "../controllers/auth";
import { publicRegistrationSchema, loginSchema } from "../schema/authSchema"
import {validateData} from "../middlewares/validationMiddleware"
import {getMe} from "../controllers/user"
import {authMiddleware} from "../middlewares/authMiddleware"

const authRoutes:Router = Router();

authRoutes.get('/me', authMiddleware, getMe)
authRoutes.post('/register', validateData(publicRegistrationSchema),registerClient);
authRoutes.post('/login',validateData(loginSchema), loginClient);


export default authRoutes;
