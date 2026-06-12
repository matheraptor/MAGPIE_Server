# Codebase Audit Report: MAGPIE_Server 0.39.3

**Audit Date:** 2026-06-12
**Target Branch:** prototype (0.39.3)
**Auditor:** Jules (Google AI)

## 1. Executive Summary
The MAGPIE_Server prototype v0.39.3 is in a "mid-transition" state. While the low-level engine (Physics, Database, and Entity structures) is robust and uses advanced Projective Geometric Algebra (PGA), the higher-level gameplay mechanics (Action/Rest loop) and the target security architecture (Dual-Column Privacy) are largely stubs or undocumented divergences from the 0.40.0 implementation plan.

## 2. Module / Component Tree

| Module | Implementation State | Notes |
| :--- | :--- | :--- |
| **SERVER.js** | **Partial (God Object)** | Handles everything from HTTP routing to Socket.io logic. Contains ~2500 lines. Refactoring is high priority. |
| **core/physics.js** | **Complete** | High-fidelity PGA implementation. Handles rotors, bivectors, and kinematics. |
| **core/entity.js** | **Partial** | Core class (~2200 lines). Handles stats, injuries, and states. Missing full collision/inertia logic. |
| **core/database.js** | **Complete** | Efficient Better-SQLite3 wrapper with worker thread offloading. |
| **handlers/accountHandler.js**| **Complete** | Basic registration/login. **Gap:** Missing the planned HMAC/AES privacy shield. |
| **handlers/playerHandler.js** | **Partial** | Entry point for player actions. `processAction` is a stub. |
| **handlers/sessionManager.js** | **Complete** | Manages socket sessions. Patched during this audit to fix JWT bypass. |
| **data/** | **Complete** | Static definitions for states, traits, and components. |
| **routes/adoption.js** | **Partial** | Logic for creature adoption. Patched during this audit to fix empty ecosystem list. |

## 3. Documentation Gap Analysis

### 3.1 README.md vs. Reality
- **Action/Rest Loop:** README describes a card-based stamina/reserve system. **Reality:** The code contains stats for stamina and fatigue, but the actual logic to play cards, consume reserve, or apply fatigue to hand size is **missing** (@todo in `core/player.js`).
- **Permanent Death:** README claims creatures die definitive deaths. **Reality:** Injury structures exist, but there is no automated "Death Check" or "Predation" logic implemented in the entity lifecycle.
- **Ecosystem:** README claims adoption is the primary mechanic. **Reality:** The ecosystem list was an empty stub until the v0.39.3 patch applied during this session.

### 3.2 prototype_0_40_0_plan.md vs. Reality
- **Structure Divergence:** The plan explicitly calls for a `src/` directory with `src/services/` and `src/handlers/`. **Reality:** The codebase remains in a flat-root structure with `core/` and `handlers/` directories.
- **Privacy Shield:** The plan specifies a "Dual-Column Strategy" for emails (HMAC-SHA256 for searching, AES-256-GCM for storage). **Reality:** Emails are currently stored and queried in **plaintext** in the database.
- **JWT Security:** The plan assumes professional session handling. **Reality:** The server had a hardcoded "Dev Mode" bypass that granted administrative access to any connection (now patched).

## 4. Technical Debt & Risks
- **Cognitive Load:** `SERVER.js` and `core/entity.js` are monoliths. Any change to entity stats requires navigating thousands of lines of unrelated physics code.
- **Security Leak:** Plaintext email storage is a GDPR/privacy risk and violates the 0.40.0 spec.
- **Context Rot:** Future agents reading the README will assume the "Action/Rest" loop is playable, leading to failed test plans.

## 5. Actionable Recommendations
1. **Immediate Refactor:** Decompose `SERVER.js`. Move ECOSYSTEM logic and Socket handlers into the `handlers/` directory.
2. **Implement Privacy Shield:** Priority should be given to `core/auth_util.js` updates for AES/HMAC email handling to align with the 0.40.0 plan.
3. **Update README:** Add a "Current Implementation Status" section to the README to flag that the CCG mechanics (Action/Rest/Deck) are currently in the Design Phase.
4. **Collision Engine:** Complete the `@todo` markers in `core/physics.js` to allow for physical entity interaction.

---
*Report generated for MAGPIE_Server Prototype 0.39.3 Audit.*
