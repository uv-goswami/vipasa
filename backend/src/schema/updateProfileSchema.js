import * as z from "zod";
export const updateProfileSchema = z.object({
    gender: z.enum(["Male", "Female"]).optional(),
    industry: z.string().min(2).optional(),
    fatherName: z.string().min(2).optional(),
    taxId: z.string().optional(),
    dob: z.coerce.date().optional()
});
