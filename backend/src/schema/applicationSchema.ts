import * as z from 'zod'
import {paginationQuerySchema} from "./paginationSchema"

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

export const staffClientApplicationsQuerySchema = paginationQuerySchema.extend({
    status: z.enum([
        "Draft",
        "PendingDocuments",
        "UnderReview",
        "Approved",
        "Rejected",
        "Completed"
    ]).optional(),

    search: z.string().trim().optional(),
    clientId: z.uuid().optional(),
    serviceId: z.uuid().optional(),
})


export const updateApplicationSchema = z.object({
  description: z.string().min(1).optional(),
  clientNote: z.string().min(1).optional(),
  internalNote: z.string().min(1).optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(["Low", "Normal", "High", "Urgent"]).optional(),
});
