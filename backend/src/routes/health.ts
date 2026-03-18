import { Router } from "express";
import { checkHealth } from "../controllers/health";

const healthRoutes:Router = Router()

healthRoutes.get('/', checkHealth);


export default healthRoutes;