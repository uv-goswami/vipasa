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

    addressLine: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),

    aadharDocUrl: z.url().optional(),
    panDocUrl: z.string().url().optional(),
    taxId: z.string().optional(),
    clientType: z.enum(["Individual", "Corporate", "Government"]),
    riskScore: z.number().optional(),
    assignedStaffId: z.uuid(),
})