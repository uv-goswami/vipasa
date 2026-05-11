import {Request, Response} from "express"
import {prismaClient} from "../lib/prisma"

export const getMe = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user.id;
        const user = await prismaClient.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true
            }
        })

        res.status(200).json({
            "message": "OK",
            user
        })
    }catch (error){
        console.error("Error while fetching the user: ", error)
        res.status(500).json({
            error: "Internal Server Error"
        })
    }

}

export const updateMyProfile = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user.id;
        const {gender, industry, fatherName, dob} = req.body;

        const Client = await prismaClient.ClientProfile.update({
            where: {userId: userId},
            data:{
                gender: gender,
                industry: industry, 
                fatherName: fatherName,
                dob: dob,
            },
            select:{
                userId: true,
                gender: true,
                industry: true,
                fatherName: true,
                dob: true
            }
        })

        return res.status(200).json({
            "message": "OK",
            Client
        })

    }catch(error: unknown){
        console.error("Error while Updating", error);
        res.status(500).json({
            error: "Internal Server error"
        })

    }

}