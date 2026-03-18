import { Router } from "express";
import {registerClient, loginClient} from "../controllers/auth";



const authRoutes:Router = Router();

authRoutes.post('/register', registerClient)
authRoutes.post('/login', loginClient)


export default authRoutes
