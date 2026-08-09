import {Request, Response} from "express"
import {prismaClient} from "../lib/prisma"

export const uploadDocument = async (req : Request, res: Response) => {
    try{
        if(!req.file){
            return res.status(400).json({
                error: "No file uplaoded or Invalid Format"
            })
        }

        const {name, applicationId} = req.body;
        const user = (req as any).user as {id:string, role:string};

        // We will only support applicationId for staff uploads
        if (!applicationId) {
            return res.status(400).json({ error: "applicationId is required" });
        }

        // Verify application exists and staff is assigned (if Staff)
        const application = await prismaClient.application.findUnique({
            where: { id: applicationId },
            select: { staffId: true },
        });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        if (user.role === "Staff" && application.staffId !== user.id) {
            return res.status(403).json({ error: "Forbidden - not assigned to this application" });
        }

        const fileUrl = (req.file as any). location || req.file.path;

        const newDocument = await prismaClient.document.create({
            data: {
                name: name || req.file.originalname,
                docUrl: fileUrl,
                docType: req.file.mimetype,
                applicationId: applicationId || null,
                clientId: null
            }
        })

        res.status(201).json({
            message: "Document uploaded successfullt",
            data: newDocument
        })

    }catch(error){
        console.error("Upload error:", error);
        res.status(500).json({
            error: "Internal Server Error During Upload"
        })
    }
}


export const uploadClientDocument = async (req: Request, res: Response) => {
const userId = (req as any).user.id;

if (!req.file) {
    return res.status(400).json({ error: "No file uploaded or invalid format" });
}

const { applicationId, name } = req.body;

if (!applicationId) {
    return res.status(400).json({ error: "applicationId is required" });
}

try {
    // Verify application exists and belongs to this client
    const application = await prismaClient.application.findUnique({
    where: { id: applicationId },
    select: { clientId: true, clientNote: true },
    });

    if (!application) {
    return res.status(404).json({ error: "Application not found" });
    }

    if (application.clientId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
    }

    const fileUrl = (req.file as any).location || req.file.path;

    // Create document
    const newDocument = await prismaClient.document.create({
    data: {
        name: name || req.file.originalname,
        docUrl: fileUrl,
        docType: req.file.mimetype,
        applicationId: applicationId,
        clientId: userId,
    },
    });

    // Append a note to the application's clientNote (so staff can see client activity)
    const note = `Client uploaded document: ${newDocument.name} at ${new Date().toLocaleString()}`;
    await prismaClient.application.update({
    where: { id: applicationId },
    data: {
        clientNote: application.clientNote
        ? `${application.clientNote}\n${note}`
        : note,
    },
    });

    return res.status(201).json({
    message: "Document uploaded successfully",
    data: newDocument,
    });
} catch (error) {
    console.error("Client document upload error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
}
};