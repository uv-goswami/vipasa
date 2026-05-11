import {Request, Response } from "express";
import {prismaClient} from "../lib/prisma"
import {Prisma} from "../../generated/prisma/client"


export const createApplication = async (req: Request, res: Response) => {
    const {name, clientId, serviceId, priority, dueDate, description, internalNote, clientNote, metadata} = req.body;

    const staffId = (req as any).user?.id;


    
    try{

            /* 

                Here We will build the business logic to prevent double clicks for applicatuin creation


            */


        const applicationNo = `VIPSA-${Date.now()}`


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

export const updateApplicationStatus = async (req:Request, res: Response) => {
    const id = req.params.id as string;
    const {status} = req.body;
    
    if(!id){
        return res.status(400).json({
            error: "Application ID is required"
        })
    }
    try{
        const existingApplication = await prismaClient.application.findUnique({
            where: { id }   
        });

        if(!existingApplication){
            return res.status(404).json({
                error: "Application not Found"
            });
        }

        const updateData: any = {status};
        if(status === 'Completed'&& existingApplication.status !== 'Completed'){
            updateData.completedAt = new Date()
        }

        const updatedApplication = await prismaClient.application.update({
            where: {id},
            data: updateData
        });

        res.status(200).json({
            message: "Application status updated successfully",
            data: updatedApplication
        })


    }catch (error){
        console.error("Error updating application status", error);
        res.status(500).json({
            error: "Internal Server Error"
        })

    }
}