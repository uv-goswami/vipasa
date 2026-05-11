import * as z from 'zod'

export const uploadDocumentSchema = z.object({
    name: z.string().optional(),
    applicationId: z.uuid().optional(),
    clientId: z.uuid().optional()
}).refine(data=> data.applicationId || data.clientId)
