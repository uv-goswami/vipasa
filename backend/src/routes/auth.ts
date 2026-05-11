import { Router } from "express";
import {registerClient, loginClient} from "../controllers/auth";
import { publicRegistrationSchema, loginSchema } from "../schema/authSchema"
import {validateData} from "../middlewares/validationMiddleware"

const authRoutes:Router = Router();

authRoutes.post('/register', validateData(publicRegistrationSchema),registerClient);
authRoutes.post('/login',validateData(loginSchema), loginClient);


export default authRoutes;
