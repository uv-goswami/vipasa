import {Request, Response} from 'express'
import bcrypt from 'bcrypt'
import {prismaClient} from '../lib/prisma'
import {Prisma} from '../../generated/prisma/client'


export const onboardClient = async (req: Request, res:Response) =>{
    const {email, phone, password, firstName, lastName} = req.body;

    try{
        
        const newClient = await prismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                phone,
                passwordHash: await bcrypt.hash(password, 10),
                role: 'CLIENT',
                client: {
                    create: {}
                }
            },

            select: {id: true, email:true, phone: true, client: true}

        })

        res.status(201).json({
            "status": "created",
            "data": newClient
        })

    }catch (error){
        console.log("Error at onboardClient: ", error)

        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                return res.status(409).json({
                    error: "Conflict",
                    message: "A user with the same email or phone already exists"
                })
            }
        }

        res.status(500).json({
            error: "Internal Server Error   "
        })
    }
}