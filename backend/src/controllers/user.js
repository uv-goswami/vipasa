import { prismaClient } from "../lib/prisma";
export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });
        res.status(200).json({
            "message": "OK",
            user
        });
    }
    catch (error) {
        console.error("Error while fetching the user: ", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
export const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gender, industry, fatherName, dob } = req.body;
        const client = await prismaClient.clientProfile.update({
            where: { userId: userId },
            data: {
                gender: gender,
                industry: industry,
                fatherName: fatherName,
                dob: dob,
            },
            select: {
                userId: true,
                gender: true,
                industry: true,
                fatherName: true,
                dob: true
            }
        });
        return res.status(200).json({
            "message": "OK",
            client
        });
    }
    catch (error) {
        console.error("Error while Updating", error);
        res.status(500).json({
            error: "Internal Server error"
        });
    }
};
export const getStaffClients = async (req, res) => {
    try {
        const { page, limit, search } = res.locals.validatedQuery;
        const skip = (page - 1) * limit;
        const where = {
            role: "Client",
        };
        if (search && search.length > 0) {
            where.OR = [
                {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    phone: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    firstName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        const [clients, total] = await Promise.all([
            prismaClient.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    client: {
                        select: {
                            gender: true,
                            fatherName: true,
                            dob: true,
                            addressLine: true,
                            city: true,
                            state: true,
                            pincode: true,
                            clientType: true,
                            industry: true,
                            riskScore: true,
                            assignedStaffId: true,
                        },
                    },
                },
            }),
            prismaClient.user.count({
                where,
            }),
        ]);
        return res.status(200).json({
            message: "Client fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: clients,
        });
    }
    catch (error) {
        console.error("Error while fetching staff   slients", error);
        return res.status(500).json({
            error: "internal server error",
        });
    }
};
export const getStaffClientById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                error: "Client Id is required",
            });
        }
        const client = await prismaClient.user.findFirst({
            where: {
                id: id,
                role: "Client",
            },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                client: {
                    select: {
                        gender: true,
                        fatherName: true,
                        dob: true,
                        addressLine: true,
                        city: true,
                        state: true,
                        pincode: true,
                        aadharDocUrl: true,
                        panDocUrl: true,
                        taxId: true,
                        clientType: true,
                        industry: true,
                        riskScore: true,
                        assignedStaffId: true,
                    },
                },
            },
        });
        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }
        return res.status(200).json({
            message: "Client fetched successfully",
            data: client,
        });
    }
    catch (error) {
        console.error("Error while fetching staff client by id: ", error);
        return res.status(500).json({
            error: "Internal Server Errror",
        });
    }
};
