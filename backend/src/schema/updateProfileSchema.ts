import * as z from "zod"

export const updateProfileSchema = z.object({
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    industry: z.string().min(2).optional(),
    fatherName: z.string().min(2).optional(),
    taxId: z.string().optional(),
    dob: z.coerce.date().optional()
})  