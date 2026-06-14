# Domain Concept: Client (Customer & Compliance)

## Purpose

The Client represents an external entity—whether an individual, a registered corporation, or a government body—that receives financial, legal, or tax services from VIPASA.

While the `User` concept handles the login credentials of the human at the keyboard, the `Client` concept handles the legal and regulatory identity of the customer. It is the "Master File" that holds all compliance data, financial risk assessments, and service histories.

## Core Concepts

A Client is composed of the following business records:
* **Legal Identity:** The official registered name and entity type.
* **Regulatory Identifiers:** Official government tracking numbers (e.g., PAN, GSTIN, CIN).
* **Contact & Locations:** Official communication channels and verified physical addresses.
* **Financial Context:** Verified bank accounts used for loan disbursals or tax refunds.
* **Compliance & Risk Logs:** Anti-Money Laundering (AML) status, credit scores, and risk brackets.
* **Consent Log:** Irrevocable, timestamped records of the client granting permission for data sharing or credit pulls.

## Client Types (Categorization)

The business rules and required documentation shift entirely based on the type of Client:

### 1. Individual
* **Definition:** A single human being acting on their own behalf.
* **Key Requirements:** Personal demographic data (Date of Birth, Father's Name), Personal Tax IDs, and personal residential status.

### 2. Corporate
* **Definition:** A registered business entity.
* **Key Requirements:** Corporate Tax IDs, Industry Type, Annual Turnover, and identification of Directors and Ultimate Beneficial Owners (UBO).
* **Exclusions:** Does not possess human traits like Gender or Date of Birth.

### 3. Government
* **Definition:** A state, municipal, or statutory body.
* **Key Requirements:** Department hierarchies, authorized liaison officers, and specific tax exemption certificates.

## Business Rules & Invariants

These rules are absolute and must be enforced to maintain legal compliance.

### Compliance & Verification Rules (KYC)
1. **The Verification Gate:** A Client cannot have a service application transition to "Approved" unless the Client's identity documents (KYC) are fully verified by Staff.
2. **The Consent Mandate:** System must not fetch, process, or share third-party credit or risk data without an explicit, logged consent record from the Client.
3. **Immutability of Verified Data:** Once a legal identifier (like a Tax ID) or a bank account is verified by Staff, it is locked. If the Client requests a change, their overall KYC status must instantly drop back to "Pending Verification."
4. **KYC Expiry & Re-verification:** KYC compliance is time-bound. Upon expiration, the Client's status automatically degrades to "KYC Expired", blocking the initiation of new financial services until re-verified by their RM.
5. **AML & High-Risk Gate:** If a Client is flagged during Anti-Money Laundering (AML) screening, they cannot conduct business until an Administrator manually overrides the flag.

### Operational & Assignment Rules
5. **Relationship Manager Assignment:** Every Client must be assigned to an active Staff member. A Client must never be left unmanaged.
6. **Orphan Prevention:** If a Staff member leaves the firm, all of their assigned Clients must be immediately reassigned to a new Staff member.
7. **Unique Legal Entity:** A specific Primary Tax ID can only be linked to one active Client across the entire system to prevent duplicate fraud.
8. **The Primary Stewardship Rule:8. ** A Client Profile is anchored to exactly one Primary Relationship Manager (RM). To maintain strict accountability, the RM (or an Administrator) is exclusively responsible for mutating the Client's core KYC and profile data. (Note: Collaboration on specific service Applications is handled separately via the Application workflow).

### Data Retention Rules
9. **The Financial Retention Mandate:** If a Client has at least one completed financial service or application on record, their Client file cannot be permanently erased. It may only be transitioned to an "Archived" state.
10. **Consent Immutability:** If a Client withdraws consent for data sharing, the historical record of their past consent is not deleted; a new "Withdrawn" event is simply added to their log.

## Relationships to Other Concepts

* **Client to User (Authorized Signatory):** A Client is linked to exactly one User. If the Client is an Individual, the User is that person. If the Client is Corporate, the User is the Authorized Signatory (e.g., the Director) logging in on behalf of the business.
* **Client to Staff:** A Client is managed by a Staff member (Relationship Manager).
* **Client to Application:** A Client owns multiple service Applications.
* **Client to Guarantor (Self-Referential):** In loan scenarios, a Client may require a Guarantor. The Guarantor must also exist as a verified Client in the VIPASA system. A client cannot act as their own gurantor.

## Allowed Lifecycle States

1. **Onboarding (Draft):** The Client has registered a login but has not provided mandatory legal details. They cannot apply for services.
2. **KYC Pending:** Documents and details have been submitted and are awaiting Staff verification.
3. **Active:** Fully verified and compliant. The Client can freely conduct business.
4. **KYC Expired:** Triggered automatically when periodic KYC renewal dates pass. Existing work continues, but new service requests are blocked until re-verified.
5. **High Risk / Restricted:** The Client has been flagged by risk algorithms or AML checks, triggering enhanced due diligence.
6. **Legal Hold:** Triggered by Administrators during a government or regulatory investigation. All actions on the Client and their applications are frozen to prevent tampering.
7. **Archived:** The business relationship has ended. Historical data is preserved, but no new actions can be taken.   