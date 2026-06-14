---
date: 2026-06-14
version: 0.1.0
status: In Progress (45-50% complete)
deadline: 2026-06-15
---

# MAGPIE Server Email Security Hardening Workflow

## 1. Strategic Overview

### Objective

Implement dual-column email privacy strategy across entire MAGPIE Server authentication pipeline to eliminate plaintext email storage and ensure:

- **Confidentiality**: All stored emails encrypted via AES-256-GCM
- **Lookups without decryption**: Deterministic HMAC-SHA256 hashing enables querying without decryption
- **Compliance**: Production-ready security posture for authentication system

### Security Model

```text
Plaintext Email Input
    ↓
    ├─→ Hash via HMAC-SHA256 → email_hash (UNIQUE index for lookups)
    └─→ Encrypt via AES-256-GCM → email_encrypted (confidential storage)
    
Database Storage (Post-Migration):
    - email_hash: TEXT UNIQUE NOT NULL (lookup key, never decrypted)
    - email_encrypted: TEXT NOT NULL (confidential storage)
    - [DROP] email: TEXT (plaintext removal)
```

### GitHub Issues Under This Workflow

- **#33**: MISSION-33.1 (v0.40.0 prototype task list)
- **#43**: Issue 1.1 (password hashing verification) — ✅ VERIFIED
- **#42**: Issue 1.5 (hashKey reference) — ✅ VERIFIED
- **#36**: Issue 1.3 (encryptEmail typo) — ✅ VERIFIED
- **#37**: Issue 1.4 (decryptEmail bug) — ✅ FIXED
- **#34**: Issue 1.2 (timing-attack mitigation) — ✅ FIXED
- **#35**: Issue 1.6 (active user cache) — ✅ FIXED
- **#38**: Issue 1.7 (grace period enforcement) — ✅ VERIFIED
- **#53**: Issue 1.8 (private Socket.io rooms) — 🔴 BLOCKED (architecture)
- **#78**: Issue 1.9 (email confirmation rewrite) — 🔴 BLOCKED (schema + queries)
- **#75**: MISSION-33.1 aggregate (crypto integrity) — 🟡 62% COMPLETE

---

## 2. Cryptographic Primitives (Phase 1: ✅ COMPLETE)

### 2.1 Email Hashing

**Location**: `src/services/crypto.js` → `EmailSecurity.hashEmail(email)`

**Algorithm**: HMAC-SHA256

**Implementation**:

```javascript
hashEmail(email) {
    const hmac = crypto.createHmac('sha256', this.masterKey)
    return hmac.update(email.toLowerCase()).digest('hex')
}
```

**Properties**:

- ✅ Deterministic (same input = same output, always)
- ✅ Uses master key (from environment: CRYPTO_MASTER_KEY)
- ✅ Case-insensitive (email normalized to lowercase)
- ✅ Output: 64-character hex string
- ✅ Use case: Database lookups without decryption

