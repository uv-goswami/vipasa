import { Request, Response } from "express";
import { prismaClient } from "../lib/prisma"
import { Prisma } from "../../generated/prisma/Client";

export const createService = async (req: Request, res: Response) => {
    const {name, description, basePrice, requiredDocs, estimatedDays} = req.body;
    try{
        const service = await prismaClient.service.create({
            data:{
                name,
                description,
                basePrice,
                requiredDocs,
                estimatedDays,
            }
        })


        return res.status(201).json({
            message: "created",
            data: service
        })

    }catch (error: unknown){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                return res.status(409).json({
                    error: "Conflict",
                    message: "A service with this name already Exist" 
                })
            }
        }

        console.error("Service Creation Error: ", error)
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}