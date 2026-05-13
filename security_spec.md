# Security Specification - Aidly

## 1. Data Invariants
- **Identity Lock**: A document in `/users/{userId}` MUST have `userId` equal to the `request.auth.uid`.
- **Schema Integrity**: Every profile MUST contain `age`, `gender`, and `healthStatus`.
- **Validation Boundaries**:
    - `age`: Must be a string representing a number between 5 and 120. Length max 3.
    - `gender`: Must be one of `kisi`, `qadin`, `diger`. (Based on UI labels if possible, but I'll use common values or enforce string size).
    - `healthStatus`: String, max 2000 chars.

## 2. The "Dirty Dozen" (Red Team Payloads)
1. **Identity Spoof**: `auth.uid = "user_A"`, write to `/users/user_B`. (Expect: DENY)
2. **Ghost Field Injection**: Add `role: "admin"` to profile. (Expect: DENY via `affectedKeys().hasOnly()`)
3. **Age Poisoning**: `age: "999"` or `age: "abc"`. (Expect: DENY)
4. **Health Status Bloat**: `healthStatus` > 2000 chars. (Expect: DENY)
5. **Collection Scraping**: `list /users` as a standard user. (Expect: DENY)
6. **Orphan Search**: `get /users/non_existent_id` as non-owner. (Expect: DENY)
7. **Cross-Tenant Write**: Authenticated user trying to write to sensitive internal paths (if any).
8. **Null Payload**: Sending `null` for required fields. (Expect: DENY)
9. **Type Hijack**: `age: 25` (number instead of string). (Expect: DENY)
10. **ID Poisoning**: Document ID with malicious characters.
11. **Immutability Breach**: Attempting to change a field that should be fixed (e.g. `userId` if stored inside).
12. **Update Gap**: Changing `age` while injecting other fields.

## 3. Test Runner Scenarios
Verified in `firestore.rules.test.ts`.
- `test_unauthenticated_read_deny`
- `test_unauthenticated_write_deny`
- `test_authenticated_read_own_profile_allow`
- `test_authenticated_read_other_profile_deny`
- `test_authenticated_write_own_profile_allow`
- `test_authenticated_write_other_profile_deny`
- `test_schema_validation_failure`
