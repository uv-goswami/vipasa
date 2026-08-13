import {Prisma, Status} from "../../generated/prisma/client";
import {prismaClient} from "../lib/prisma"



export class ApplicationService{

    private static readonly ALLOWED_TRANSITIONS: Record<string, string[]> = {
        Draft: ["PendingDocuments", "UnderReview", "Rejected"],
        PendingDocuments: ["UnderReview", "Rejected"],
        UnderReview: ["Approved", "Rejected", "PendingDocuments"],
        Approved: ["Completed"],
        Rejected: ["Completed"],
        Completed: []
    }

    static async updateStatus(
        applicationId: string,
        newStatus: string,
        decisionReason: string,
        actorUserId: string | undefined,
        actorRole: string | undefined
    ){
        const application = await prismaClient.application.findUnique({
            where: {id:applicationId},
            select: {
                staffId: true,
                clientId: true,
                status: true,
                completedAt: true,
            },

        });

        if(!application){
            throw new Error("Application not found");
        }

        const currentStatus = application.status;

        if (actorRole == "Staff" && application.staffId !== actorUserId){
            throw new Error("Forbidden")
        }

        const allowedNextStates = ApplicationService.ALLOWED_TRANSITIONS[currentStatus]
        
        if (!allowedNextStates || !allowedNextStates.includes(newStatus)){
            throw new Error(
                `Invalid status transition from ${currentStatus} to ${newStatus }`
            );
        }

        if ((newStatus==="Approved" || newStatus === "Rejected") && !decisionReason){
            throw new Error("decisionReason is required")
        }


        const updateData: Prisma.ApplicationUpdateInput = {
            status: newStatus as Status,
        }

        if(newStatus === "Approved"){
            updateData.decision = "Approved";
            updateData.decisionReason = decisionReason;
            if(!application.completedAt){
                updateData.completedAt = new Date();
            }
        }else if(newStatus === "Rejected"){
            updateData.decision = "Rejected"
            updateData.decisionReason = decisionReason
            if(!application.completedAt){
                updateData.completedAt = new Date();
            }
        } else {
            updateData.decision = null
            updateData.decisionReason = null
        }

        try{


            const updatedApplication = await prismaClient.application.update({
                where: {
                    id: applicationId,
                    status: currentStatus            
                },
                data: updateData,
                select: {
                    id: true,
                    status: true,
                    decision: true,
                    decisionReason: true,
                    completedAt: true,
                    updatedAt: true,
                }
                
            })
            return updatedApplication
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
                throw new Error("Application Status Changed Concurrently. Try Again")
            }
        }
    }

}
