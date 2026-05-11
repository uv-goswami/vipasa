import {Request, Response} from "express"
import {prismaClient} from "../lib/prisma"

export const uploadDocument = async (req : Request, res: Response) => {
    try{
        if(!req.file){
            return res.status(400).json({
                error: "No file uplaoded or Invalid Format"
            })
        }

        const {name, applicationId, clientId} = req.body;

        const fileUrl = (req.file as any). location || req.file.path;

        const newDocument = await prismaClient.document.create({
            data: {
                name: name || req.file.originalname,
                docUrl: fileUrl,
                docType: req.file.mimetype,
                applicationId: applicationId || null,
                clientId: clientId || null
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