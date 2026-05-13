import { prismaClient } from "../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
export const createApplication = async (req, res) => {
    const { name, clientId, serviceId, priority, dueDate, description, internalNote, clientNote, metadata } = req.body;
    const staffId = req.user?.id;
    try {
        /*

            Here We will build the business logic to prevent double clicks for applicatuin creation


        */
        const applicationNo = `VIPSA-${Date.now()}`;
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
            include: {
                client: { select: { user: { select: { firstName: true, lastName: true } } } },
                service: { select: { name: true, basePrice: true } }
            }
        });
        res.status(201).json({
            status: "created",
            data: newApplication
        });
    }
    catch (error) {
        console.error("Error creating application", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                return res.status(404).json({
                    error: "Not Found",
                    message: "The Provided Client/Service does not exist int the database"
                });
            }
        }
        res.status(500).json({ error: "Internal server error" });
    }
};
export const updateApplicationStatus = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!id) {
        return res.status(400).json({
            error: "Application ID is required"
        });
    }
    try {
        const existingApplication = await prismaClient.application.findUnique({
            where: { id }
        });
        if (!existingApplication) {
            return res.status(404).json({
                error: "Application not Found"
            });
        }
        const updateData = { status };
        if (status === 'Completed' && existingApplication.status !== 'Completed') {
            updateData.completedAt = new Date();
        }
        const updatedApplication = await prismaClient.application.update({
            where: { id },
            data: updateData
        });
        res.status(200).json({
            message: "Application status updated successfully",
            data: updatedApplication
        });
    }
    catch (error) {
        console.error("Error updating application status", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
/* ----------------------------------------------------------------------------
We need to remove the below function, this function is used in staff/application.ts for now to getApplications,
-------------------------------------- */
export const getApplications = async (req, res) => {
    const user = req.user;
    const rawPage = Number(req.query.page);
};
//--------------------------------------------------------------------------------
export const getMyApplications = async (req, res) => {
    const userId = req.user.id;
    const { page, limit } = res.locals.validatedQuery;
    const skip = (page - 1) * limit;
    try {
        const [applications, total] = await Promise.all([
            prismaClient.application.findMany({
                where: {
                    clientId: userId,
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
                totalPages: Math.ceil(total / limit),
            },
            data: applications,
        });
    }
    catch (error) {
        console.error("Error fetching client applications", error);
        return res.status(500).json({
            error: "Internal server Error"
        });
    }
};
export const getMyApplicationById = async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            error: "Application Id is required"
        });
    }
    ;
    try {
        const application = await prismaClient.application.findFirst({
            where: {
                id,
                clientId: userId,
            },
            select: {
                id: true,
                name: true,
                applicationNo: true,
                status: true,
                dueDate: true,
                submittedAt: true,
                updatedAt: true,
                completedAt: true,
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
        if (!application) {
            return res.status(404).json({
                message: "Appliaction not found",
            });
        }
        return res.status(200).json({
            message: "Application fetched successfully",
            data: application,
        });
    }
    catch (error) {
        console.error("Error fetching client application", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
