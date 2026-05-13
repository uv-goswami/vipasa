import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateData = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if(!result.success){
            return res.status(400).json({  
                message: "Validation Failed",
                error: z.treeifyError(result.error)
            })
        } 
        
        req.body = result.data;

        next();
        
    }
}

export const validateQuery = (schema: z.ZodTypeAny) => {
    return(req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)

        if(!result.success){
            return res.status(400).json({
                message: "Query Validation Failed",
                error: z.treeifyError(result.error)
            })
        }

        res.locals.validatedQuery = result.data;
        next();
    }
}