**Status**: ✅ VERIFIED correct (Issue #42)

---

### 2.2 Email Encryption

**Location**: `src/services/crypto.js` → `EmailSecurity.encryptEmail(email)`

**Algorithm**: AES-256-GCM (authenticated encryption)

**Implementation**:

```javascript
encryptEmail(email) {
    const iv = crypto.randomBytes(12)  // 96-bit IV for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', this.masterKey, iv)
    let encrypted = cipher.update(email.toLowerCase(), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag().toString('hex')
    return `${iv.toString('hex')}:${authTag}:${encrypted}`
}
```

**Properties**:

- ✅ 12-byte (96-bit) IV for each encryption (random, never reused)
- ✅ Authentication tag prevents tampering
- ✅ Output format: `iv_hex:authTag_hex:encryptedData_hex`
- ✅ Master key sourced from environment variable
- ✅ Case-insensitive (email normalized to lowercase)

**Status**: ✅ VERIFIED correct (Issue #36, no "hec" typo)

---

### 2.3 Email Decryption

**Location**: `src/services/crypto.js` → `EmailSecurity.decryptEmail(blob)`

**Algorithm**: AES-256-GCM decryption with authentication verification

**Implementation**:

```javascript
decryptEmail(blob) {
    const parts = blob.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encrypted = parts[2]
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.masterKey, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
```

**Properties**:

- ✅ Parses blob format correctly (iv:authTag:encrypted)
- ✅ Verifies authentication tag (detects tampering)
- ✅ Reconstructs plaintext email
- ✅ Raises error if auth tag invalid

**Status**: ✅ FIXED (Issue #37 — user corrected variable assignment)

**Prior Bug**: Variables `iv` and `authTag` were swapped in initial implementation

---

### 2.4 Password Hashing

**Location**: `src/services/crypto.js` → `verifyPassword()`

**Algorithm**: crypto.scrypt (PBKDF alternative)

**Implementation** (verification):

```javascript
verifyPassword(password, storedHash) {
    const [saltHex, hashHex] = storedHash.split(':')
    const salt = Buffer.from(saltHex, 'hex')
    const stored = Buffer.from(hashHex, 'hex')
    
    const computed = crypto.scryptSync(password, salt, 32)
    
    // CRITICAL: Use crypto.timingSafeEqual() for constant-time comparison
    if (salt.length !== computed.length) throw new Error('Invalid salt')
    if (stored.length !== computed.length) throw new Error('Invalid hash')
    
    return crypto.timingSafeEqual(stored, computed)
}
```

**Properties**:

- ✅ 16-byte (128-bit) salt per password
- ✅ scrypt N=16384, r=8, p=1 (default Node.js parameters)
- ✅ 32-byte derived key
- ✅ **Timing-attack mitigation**: `crypto.timingSafeEqual()` for comparison
- ✅ Length validation before comparison (prevents shortcut errors)

**Status**: ✅ FIXED (Issue #34 — applied crypto.timingSafeEqual)

**Prior Vulnerability**: Used `===` comparison (vulnerable to timing attacks)

---

## 3. Database Schema Migration (Phase 2: ⏳ PENDING)

### 3.1 Migration Target

**Current Schema**:

```sql
CREATE TABLE players (
    playerID INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,  -- PLAINTEXT (REMOVE)
    -- ... other columns
)
```

**Target Schema**:

```sql
CREATE TABLE players (
    playerID INTEGER PRIMARY KEY,
    email_hash TEXT UNIQUE NOT NULL,      -- HMAC-SHA256 hex (lookup key)
    email_encrypted TEXT NOT NULL,         -- AES-256-GCM formatted blob
    -- ... other columns
)
```

### 3.2 Migration Strategy

**Step 1: Create GitHub Issue** (Prerequisite)

- Sub-issue of #33 (v0.40.0 prototype)
- Part of MISSION-33.1 (crypto integrity)
- Title: "[DATABASE] Schema migration: dual-column email privacy"
- Scope: ALTER TABLE players to add email_hash, email_encrypted; DROP email

**Step 2: Data Backfill** (Development Environment)

- Prototype in development: **wipe existing player data** (no production data to migrate)
- Initialize all future players with dual-column strategy from first registration
- No migration script needed; clean slate acceptable

**Step 3: Deploy Code Changes** (Integration)

- Cannot deploy authentication code changes until schema supports both columns
- Order: schema migration issue → code patches → integration → testing

**Status**: 🔴 BLOCKED (GitHub issue not yet created)

---

## 4. Database Query Functions (Phase 3: 🟡 PENDING PATCHES)

### 4.1 Bug: `getPlayerByEmail()` — Line 197

**Current (Buggy) Implementation**:

```javascript
getPlayerByEmail(email) {
    const emailHash = EmailSecurity.hashEmail(email)
    // BUG: Computes hash but queries plaintext column
    return this.prepare("SELECT * FROM players WHERE email = ?").get(email)
}
```

**Problem**:

- Computes `emailHash` but never uses it
- Queries plaintext `email` column which won't exist post-migration
- Return value: NULL (column doesn't exist)

**Required Fix**:

```javascript
getPlayerByEmail(email) {
    const emailHash = EmailSecurity.hashEmail(email)
    return this.prepare("SELECT * FROM players WHERE email_hash = ?").get(emailHash)
}
```

**Impact**:

- All account lookups by email will fail
- Blocking: password reset, email verification, account deletion
- Severity: **CRITICAL**

**File Location**: `src/database.js:197-202`

**Status**: 🟡 IDENTIFIED (awaiting approval to patch)

---

### 4.2 Bug: `loginPlayer()` — Line 281

**Current (Buggy) Implementation**:

```javascript
loginPlayer(email, password) {
    // BUG: Queries plaintext email column
    const player = this.prepare("SELECT * FROM players WHERE email = ?").get(email)
    if (!player) return null
    
    const verified = EmailSecurity.verifyPassword(password, player.password_hash)
    return verified ? player : null
}
```

**Problem**:

- Queries plaintext `email` column which won't exist post-migration
- Return value: NULL (query returns no rows)
- Blocks core authentication flow

**Required Fix**:

```javascript
loginPlayer(email, password) {
    const emailHash = EmailSecurity.hashEmail(email)
    const player = this.prepare("SELECT * FROM players WHERE email_hash = ?").get(emailHash)
    if (!player) return null
    
    const verified = EmailSecurity.verifyPassword(password, player.password_hash)
    return verified ? player : null
}
```

**Impact**:

- **LOGIN COMPLETELY BROKEN** post-migration
- All user authentication attempts will fail
- Severity: **CRITICAL**

**File Location**: `src/database.js:281-290`

**Status**: 🟡 IDENTIFIED (awaiting approval to patch)

---

### 4.3 Patch Application Plan

**Execution**: Use `multi_replace_string_in_file` to apply both patches atomically

**Patch 1 Target**:

- File: `src/database.js`
- Lines: 193-215 (context window includes function signature and usage)
- Replace: Full function body with corrected version

**Patch 2 Target**:

- File: `src/database.js`
- Lines: 275-310 (context window includes function signature and verification logic)
- Replace: Full function body with corrected version

**Status**: 🟡 READY (awaiting user approval)

---

## 5. Account Handler Integration (Phase 4: ⏳ IN PROGRESS)

### 5.1 Function Status Matrix

| Function | Current Status | Issue | Dependency | Action |
| ---------- | --- | --- | --- | --- |
| `verifyCredentials()` | ✅ Working | None | `db.loginPlayer()` | Verify after DB patches |
| `login()` | ⚠️ Partial | Emits plaintext email | Schema + DB fixes | Update payload post-migration |
| `joinPrivateRoom()` | 🔴 Broken | `player.ID` undefined | Architecture bug | Fix variable name + scope |
| `processEmailConfirmation()` | 🔴 Incomplete | Checks wrong token type | Schema + DB fixes | Full rewrite required |
| `requestPasswordReset()` | ⚠️ Partial | No email decryption | Schema + DB fixes | Add decryption before send |
| `relog()` | ⚠️ Partial | Emits plaintext email | Schema + DB fixes | Update payload post-migration |

**Dependency Graph**:

```text
Schema Migration (GitHub Issue)
    ↓
DB Query Patches (getPlayerByEmail, loginPlayer)
    ↓
    ├─→ Account Handler Updates
    │   ├─→ processEmailConfirmation() rewrite
    │   ├─→ login() payload update
    │   ├─→ relog() payload update
    │   └─→ requestPasswordReset() decryption
    │
    └─→ joinPrivateRoom() fixes (independent)
```

---

### 5.2 `processEmailConfirmation()` — Full Rewrite Required

**Location**: `handlers/account.js`

**Current Issues**:

1. Checks `isRecoveryToken` instead of `isRegistrationToken` (logic inverted)
2. No dual-column email strategy implementation
3. Creates player without email_hash or email_encrypted
4. Incomplete token validation

**Required Implementation**:

```javascript
processEmailConfirmation(registrationToken) {
    // 1. Validate token exists and is registration token
    if (!registrationToken || !registrationToken.isRegistrationToken) {
        return { success: false, error: "Invalid registration token" }
    }
    
    // 2. Hash and encrypt email for storage
    const emailHash = EmailSecurity.hashEmail(registrationToken.email)
    const emailEncrypted = EmailSecurity.encryptEmail(registrationToken.email)
    
    // 3. Check for existing player with same email_hash
    const existing = db.getPlayerByEmail(registrationToken.email)
    if (existing) {
        return { success: false, error: "Email already registered" }
    }
    
    // 4. Create new player with dual-column email strategy
    const newPlayer = {
        ...registrationToken.playerData,
        email_hash: emailHash,
        email_encrypted: emailEncrypted,
        verified: true
    }
    
    // 5. Persist to database
    db.createPlayer(newPlayer)
    
    // 6. Clean up token
    // ... token cleanup logic
    
    return { success: true, playerID: newPlayer.playerID }
}
```

**Key Patterns**:

- Use `EmailSecurity.hashEmail()` for lookup column
- Use `EmailSecurity.encryptEmail()` for storage column
- Never store plaintext email
- Always use `email_hash` for lookups

**Status**: 🔴 BLOCKED (requires schema + DB patches first)

**Estimated Effort**: 20-30 minutes

---

### 5.3 Payload Emissions Requiring Updates

**Functions to audit**:

- `account.login()` — emits LOGIN_SUCCESS with player email
- `account.relog()` — emits player object with email
- `account.requestPasswordReset()` — emails user their recovery link

**Pattern**:

```javascript
// ❌ BEFORE: Emits plaintext email
socket.emit('LOGIN_SUCCESS', {
    playerID: player.playerID,
    email: player.email,  // PLAINTEXT
    // ...
})

// ✅ AFTER: Decrypt only when necessary to emit
socket.emit('LOGIN_SUCCESS', {
    playerID: player.playerID,
    email: EmailSecurity.decryptEmail(player.email_encrypted),
    // ...
})
```

**Security Note**: Decryption should only occur when transmitting email to authenticated client. Never store plaintext in memory or session.

**Status**: ⏳ PENDING (after DB patches)

**Estimated Effort**: 15-20 minutes (3-4 locations)

---

## 6. Testing Strategy (Phase 5: ⏳ FUTURE)

### 6.1 Unit Tests

**Test Suite**: `test/crypto.test.js` (new file)

**Test Cases**:

1. `hashEmail()` determinism (same input → same output)
2. `encryptEmail()` + `decryptEmail()` round-trip
3. `hashEmail()` case-insensitivity
4. `encryptEmail()` randomness (different IVs per call)
5. Decryption with wrong master key (should throw)
6. Decryption with modified auth tag (should throw)
7. Password verification with crypto.timingSafeEqual

**Status**: ⏳ FUTURE (after integration complete)

---

### 6.2 Integration Tests

**Test Suite**: `test/account.integration.test.js`

**Test Scenarios**:

1. Register new player → verify email_hash + email_encrypted in DB
2. Login with correct password → no plaintext email stored in session
3. Login with wrong password → error (no data leak)
4. Get player by email → retrieves correct row via email_hash lookup
5. Password reset → retrieve encrypted email, decrypt for message
6. Email confirmation → creates player with dual-column strategy

**Status**: ⏳ FUTURE (after implementation complete)

---

## 7. Remaining Call Sites Audit (Phase 6: ⏳ FUTURE)

### 7.1 Discovery Method

**Command**:

```bash
grep -r "player\.email" src/ handlers/ --include="*.js"
grep -r "player_cache.*email" src/ handlers/ --include="*.js"
grep -r "WHERE email" src/ --include="*.js"
```

**Expected Matches**:

- `handlers/account.js`: login, relog, login_success emissions
- `handlers/account.js`: password reset email transmission
- `src/database.js`: query functions (already identified)
- Potentially: email verification, account deletion, user profile endpoints

### 7.2 Audit Checklist

For each location:

- [ ] Is email being **displayed to user**? → Decrypt via `EmailSecurity.decryptEmail()`
- [ ] Is email being **sent in email message**? → Decrypt via `EmailSecurity.decryptEmail()`
- [ ] Is email being **queried from DB**? → Use `email_hash` lookup via `EmailSecurity.hashEmail()`
- [ ] Is email being **stored in session/memory**? → NEVER (send decrypted only when needed, then discard)
- [ ] Is email being **logged**? → NEVER (redact in logs or use email_hash instead)

**Status**: ⏳ FUTURE (after main phases complete)

---

## 8. Implementation Checklist

### Critical Path

- [ ] **Step 1**: Create GitHub issue for schema migration (prerequisite)
- [ ] **Step 2**: Get user approval for DB query patches
- [ ] **Step 3**: Apply patches via `multi_replace_string_in_file`
  - [ ] Patch `getPlayerByEmail()`
  - [ ] Patch `loginPlayer()`
- [ ] **Step 4**: Rewrite `processEmailConfirmation()` with dual-column strategy
- [ ] **Step 5**: Audit and update email payload emissions
  - [ ] `account.login()`
  - [ ] `account.relog()`
  - [ ] `account.requestPasswordReset()`
- [ ] **Step 6**: Run integration tests
- [ ] **Step 7**: Full call-site audit via grep

### Non-Blocking (Can parallelize)

- [ ] Fix `joinPrivateRoom()` architecture bugs
- [ ] Create unit tests for EmailSecurity
- [ ] Documentation review

---

## 9. Security Considerations

### Master Key Management

- **Storage**: Environment variable `CRYPTO_MASTER_KEY` (length: 32 bytes for AES-256)
- **Generation**: `crypto.randomBytes(32).toString('hex')`
- **Rotation**: Currently not implemented; future task
- **Backup**: NEVER log or backup master key in plaintext

### Audit Logging

- **Decryption calls**: Should be logged (sensitive operation)
- **Email lookups**: May be logged (informational)
- **Failed verifications**: Should be logged (security events)

### Timing Attack Mitigations

- ✅ `crypto.timingSafeEqual()` for password verification
- ✅ HMAC-SHA256 for email hashing (deterministic, not timing-sensitive)
- ✅ AES-256-GCM for encryption (hardware-accelerated on modern CPUs)

### Threat Model

- **Protected Against**: Plaintext email leakage, database compromise revealing user emails
- **Not Protected Against**:
  - Master key compromise (decryption possible; rotate immediately)
  - Logged plaintext emails (strict logging policy required)
  - In-memory email exposure (minimize email payload copies)

---

## 10. Compliance & Audit Trail

### GitHub Issue Cross-Reference

- **Primary**: #33 (v0.40.0 prototype task list)
- **Aggregate**: #75 (MISSION-33.1: crypto integrity)
- **Subtasks**: #43, #42, #36, #37, #34, #35, #38, #53, #78

### Deadline

**2026-06-15** (1 day from workflow documentation date)

### Current Progress

- **Cryptographic Primitives**: 100% complete ✅
- **Schema Migration Planning**: 0% complete (issue not created)
- **DB Query Patches**: 0% complete (identified, awaiting approval)
- **Account Handler Rewrite**: 0% complete (blocked by schema)
- **Integration Testing**: 0% complete (future phase)
- **Overall**: **45-50% complete**

### Documentation Version

- **Created**: 2026-06-14
- **Document Version**: 0.1.0
- **Status**: In Progress
- **Next Review**: After schema migration issue created

---

## 11. Reference: Code Locations

### Cryptography Functions

- `src/services/crypto.js:EmailSecurity.hashEmail()`
- `src/services/crypto.js:EmailSecurity.encryptEmail()`
- `src/services/crypto.js:EmailSecurity.decryptEmail()`
- `src/services/crypto.js:verifyPassword()`

### Database Queries

- `src/database.js:197` — `getPlayerByEmail()` [BUG]
- `src/database.js:281` — `loginPlayer()` [BUG]

### Account Handlers

- `handlers/account.js:verifyCredentials()`
- `handlers/account.js:login()`
- `handlers/account.js:relog()`
- `handlers/account.js:joinPrivateRoom()`
- `handlers/account.js:processEmailConfirmation()`
- `handlers/account.js:requestPasswordReset()`

### Session Management

- `handlers/session.js:disconnect` listener (grace period implementation)
- `handlers/session.js:reconnect` listener (grace period cancellation)

---

## Appendix: Key Decisions

### Why Dual-Column Strategy?

- **Column 1 (email_hash)**: Enables lookups without decryption; supports UNIQUE constraint
- **Column 2 (email_encrypted)**: Stores confidential email for display/transmission only when needed
- **Alternative**: Single encrypted column requires decryption for every lookup (performance penalty)

### Why HMAC-SHA256 for hash?

- Deterministic (unlike random salts used in password hashing)
- Keyed (master key prevents rainbow tables)
- Fast (suitable for frequent database lookups)
- Industry standard for non-invertible email identifiers

### Why AES-256-GCM for encryption?

- Authenticated encryption (prevents tampering)
- Hardware-accelerated on modern CPUs (performance)
- 256-bit key length (post-quantum resistant sufficient for current standards)
- 12-byte IV (96-bit: optimal for GCM, prevents collisions)

### Why crypto.timingSafeEqual() for passwords?

- Prevents timing attacks on password verification
- Attackers cannot infer correct characters by measuring response time
- Standard practice for cryptographic comparisons

### Why 10-second grace period?

- Bridges network latency and F5 spam prevention
- Players can reconnect if connection drops briefly
- Prevents rapid socket recreation attacks
- Balances usability vs. security

---

END OF DOCUMENT
