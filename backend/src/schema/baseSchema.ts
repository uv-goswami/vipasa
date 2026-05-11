import * as z  from 'zod'

export const baseUserSchema = z.object({
    email: z.email(),
    phone: z.string().length(10),
    firstName: z.string().min(2),
    lastName: z.string().optional(),
})

export const baseClientProfileSchema = z.object({
    gender: z.enum(["Male", "Female"]),
    industry: z.string().optional(), 
    dob: z.coerce.date(),

    fatherName: z.string().optional(),

    addressLine: z.string(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string(),

    aadharDocUrl: z.url().optional(),
    panDocUrl: z.url().optional(),
    taxId: z.string().optional(),
    ClientType: z.enum(["Individual", "Corporate", "Government"]),
})