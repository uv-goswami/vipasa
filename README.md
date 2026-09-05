# VIPASA Backend

> **VIPASA Group of Consultancy** — A backend management system for financial and legal consultancy services.

This is the server-side application for the VIPASA consultancy platform. It handles clients, staff, services, applications, document uploads, and a complete application lifecycle workflow.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

VIPASA is a consultancy that offers services like ITR filing, GST registration, gold loans, and more. This backend system allows staff to:

- Manage clients and their profiles
- Create and track applications for various services
- Upload and manage documents
- Review and approve/reject applications with decision reasons
- Allow clients to self‑serve (view their applications, submit documents, submit applications)

The system enforces a strict workflow (state machine) with role‑based access control (Admin, Staff, Client).

---

## Features

- **Authentication & Authorization** – JWT‑based login with role‑based permissions.
- **Client Management** – Staff can onboard clients with detailed profiles.
- **Service Catalogue** – Predefined services with prices and required document lists.
- **Application Lifecycle** – Create, submit, review, approve/reject, complete.
- **Document Management** – Upload files (PDF/images) with type/size restrictions.
- **Decision Tracking** – Store final decisions (Approved/Rejected) with reasons.
- **Optimistic Locking** – Prevent race conditions on status updates.
- **Search & Pagination** – Staff can search and filter applications/clients.
- **Fuzzy Search** – PostgreSQL trigram support for flexible name/description searches.

---

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **File Upload:** Multer (local disk storage)
- **Environment:** dotenv

---

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- A `.env` file (see [Environment Variables](#environment-variables))

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vipasa-backend.git
cd vipasa-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file (create one if not present) and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set:

```
DATABASE_URL="postgresql://user:password@localhost:5432/vipasa_db"
JWT_SECRET="your-super-secret-key"
PORT=3000
```

### 4. Set up the database

Make sure your PostgreSQL server is running.

Create the database (if not already created):

```bash
createdb vipasa_db
```

Push the Prisma schema to the database:

```bash
npx prisma db push
```

### 5. Seed the database (optional)

To populate the database with initial data (admin, staff, demo clients, services, and sample applications):

```bash
npm run seed
```

This creates:

- Admin: `admin@vipasa.com` / `Password123!`
- Staff: `staff@vipasa.com` / `Password123!`
- Clients: `priya.sharma@example.com` and `rohan.verma@example.com` (both with `Password123!`)
- Services: ITR Filing, GST Registration, Gold Loan
- Sample applications

### 6. Start the development server

```bash
npm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable      | Description                         | Example                                      |
|---------------|-------------------------------------|----------------------------------------------|
| `DATABASE_URL`| PostgreSQL connection string        | `postgresql://user:pass@localhost:5432/db`   |
| `JWT_SECRET`  | Secret key for signing JWT tokens   | `your-secret-key`                            |
| `PORT`        | Port the server listens on          | `3000`                                       |

---

## Database Setup

### Resetting the database

If you need to reset the schema (⚠️ **destroys all data**):

```bash
npx prisma db push --force-reset
```

### Seeding

```bash
npm run seed
```

### Prisma Studio (GUI)

```bash
npx prisma studio
```

---

## Running the Application

- **Development (with auto‑reload):**

```bash
npm run dev
```

- **Production build:**

```bash
npm run build
npm start
```

---

## API Overview

The API is organised under the `/api` prefix.

### Public Routes

| Method | Endpoint     | Description     |
|--------|--------------|-----------------|
| POST   | `/auth/login`| Login (returns JWT) |

### Protected Routes

All protected routes require a JWT token in the `Authorization: Bearer <token>` header.

#### Staff & Admin (`/staff`)

| Method | Endpoint                               | Description                                 |
|--------|----------------------------------------|---------------------------------------------|
| GET    | `/staff/clients`                       | List clients (paginated, searchable)        |
| GET    | `/staff/clients/:id`                   | Get client details                          |
| POST   | `/staff/clients/register`              | Create a new client                         |
| GET    | `/staff/applications`                  | List applications (filterable & paginated)  |
| GET    | `/staff/applications/:id`              | Get application details                     |
| POST   | `/staff/applications`                  | Create a new application                    |
| PATCH  | `/staff/applications/:id/status`       | Update status (with decision reason)        |
| PATCH  | `/staff/applications/:id`              | Update metadata (notes, priority, due date) |
| POST   | `/staff/documents`                     | Upload a document                           |

#### Client (`/client`)

| Method | Endpoint                              | Description                         |
|--------|---------------------------------------|-------------------------------------|
| GET    | `/client/profile`                     | Get own profile                     |
| PATCH  | `/client/profile/update`              | Update own profile                  |
| GET    | `/client/applications`                | List own applications               |
| GET    | `/client/applications/:id`            | Get own application details         |
| PATCH  | `/client/applications/:id/submit`     | Submit a draft application          |
| POST   | `/client/documents`                   | Upload a document for own app       |


---

## Project Structure

```
.
├── src/
│   ├── server.ts               # Entry point
│   ├── routes/                 # Route definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── health.ts
│   │   ├── client/             # Client routes
│   │   └── staff/              # Staff/Admin routes
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── middlewares/            # Auth, role, validation
│   ├── schema/                 # Zod schemas
│   ├── lib/                    # Utilities (Prisma, Multer)
│   ├── types/                  # Shared TypeScript types
│   └── scripts/                # Utility scripts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── uploads/                    # Uploaded files (ignored by git)
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```


---

## License

This project is licensed under the ISC License. See the [LICENSE](./LICENSE) file for details.

---

