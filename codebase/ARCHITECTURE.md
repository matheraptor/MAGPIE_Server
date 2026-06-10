# Architecture - MAGPIE_Server

## High-Level Overview
MAGPIE_Server is designed as a persistent, real-time backend for a collectible card game (CCG) / MMORPG. It employs an **ECS/OOP hybrid** model where entities are persistent objects with high-fidelity physical state (POVART) and modular fitness (traits/cards).

## Core Systems
- **MAGPIE_RUNTIME**: The "heartbeat" of the server. It manages a multi-layered ticking system:
  - **Base/Game Layers**: High frequency for physics and real-time interactions.
  - **Standard/Super/Mega/Ultra Layers**: Lower frequency for background simulation, ecosystem growth, and persistence.
- **MAGPIE_HIVE**: An in-memory registry and buffer for active entities. It handles "hosting" (loading into memory) and "kicking" (unloading/saving) entities based on their importance (urgency/gravity).
- **MAGPIE_DATABASE**: A dual-database system:
  - **World DB**: Persistent game state (Entities, Symbols, Exps, Contexts).
  - **Server DB**: Meta-data (Players, Logs).
  - **Worker-Driven**: All heavy DB operations occur in a dedicated worker thread to prevent blocking the event loop.

## Data Flow
1. **Inputs**: Received via Socket.io events (e.g., `LOGIN`, `subscribe_entity`) or HTTP POST (e.g., `/login`).
2. **Processing**: `MAGPIE_RUNTIME` ticks entities. Entities process their Experiences (`MAGPIE_EXP`), Emotes (`MAGPIE_EMOTE`), and States (`MAGPIE_STATE`).
3. **Physics**: `MAGPIE_PHYSICS` updates the POVART (Position, Orientation, Velocity, Acceleration, Rotation, Torque) using 3D geodetic math and PGA.
4. **Output**: Updated state is emitted back to clients via Socket.io rooms (e.g., `entity_${id}`).
5. **Persistence**: `MAGPIE_HIVE` periodically flushes buffers to the database workers.

## Security Model
- **JWT**: Tokens used for player authentication and email verification.
- **Password Hashing**: Implemented via `core/auth_util.js` (bcrypt-style, though specific implementation varies).
- **Rate Limiting**: Applied to login and critical endpoints.

## Administrative Interface
The server starts an interactive **REPL** (Read-Eval-Print Loop), allowing developers to inspect and modify the `MAGPIE_SERVER` object, trigger saves, or interact with the `HIVE` directly in real-time.
