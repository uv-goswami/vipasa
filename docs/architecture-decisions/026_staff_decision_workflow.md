# ADR-026: Staff Decision (Approve/Reject) Workflow

**Status:** Accepted
**Date:** 2026-08-11

## Context (The Problem)
Currently, staff can update an application's status via a generic PATCH endpoint. 
This is dangerous because:
1. Staff could change a "Draft" directly to "Completed" (skipping review).
2. If an application is "Rejected", there is no mandatory field for the reason (a legal/compliance requirement for financial consultancy).
3. The logic is scattered inside the controller, making it hard to reuse if an Admin dashboard is built later.

## Decision (What we are doing)
We will introduce a **Service Layer** (`ApplicationService`) to encapsulate the core business logic. 
The Controller will only handle HTTP requests/responses and delegate the heavy lifting to the Service.
We will enforce a **State Transition Map** to strictly define which statuses can move to which.

## Alternatives Considered
1. **Keep everything in the Controller**: Rejected because it violates Single Responsibility Principle. The controller would become bloated with `if/else` checks for status mapping, making it un-testable and hard to read.
2. **Use a third-party State Machine library (e.g., XState)**: Rejected because it introduces external complexity for a simple linear workflow. We don't need a heavy library for 6 statuses.

## Consequences
- We will have a new file: `src/services/applicationService.ts`.
- We will have a clear, central source of truth for valid status transitions.
- The `updateApplicationStatus` controller will become smaller and purely focused on HTTP.