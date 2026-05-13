import { prismaClient } from "../src/lib/prisma";
import bcrypt from "bcrypt";
async function main() {
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const adminUser = await prismaClient.user.upsert({
        where: {
            email: "admin@vipasa.com",
        },
        update: {
            phone: "0000000000",
            firstName: "Super",
            lastName: "Admin",
            role: "Admin",
            isActive: true,
            passwordHash,
        },
        create: {
            email: "admin@vipasa.com",
            phone: "0000000000",
            firstName: "Super",
            lastName: "Admin",
            role: "Admin",
            isActive: true,
            passwordHash,
        },
    });
    await prismaClient.admin.upsert({
        where: {
            userId: adminUser.id,
        },
        update: {},
        create: {
            userId: adminUser.id,
        },
    });
    await prismaClient.staffProfile.upsert({
        where: {
            userId: adminUser.id,
        },
        update: {
            salary: 10000,
            skills: ["Admin", "Operations"],
            qualifications: "Admin"
        },
        create: {
            userId: adminUser.id,
            salary: 10000,
            skills: ["Admin", "Operations"],
            qualifications: "Admin"
        },
    });
    await prismaClient.service.upsert({
        where: {
            name: "ITR Filing",
        },
        update: {
            description: "Income Tax Return filing service",
            basePrice: 500,
            requiredDocs: ["PAN Card", "Aadhaar Card", "Bank Statement"],
            estimatedDays: 7,
            isActive: true,
        },
        create: {
            name: "ITR Filing",
            description: "Income Tax Return filing service",
            basePrice: 500,
            requiredDocs: ["PAN Card", "Aadhaar Card", "Bank Statement"],
            estimatedDays: 7,
            isActive: true,
        },
    });
    await prismaClient.service.upsert({
        where: {
            name: "GST Registration",
        },
        update: {
            description: "GST Registration for businesses",
            basePrice: 1500,
            requiredDocs: ["PAN Card", "Aadhaar Card", "Business Address Proof"],
            estimatedDays: 10,
            isActive: true,
        },
        create: {
            name: "GST Registration",
            description: "GST Registration for businesses",
            basePrice: 1500,
            requiredDocs: ["PAN Card", "Aadhaar Card", "Business Address Proof"],
            estimatedDays: 10,
            isActive: true,
        },
    });
    await prismaClient.service.upsert({
        where: {
            name: "Gold Loan",
        },
        update: {
            description: "Gold loan consultation and document processing.",
            basePrice: 1000,
            requiredDocs: ["Aadhaar Card", "PAN Card", "Gold Ownership Proof"],
            estimatedDays: 5,
            isActive: true,
        },
        create: {
            name: "Gold Loan",
            description: "Gold loan consultation and document processing.",
            basePrice: 1000,
            requiredDocs: ["Aadhaar Card", "PAN Card", "Gold Ownership Proof"],
            estimatedDays: 5,
            isActive: true,
        },
    });
    console.log("Database seeded successfully.");
    console.log("Admin email: admin@vipasa.com");
    console.log("Admin password: Password123!");
}
main()
    .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
})
    .finally(async () => {
    await prismaClient.$disconnect();
});
