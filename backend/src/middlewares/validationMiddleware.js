import { z } from "zod";
export const validateData = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation Failed",
                error: z.treeifyError(result.error)
            });
        }
        req.body = result.data;
        next();
    };
};
export const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json({
                message: "Query Validation Failed",
                error: z.treeifyError(result.error)
            });
        }
        res.locals.validatedQuery = result.data;
        next();
    };
};
