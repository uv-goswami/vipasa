import { Request, Response } from "express";
import { prismaClient } from "../lib/prisma"
import { Prisma } from "../../generated/prisma/client";

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

export const getStaffServices = async (req: Request, res:Response) => {
    try{
        const {page, limit, search, isActive} = res.locals.validatedQuery as {
            page: number,
            limit: number,
            search?: string,
            isActive?: "true" | "false"
        }

        const skip = (page-1)*limit;
        
        const where: Prisma.ServiceWhereInput = {

        }

        if (search && search.length >0){
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive"
                    },
                },
            ];
        }

        if(isActive){
            where.isActive = isActive === "true"
        }

        const [services, total] = await Promise.all([
            prismaClient.service.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    basePrice: true,
                    requiredDocs: true,
                    estimatedDays: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prismaClient.service.count({
                where,
            }),
        ]);


        return res.status(200).json({
            message: "Service fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: services,
        })



    }catch(error){
        console.error("Error in getStaffServices", error);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }


}

