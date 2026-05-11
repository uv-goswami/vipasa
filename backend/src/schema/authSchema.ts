import * as z from 'zod'
import {baseUserSchema, baseClientProfileSchema} from './baseSchema'

export const publicRegistrationSchema = baseUserSchema
    .extend(baseClientProfileSchema.partial().shape)
    .extend({
        password: z.string().min(6)
    })


export const onboardClientSchema = baseUserSchema
    .extend(baseClientProfileSchema.shape)
    .extend({
        password: z.string().min(6)
    })

export const loginSchema = z.object({
    email: z.email().optional(),
    phone: z.string().length(10).optional(),
    password: z.string().min(6),
}).refine((data) => {
    return data.email !== undefined || data.phone !== undefined;
}, {
    message: "You must provide either an email or phone number.",
    path: ["email"]
})