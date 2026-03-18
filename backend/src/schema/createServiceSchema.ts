import * as z from "zod"

export const createServiceSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    basePrice: z.number().nonnegative(),
    requiredDocs: z.array(z.string()).optional(),
    estimatedDays: z.number().int().min(0).optional()
})