# Domain Concept: User (Identity & Access)

## Purpose

The User represents the foundational digital identity of every human being who accesses the system. 

It acts as the entry pint to the system. Its only purpose is to prove **who someone is** (Identity) and **what level of access they have** (System Role). It is completely decoupled from business-specific profiles, meaning it does not hold salary records, tax histories, or loan documents.

## Core Concepts

A User is defined by the following elements:
* **Identity:** A universally unique system identifier.
* **Contact Information:** The email address and mobile phone number used for login and security alerts.
* **Security Credentials:** The encrypted passphrase used to prove identity.
* **System Role:** The strict category of access granted to the human (Admin, Staff, or Client).
* **Account State:** Whether the human is currently allowed to log in (Active or Suspended).

## Business Rules & Invariants

These rules are absolute and govern how the system must treat human identities.

### Identity Rules
1. Every User must be uniquely identifiable. No two humans may share the same email address or mobile phone number across the entire system.
2. A User must provide at least one valid contact method (email or phone) to establish an identity.
3. A User must be assigned exactly one System Role at all times.
4. A User's identity is separate from their business data. A Client User holds the login details, but their tax history and loan applications belong to their associated Client Profile.

### Security & Access Rules
5. User credentials must be securely encrypted. Plain-text storage is strictly forbidden.
6. System access is strictly contingent on the User's Account State being "Active".
7. A User cannot modify or escalate their own System Role under any circumstances.
8. A User cannot view the security credentials of any other User, nor can they view their own encrypted credentials.
9. Security credentials can only be modified by the User themselves, or via a secure reset triggered by an Administrator.
10. Repeated authentication failures must result in a temporary security lockout to prevent unauthorized access.

### Data Retention & Auditing Rules
11. **The Preservation Mandate:** User records must never be permanently erased from the system. Because Users perform actions (like approving loans or uploading tax files), their identity must remain in the system forever to keep historical audit logs legally valid.
12. To revoke a User's access (e.g., when an employee leaves or a client is banned), the Account State must be transitioned to "Suspended".

## Roles & Responsibilities

Every User is categorized into one of three strict roles:

### 1. Administrator
* **Definition:** Firm owners and top-level system managers.
* **Scope:** Unrestricted system oversight. They manage Staff accounts, configure the services offered, and control global system settings.

### 2. Staff
* **Definition:** Operational employees processing business workflows.
* **Scope:** Restricted to managing their assigned Clients, verifying uploaded documents, and progressing applications through their lifecycles. They cannot create other Staff accounts.

### 3. Client
* **Definition:** External customers receiving financial, legal, or tax services.
* **Scope:** Strictly confined to viewing their own service applications, uploading their own required documents, and managing their own profile details. They cannot see other clients or internal company notes.

## Relationships to Other Concepts

* **User to Client Profile:** A User with the "Client" role is permanently linked to exactly one Client Profile, which acts as the container for their actual financial and tax data.
* **User to Staff Profile:** A User with the "Staff" role is permanently linked to exactly one Staff Profile, which holds their employment details (skills, joining date, assigned clients).
* **User to Audit Trail:** Every critical business action performed in the ERP must be permanently linked to the User who performed it to maintain a strict & clear records.

## Allowed Lifecycle States

1. **Active:** The User is permitted to log in and interact with the system within the boundaries of their Role.
2. **Suspended:** The User is barred from logging in. Their historical data is preserved, but all active access is revoked.