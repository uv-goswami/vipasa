import {Request, Response } from "express";
import {prismaClient} from "../lib/prisma"
import {Prisma} from "../../generated/prisma/client"

export const createApplication = async (req: Request, res: Response) => {
    const {name, clientId, serviceId, priority, dueDate, description, internalNote, clientNote, metadata} = req.body;

    const staffId = (req as any).user?.id;

    const applicationNo = `VIPSA-${Date.now()}`

    try{
        const newApplication = await prismaClient.application.create({
            data: {
                name,
                applicationNo,
                clientId,
                serviceId,
                staffId,
                status: 'Draft',
                priority: priority || 'Normal',
                dueDate,
                description,
                internalNote,
                clientNote,
                metadata: metadata || {}
            },
            include:{
                client: {select: {user:{select: {firstName: true, lastName: true}}}},
                service: {select: {name: true, basePrice: true}}
            }
        })
        res.status(201).json({
            status: "created",
            data: newApplication
        })
    } catch(error: unknown){
        console.error("Error creating application", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2003'){
                    return res.status(404).json({
                        error: "Not Found",
                        message: "The Provided Client/Service does not exist int the database"
                    })
            }
        }
        res.status(500).json({error: "Internal server error"})
    }


} 