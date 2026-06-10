# Technical Concerns & Risks - MAGPIE_Server

## Security Risks
- **JWT `@todo`**: `SERVER.js` contains a comment `@todo JWT login security`, and currently `io.use` middleware has hardcoded bypass logic (`playerID = isDev ? "999" : "0"`).
- **Hardcoded Secrets**: Potential for secrets to be exposed if `.env` is mismanaged, though `core/config.js` correctly uses `process.env`.

## Technical Debt
- **Documentation Rot**: The `README.md` is significantly outdated (v0.20.1) compared to the actual implementation (v0.38.2 in `core/index.js`).
- **Excessive `@todo`**: Many critical functions (e.g., `_apply_processor`, `MAGPIE_ENGINE.update`, `_geod_checkCollisions`) are stubs or contain significant `@todo` markers.
- **Diego Coupling**: Historical evidence of tight coupling issues (referenced in `admin/docs/`) suggest potential fragility in system interactions.

## Performance Bottlenecks
- **REPL Overhead**: Keeping a REPL active in production might have performance and security implications.
- **Better-sqlite3 Synchronicity**: While high-performance, `better-sqlite3` is synchronous. If the database worker thread becomes blocked, all DB operations will stall.
- **JSON Serialization**: Extensive use of `JSON.stringify` and `JSON.parse` with custom revivers/replacers for every database operation may become a bottleneck as the number of entities grows.

## Scaling
- **MMORPG Ambitions**: The current architecture is single-process (with a few workers). Transitioning to a distributed "Eve Online" scale MMORPG as envisioned in the README will require a complete overhaul of the persistence and state synchronization layers.
