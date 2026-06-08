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
            where: { 
                id,
                staffId: (req as any).user.id
            }   
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


/* ----------------------------------------------------------------------------
We need to remove the below function, this function is used in staff/application.ts for now to getApplications,
-------------------------------------- */
export const getApplications = async (req:Request, res:Response) => {
    const user = (req as any).user as {
        id: string;
        role: "Admin" | "Staff" |"Client";
    };

    const rawPage = Number(req.query.page)
}

//--------------------------------------------------------------------------------

export const getMyApplications = async (req:Request, res:Response) => {
    const userId = (req as any).user.id;

    const {page, limit} = res.locals.validatedQuery as {
        page: number;
        limit: number;
    };

    const skip = (page-1)*limit;

    try{
        const [applications, total] = await Promise.all([
            prismaClient.application.findMany({
                where: {
                    clientId:userId,
                },
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    applicationNo: true,
                    status: true,
                    dueDate: true,
                    updatedAt: true,
                    description: true,
                    clientNote: true,
                    metadata: true,
                    service: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            basePrice: true,
                            requiredDocs: true,
                            estimatedDays: true,
                        },
                    },
                },

            }),

            prismaClient.application.count({
                where: {
                    clientId: userId,
                }
            }),

        ]);

        return res.status(200).json({
            message: "Application fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit),
            },
            data:applications,
        })           
    }catch (error){
        console.error("Error fetching client applications", error);

        return res.status(500).json({
            error: "Internal server Error"
        });
    }
}


export const getMyApplicationById = async (req:Request, res:Response) => {
    const userId = (req as any).user.id;
    const id = req.params.id as string;

    if(!id){
        return res.status(400).json({
            error: "Application Id is required"
        });
    };

    try{
        const application = await prismaClient.application.findFirst({
            where: {
                id,
                clientId: userId,
            },
            select:{
                id: true,
                name: true,
                applicationNo: true,
                status: true,
                dueDate: true,
                submittedAt: true,
                updatedAt: true,
                completedAt:true,
                description: true,
                clientNote: true,
                metadata: true,
                service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        basePrice: true,
                        requiredDocs: true,
                        estimatedDays: true,
                    },
                },

                documents: {
                    select: {
                        id: true,
                        name: true,
                        docUrl: true,
                        docType: true,
                        uploadedAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        if(!application){
            return res.status(404).json({
                message: "Appliaction not found",
            })
        }

        return res.status(200).json({
            message: "Application fetched successfully",
            data: application,
        })
    }catch(error){
        console.error("Error fetching client application", error);

        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export const getStaffClientApplications = async (req: Request, res: Response) => {
    try{
        const clientId = (req as any).params.id;
        
        const {page, limit, status} = res.locals.validatedQuery as {
            page: number;
            limit: number;
            status?: "Draft"|"PendingDocuments"| "UnderReview" | "Approved" | "Rejected" | "Completed";
        }

        if(!clientId){
            return res.status(400).json({
                error: "Client ID is required",
            })
        }

        const skip = (page - 1) * limit;

        const client = await prismaClient.user.findFirst({
            where: {
                id: clientId,
                role: "Client"
            },
            select: {
                id: true,
            }
        })

        if(!client){
            return res.status(404).json({
                error: "Client not found",
            })
        }

        const where: Prisma.ApplicationWhereInput = {
            clientId,
        }

        const [applications, total] = await Promise.all([
            prismaClient.application.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc"
                },
                select: {
                    id: true,
                    name: true,
                    applicationNo: true,
                    status: true,
                    priority: true,
                    dueDate: true,
                    submittedAt: true,
                    completedAt: true,
                    updatedAt: true,
                    description: true,
                    clientNote: true,
                    service: {
                        select: {
                            id: true,
                            name: true,
                            basePrice: true,
                            estimatedDays: true,
                        },
                    },
                    staff: {
                        select:{
                            user: {
                                select:{
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            }),
            prismaClient.application.count({
                where,
            }),
        ]);

        return res.status(200).json({
            message: "Client application fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit),
            },
            data: applications,
        });
    }catch(error){
        console.error("Error while fetching staff client applications", error)
        return res.status(500).json({
            error: "Internal Server Error",
        })
    }
        

}