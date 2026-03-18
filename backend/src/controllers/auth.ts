import { Request, Response } from "express";
import { prismaClient } from "../lib/prisma"
import bcrypt from "bcrypt";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken"

export const registerClient = async (req: Request, res: Response) => {
    const {email, phone, password, firstName, lastName} = req.body;

    try{
    const user = await prismaClient.user.create({
        data:{
            firstName,
            email,
            phone,
            role: 'CLIENT',
            passwordHash: await bcrypt.hash(password,10),
            client:{
                create:{}
            }

        }
    })

    res.status(201).json({
        "status": "Created",
        "data": {
            "id": user.id
        }
    })

}catch (error){
    if (error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code === 'P2002'){
            return res.status(409).json({
                error: "Conflict",
                message: "A user with this email or phone already exists."
            })
        }
    }

    res.status(500).json({
        error: "Internal Server Error"
    })
}

}


//login

export const loginClient = async (req:Request, res:Response) => {
    const {email, password} = req.body;

    try{

        const user = await prismaClient.user.findUnique({where:{email}});   
        
        if(!user){
            res.status(401).json({
                error: "Unauthorized"
            })
            return;
        }
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if(!isMatch){
            res.status(401).json({
                error: "Unauthorized"
            });
            return;
        }

        
        const token = jwt.sign({
            id: user.id,
            role:user.role
        }, process.env.JWT_SECRET as string, {expiresIn: '60d'})

        res.status(200).json({
            "status": "OK",
            "data": {
                "jwt": token
            }
        })
    }catch(error){
        console.error("Login error:",error);
        res.status(500).json({
        error: "Internal Server Error"
        })

    }
}
