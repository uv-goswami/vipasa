import { prismaClient } from "../lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";
export const registerClient = async (req, res) => {
    const { email, phone, password, firstName, lastName, gender, industry, dob, fatherName, addressLine, city, state, pincode, clientType } = req.body;
    const currentStaffId = req.user?.id || null;
    try {
        const newClient = await prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                passwordHash: await bcrypt.hash(password, 10),
                role: 'Client',
                client: {
                    create: {
                        gender,
                        industry,
                        dob,
                        fatherName, addressLine, city,
                        state, pincode,
                        clientType,
                        assignedStaffId: currentStaffId
                    }
                }
            },
            select: { id: true, email: true, phone: true, client: false }
        });
        res.status(201).json({
            "status": "created",
            "data": newClient
        });
    }
    catch (error) {
        console.log("Error at onboardClient: ", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    error: "Conflict",
                    message: "A user with the same email or phone already exists"
                });
            }
        }
        res.status(500).json({
            error: "Internal Server Error   "
        });
    }
};
//login
export const loginClient = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        const checkCondition = email ? { email } : { phone };
        const user = await prismaClient.user.findUnique({ where: checkCondition });
        if (!user) {
            res.status(401).json({
                error: "Unauthorized"
            });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({
                error: "Unauthorized"
            });
            return;
        }
        const token = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            "status": "OK",
            "data": {
                "jwt": token
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
