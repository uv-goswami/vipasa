import {prismaClient} from "../src/lib/prisma"
import bcrypt from "bcrypt"

type DemoClientInput = {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName?: string;
    gender: "Male" | "Female";
    fatherName?: string;
    dob: Date;
    addressLine: string;
    city?: string;
    state?: string;
    pincode: string;
    clientType: "Individual" | "Corporate" | "Government";
    industry?: string;
    assignedStaffId: string;
}

async function seedDemoClient(input:DemoClientInput) {
    const passwordHash = await bcrypt.hash(input.password, 10)

    const clientProfileData = {
        gender: input.gender,
        fatherName: input.fatherName,
        dob: input.dob,
        addressLine: input.addressLine,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        clientType: input.clientType,
        industry: input.industry,
        assignedStaffId: input.assignedStaffId,
    };

    return prismaClient.user.upsert({
        where: {
            email: input.email,
        },
        update: {
            phone: input.phone,
            firstName: input.firstName,
            lastName: input.lastName,
            role: "Client",
            isActive: true,
            passwordHash,
            client: {
                upsert: {
                    update: clientProfileData,
                    create: clientProfileData
                },
            },
        },
        create: {
            email: input.email,
            phone: input.phone,
            firstName: input.firstName,
            lastName: input.lastName,
            role: "Client",
            isActive: true,
            passwordHash,
            client: {
                create: {
                    gender: input.gender,
                    fatherName: input.fatherName,
                    dob: input.dob,
                    addressLine: input.addressLine,
                    city: input.city,
                    state: input.state,
                    pincode: input.pincode,
                    clientType: input.clientType,
                    industry: input.industry,
                    assignedStaffId: input.assignedStaffId,
                },
            },
        },
    })
    
}

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
        create:{
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
            userId : adminUser.id,
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

  await seedDemoClient({
        email: "priya.sharma@example.com",
        phone: "9000000001",
        password: "Password123!",
        firstName: "Priya",
        lastName: "Sharma",
        gender: "Female",
        fatherName: "Rajesh Sharma",
        dob: new Date("1998-04-12"),
        addressLine: "House 21, Model Town",
        city: "Delhi",
        state: "Delhi",
        pincode: "110009",
        clientType: "Individual",
        industry: "IT Services",
        assignedStaffId: adminUser.id,
  });

  await seedDemoClient({
        email: "rohan.verma@example.com",
        phone: "9000000002",
        password: "Password123!",
        firstName: "Rohan",
        lastName: "Verma",
        gender: "Male",
        fatherName: "Suresh Verma",
        dob: new Date("1995-09-20"),
        addressLine: "Flat 12, Civil Lines",
        city: "Delhi",
        state: "Delhi",
        pincode: "110054",
        clientType: "Individual",
        industry: "Retail",
        assignedStaffId: adminUser.id,
    });

  console.log("Database seeded successfully.")
  console.log("Admin email: admin@vipasa.com")
  console.log("Admin password: Password123!")
  console.log("1. priya.sharma@example.com / Password123!")
  console.log("2. rohan.verma@example.com / Password123!")

    
}

main()
    .catch((error)=>{
        console.error("Seed failed:", error);
        process.exit(1)
    })
    .finally(async () => {
        await prismaClient.$disconnect()
    });