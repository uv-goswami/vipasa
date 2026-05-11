import * as z from 'zod'

export const createApplicationSchema = z.object({
    name: z.string().min(3),
    clientId: z.uuid(),
    serviceId: z.uuid(),

    priority: z.enum(["Low", "Normal", "High", "Urgent"]).optional(),
    dueDate: z.coerce.date().optional(),

    description: z.string().optional(),
    internalNote: z.string().optional(),
    clientNote: z.string().optional(),

    metadata: z.record(z.string(), z.unknown()).optional()
})

export const updateApplicationStatusSchema = z.object({
    status: z.enum([
        "Draft",
        "PendingDocuments",
        "UnderReview",
        "Approved",
        "Rejected",
        "Completed"
    ])
})