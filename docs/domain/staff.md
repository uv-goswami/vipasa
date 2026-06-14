# Domain Concept: Staff (Internal Operations & HR)

## Purpose

The Staff represents an internal employee, administrator, or contractor working within VIPASA. 

While the `User` concept handles the employee's login credentials, the `Staff` concept handles their operational capacity. It acts as the central hub for workload distribution, client relationship management, and internal accountability. It defines *what* the employee is authorized to do and *who* they are responsible for.

## Core Concepts

A Staff member is composed of the following business records:
* **Professional Identity:** Internal employee designations, departments, and operational roles (e.g., Senior Loan Officer, Junior Tax Consultant).
* **Operational Capacity:** The specific skills or qualifications they hold, which dictate what types of service applications they are legally or procedurally allowed to process.
* **Workload Portfolio:** The active list of Client accounts they manage and the specific service Applications they are currently processing.
* **Employment Status:** Their current standing with the firm (e.g., Active Employee, On Leave, Terminated).

## Business Rules & Invariants

These rules are absolute and govern internal operations to prevent fraud, bottlenecks, and orphaned clients.

### Operational & Assignment Rules
1. **The Orphan Prevention Mandate (Offboarding):** A Staff member cannot be transitioned to a "Suspended" or "Terminated" state if they currently have active Clients or pending Applications assigned to them. All active workloads must be formally reassigned to another Staff member before the offboarding process can complete.

2. **Qualification Gate:** Certain high-risk or highly specialized applications can only be assigned to Staff members who hold the corresponding verified qualification or designation in their profile.

3. **Isolated Write & Accountability:** A Staff member is strictly prohibited from mutating any entity unless they hold explicit, active assignment rights to that entity. Every state mutation must be permanently logged against the Staff member's identity to prevent deniability

4. **The Four-Eyes Principle (Maker-Checker):** For critical financial milestones, the Staff member who initiates or prepares a state change (The Maker) cannot be the same Staff member who authorizes or approves that change (The Checker).

5. **Delegation of Authority (DoA):** When a Staff member enters the "On Leave" state, the system must not allow their urgent workflows to stall. Their operational authority and active portfolio must be formally delegated to a designated peer or Manager for the duration of their absence.

6. **Qualification Revocation:** If a Staff member's professional qualification or license expires or is revoked by an Administrator, their ability to process Applications requiring that specific qualification is instantly suspended.



### Identity & Integrity Rules
7. **Single Source of Employment:** A Staff record cannot exist independently; it must be permanently anchored to exactly one internal `User` identity.
8. **The Cross-Contamination Ban:** A human being cannot simultaneously hold an active `Staff` record and an active `Client` record. If an employee requires VIPASA's services personally, it must be handled through a strictly defined exception workflow to prevent self-approval of financial services.

### Data Retention & Accountability Rules
9. **Immutable History:** If a Staff member has ever processed an application, verified a document, or managed a client, their Staff record can never be permanently erased. It must remain in the system forever to satisfy legal audit requirements and internal accountability.
10. **Action Attribution:** Every operational change made to a Client or Application must be permanently stamped with the identity of the Staff member who performed it.

## Relationships to Other Concepts

* **Staff to User (Identity):** A Staff record is linked to exactly one User. The User provides the login capability; the Staff record provides the operational clearance.
* **Staff to Client (Relationship Management):** A Staff member is assigned to manage multiple Clients. They act as the primary point of contact and are responsible for ensuring the Client's KYC remains compliant.
* **Staff to Application (Processing):** A Staff member is assigned to process multiple service requests. They are responsible for moving the application through its required legal and financial checkpoints.
* **Staff to Document (Verification):** Staff members act as the legal verifiers of documents uploaded by Clients.

## Allowed Lifecycle States

1. **Onboarding:** The employee is hired and their system identity is created, but they have not yet been assigned a department, qualifications, or operational clearance. They cannot be assigned to Clients.
2. **Active:** The employee is fully operational. They can be assigned to Clients, process Applications, and verify Documents.
3. **On Leave:** The employee is temporarily unavailable. The system must temporarily halt new automated assignments to this Staff member, but their existing portfolio remains intact.
4. **Suspended / Terminated:** The employee has left the firm. Their login access is permanently revoked via the `User` identity, and their Staff record is frozen. Historical actions remain visible for auditing. 