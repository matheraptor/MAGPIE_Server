# Secondary Analysis: Documentation vs. Implementation

## Overview
This report highlights the discrepancies, gaps, and "documentation rot" identified by comparing the live implementation (v0.38.2) against the project's existing documentation, primarily `README.md` (v0.20.1) and files in `admin/docs/`.

## 1. Versioning Discrepancy
- **Documented**: `README.md` claims version **0.20.1** (dated 2026-04-25).
- **Actual**: `core/index.js` and `SERVER.js` indicate version **0.38.2** (dated 2026-06-10).
- **Impact**: Significant features (layered ticking, database workers, mailer services) implemented since v0.20.1 are undocumented in the main README.

## 2. Database Architecture
- **Documented**: README mentions `Better-sqlite3` as a technology choice but describes it as a simple component.
- **Actual**: The implementation uses a sophisticated **Worker Thread** model (`core/database.js` and `core/database_worker.js`). It manages two separate databases (`world.db` and `server.db`) and uses a custom request/response messaging pattern for asynchronous persistence.
- **Documentation Rot**: No mention of the worker-driven persistence or the split between world and server data.

## 3. ECS/OOP Hybrid Implementation
- **Documented**: The README contains a header for "ECS/OOP hybrid architecture" but provides no details.
- **Actual**: The system is heavily implemented via `MAGPIE_HIVE` (registry/buffer) and `MAGPIE_RUNTIME` (layered orchestrator). The implementation of "Fitness" (traits/cards) and "POVART" (physical state) in `MAGPIE_ENTITY` provides the concrete "hybrid" mechanism.
- **Gap**: The relationship between "Traits" and "States" is complex in the code but completely unaddressed in documentation.

## 4. Security Model
- **Documented**: A header exists for "JWT security".
- **Actual**: The implementation is partially complete. `SERVER.js` contains `@todo JWT login security` and currently bypasses authentication in `io.use` middleware when in dev mode (or defaults to player "0").
- **Ambiguity**: The documentation implies a finished security state, while the code indicates an ongoing or stalled implementation.

## 5. Diego Coupling & Technical Debt
- **Documented**: `admin/docs/` contains multiple reports (e.g., `DIEGO_COUPLING_DIAGNOSTIC_REPORT.md`) detailing specific architectural flaws.
- **Actual**: The code still contains traces of these concerns (e.g., the complex interaction between `HIVE` and `DATABASE` worker).
- **Gap**: These critical diagnostic insights are siloed in the `admin/` folder and not integrated into the developer's high-level orientation (README).

## 6. Real-time Layered Ticking
- **Documented**: Not mentioned in README.
- **Actual**: `MAGPIE_RUNTIME` implements a 6-layer ticking system (Base, Game, Standard, Super, Mega, Ultra) with frequencies ranging from 1ms to 24 hours.
- **Impact**: This is the "brain" of the server architecture but remains entirely undocumented for new developers.

## 7. Lore vs. Implementation
- **Documented**: Extensive lore regarding "Sheldosaurs", "Reya", and intergalactic colonization.
- **Actual**: The code provides the "Materia" vs "Celestial" entity types and "Growth" mechanics (Embryo to Elder) which align with the lore.
- **Discrepancy**: "Clout Points" and "Evolution Points" (EVP) are mentioned as core goals in the README but have very minimal implementation in the current codebase (mostly stubs or simple numeric stats).
