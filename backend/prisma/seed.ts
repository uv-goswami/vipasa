import { prismaClient } from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "../generated/prisma/client";

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
};

/**
 * Seed a single client with user + client profile.
 * Uses a transaction to ensure both are created together.
 */
async function seedDemoClient(input: DemoClientInput) {
  const passwordHash = await bcrypt.hash(input.password, 10);

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

  return prismaClient.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: input.email },
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
            create: clientProfileData,
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
          create: clientProfileData,
        },
      },
    });
    return user;
  });
}

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Admin user + admin record + staff profile
  const adminUser = await prismaClient.user.upsert({
    where: { email: "admin@vipasa.com" },
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
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id },
  });

  await prismaClient.staffProfile.upsert({
    where: { userId: adminUser.id },
    update: {
      salary: 10000,
      skills: ["Admin", "Operations"],
      qualifications: "Admin",
    },
    create: {
      userId: adminUser.id,
      salary: 10000,
      skills: ["Admin", "Operations"],
      qualifications: "Admin",
    },
  });

  // 2. Regular staff user (non-admin)
  const staffPassword = await bcrypt.hash("Password123!", 10);
  const staffUser = await prismaClient.user.upsert({
    where: { email: "staff@vipasa.com" },
    update: {
      phone: "9999999999",
      firstName: "John",
      lastName: "Doe",
      role: "Staff",
      isActive: true,
      passwordHash: staffPassword,
    },
    create: {
      email: "staff@vipasa.com",
      phone: "9999999999",
      firstName: "John",
      lastName: "Doe",
      role: "Staff",
      isActive: true,
      passwordHash: staffPassword,
    },
  });

  await prismaClient.staffProfile.upsert({
    where: { userId: staffUser.id },
    update: {
      salary: 5000,
      skills: ["Client Handling", "Document Verification"],
      qualifications: "B.Com",
    },
    create: {
      userId: staffUser.id,
      salary: 5000,
      skills: ["Client Handling", "Document Verification"],
      qualifications: "B.Com",
    },
  });

  // 3. Services
  const servicesData = [
    {
      name: "ITR Filing",
      description: "Income Tax Return filing service",
      basePrice: 500,
      requiredDocs: ["PAN Card", "Aadhaar Card", "Bank Statement"],
      estimatedDays: 7,
      isActive: true,
    },
    {
      name: "GST Registration",
      description: "GST Registration for businesses",
      basePrice: 1500,
      requiredDocs: ["PAN Card", "Aadhaar Card", "Business Address Proof"],
      estimatedDays: 10,
      isActive: true,
    },
    {
      name: "Gold Loan",
      description: "Gold loan consultation and document processing.",
      basePrice: 1000,
      requiredDocs: ["Aadhaar Card", "PAN Card", "Gold Ownership Proof"],
      estimatedDays: 5,
      isActive: true,
    },
  ];

  for (const svc of servicesData) {
    await prismaClient.service.upsert({
      where: { name: svc.name },
      update: svc,
      create: svc,
    });
  }

  // 4. Demo clients
  const adminStaffId = adminUser.id; // assign both to admin

  const client1 = await seedDemoClient({
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
    assignedStaffId: adminStaffId,
  });

  const client2 = await seedDemoClient({
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
    assignedStaffId: adminStaffId,
  });

  // 5. (Optional) Create a few sample applications for testing
  const services = await prismaClient.service.findMany();
  const itrService = services.find(s => s.name === "ITR Filing");
  const gstService = services.find(s => s.name === "GST Registration");

  if (itrService && gstService) {
    // Application for Priya - Draft
    await prismaClient.application.upsert({
      where: { applicationNo: "VIPSA-DEMO-001" },
      update: {},
      create: {
        name: "ITR Filing for Priya",
        applicationNo: "VIPSA-DEMO-001",
        clientId: client1.id,
        serviceId: itrService.id,
        staffId: adminStaffId,
        status: "Draft",
        priority: "Normal",
        description: "Demo ITR application",
      },
    });

    // Application for Rohan - PendingDocuments (already submitted)
    await prismaClient.application.upsert({
      where: { applicationNo: "VIPSA-DEMO-002" },
      update: {},
      create: {
        name: "GST Registration for Rohan",
        applicationNo: "VIPSA-DEMO-002",
        clientId: client2.id,
        serviceId: gstService.id,
        staffId: adminStaffId,
        status: "PendingDocuments",
        priority: "High",
        submittedAt: new Date(),
        description: "Demo GST application",
      },
    });
  }

  console.log("✅ Database seeded successfully.");
  console.log("👤 Admin: admin@vipasa.com / Password123!");
  console.log("👤 Staff: staff@vipasa.com / Password123!");
  console.log("👤 Client1: priya.sharma@example.com / Password123!");
  console.log("👤 Client2: rohan.verma@example.com / Password123!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });