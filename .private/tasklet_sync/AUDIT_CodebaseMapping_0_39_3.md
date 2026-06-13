# Codebase Audit Report: MAGPIE_Server 0.39.3 (Prototype Branch)

**Audit Date:** 2026-06-13
**Target Branch:** prototype (0.39.3)
**Auditor:** Jules (Google AI)

## 1. Executive Summary
The `prototype` branch represents the "Modern" state of MAGPIE_Server, successfully adopting the `src/` hierarchy and professional security abstractions defined in the 0.40.0 target architecture. However, the implementation is currently a "functional facade": the security layer (Email Privacy Shield) is present but broken and unintegrated, and the core gameplay loop (CCG Action/Rest) exists only as documentation in the README.

## 2. Module / Component Tree & Implementation State

| Component | State | Notes |
| :--- | :--- | :--- |
| **SERVER.js** | **Complete (Bridge)** | Optimized orchestrator (~1000 lines). Correctly routes to handlers and implements verified JWT middleware. |
| **src/physics.js** | **Complete (Engine)** | PGA 3D Kinematics. Robust rotor/bivector implementation. **Gap:** Realistic forces (Drag/Lift/Friction) are `@todo`. |
| **src/entity.js** | **Partial** | Monolithic class (>4000 lines). Handles biological stats and growth stages. **Gap:** Missing "Definitive Death" logic and deck-management methods (e.g., `_get_RESERVE` is referenced but undefined). |
| **src/services/auth.js**| **BROKEN** | Implements `EmailSecurity`. **Critical Bugs:** Typo `"hec"` for `"hex"` in `encryptEmail`; incorrect `authTag` buffer derivation in `decryptEmail`. |
| **src/database.js** | **Stubbed** | High-level DB interface. Imports `EmailSecurity` but **fails** to use it; all player queries currently use plaintext emails. |
| **handlers/account.js** | **Complete** | Registration/Login logic utilizing scrypt and JWT. |
| **handlers/player.js** | **Stub** | `processAction` is present but empty. |

## 3. Reconciliation & Gap Analysis

### 3.1 Code vs. README.md (Gameplay)
- **High Divergence:** README describes a "Massively Multi-player Online Trading Card Game" with stamina, cards, and injuries.
- **Reality:** The server is a high-fidelity 3D physics simulator. There is no logic for drawing cards, playing traits, or calculating stamina-based action costs.

### 3.2 Code vs. 0.40.0 Plan (Architecture & Privacy)
- **Structure (MATCH):** Code strictly follows the `src/services/` and `handlers/` pattern.
- **Privacy Layer (FAILED):** Plan requires GDPR-compliant HMAC/AES email storage. The implementation in `auth.js` is broken and the database schema remains plaintext.
- **Security (MATCH):** JWT session handling is implemented as per the plan, including secure `devMode` handling.

## 4. Technical Debt & Critical Risks
- **GDPR Compliance:** Plaintext email storage in `server.db` violates the core privacy requirement of the 0.40.0 spec.
- **Dead Code:** `src/entity.js` references `_get_RESERVE()` which does not exist, causing potential runtime crashes during trait-drawing simulations.
- **Broken Privacy Shield:** If an agent attempts to enable `EmailSecurity`, the server will crash due to the `"hec"` encoding typo.

## 5. Actionable Recommendations
1. **Fix EmailSecurity (Line 30 & 43):** Correct encoding typos and buffer derivations to make the Privacy Shield functional.
2. **Database Migration:** Update `src/database.js` to use `EmailSecurity.hashEmail` for lookups and `EmailSecurity.encryptEmail` for storage.
3. **Gameplay Bridge:** Implement a basic card-cost model in `src/player.js` to begin testing the "Action/Rest" loop described in the README.
4. **Docs Sync:** Add an "Engine vs Game" section to the README to clarify that the CCG mechanics are currently in "Design/Stub" state.

---
*Report generated for MAGPIE_Server Prototype 0.39.3 Audit.*
