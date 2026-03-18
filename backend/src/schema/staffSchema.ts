import * as z from 'zod'

export const createClientByStaffSchema = z.object({
    phone: z.string().min(10).max(10),
    email: z.string(),
    firstName: z.string().min(3),
    lastName: z.string().optional(),
    password: z.string().min(6),
    gender: z.enum(["Male", "Female"]).optional()
})