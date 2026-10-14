# Security Specification: Student Information & Health System

## 1. Data Invariants
1. Global Default-Deny: Any collection or document path not explicitly authorized is denied for all operations.
2. Auth Invariant: All read and write operations require authenticated users (`request.auth != null`).
3. Identity Invariant: For `students` document creation, `incoming().authorId` must strictly equal `request.auth.uid`.
4. Role Integrity: Users cannot elevate their own role to 'admin' in `users/{userId}`.
5. Admin Supremacy: Users whose UID exists in `/admins/{uid}` or match designated admin privileges can manage student records.
6. Volumetric Bound: All string fields must adhere strictly to length limits to prevent Denial-of-Wallet attacks. Document IDs must conform to `^[a-zA-Z0-9_\-]+$` and length <= 128.
7. Immutable Fields: `authorId` and `createdAt` cannot be modified during updates.

## 2. The Dirty Dozen Payloads (Targeting PERMISSION_DENIED)
1. **Unauthenticated Student Read**: Anonymous user attempts to read `/students/123`.
2. **Unauthenticated Student Create**: Anonymous user attempts to insert a student.
3. **Identity Spoofing on Create**: Authenticated user `alice` submits `authorId: 'bob'`.
4. **Junk ID Poisoning**: Document ID containing 500 characters or invalid characters like `../../hack`.
5. **Role Escalation in User Document**: Regular teacher attempts to set `role: 'admin'` or write to `/admins/{uid}`.
6. **Author ID Mutation during Update**: User attempts to change `authorId` on an existing student record.
7. **Cross-User Student Deletion**: User `carol` attempts to delete student created by `alice` (non-admin).
8. **Volumetric Overflow (Denial of Wallet)**: Injecting 2MB payload into `specialCharacteristics` or `lastName`.
9. **Shadow Fields Injection**: Creating student with injected ghost fields `isAdmin: true` or `bypassed: true`.
10. **Missing Required Fields**: Attempting to create student without required fields (`studentCode`, `lastName`, `firstName`, `gender`).
11. **Direct Admin Collection Write**: Non-admin attempting to add themselves into `/admins/{uid}`.
12. **Blanket Query Scraping**: Non-authenticated client running arbitrary collection queries.
