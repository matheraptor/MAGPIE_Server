# Coding Conventions - MAGPIE_Server

## Naming Standards
- **Classes/Namespaces**: Prefixed with `MAGPIE_` or `MAGPIE.` (e.g., `MAGPIE_HIVE`, `MAGPIE.KEY`).
- **Variables**: CamelCase or snake_case depending on context (e.g., `entityID`, `ePrefix`).
- **Constants**: Uppercase for keys and enums (`MAGPIE.KEY.TYPE.AXIOM`).

## Code Organization
- **Regions**: Extensive use of `// #region` and `// #endregion` for logical grouping within files.
- **Prefixed Logging**: Functions often define an `ePrefix` (e.g., `[ENTITY-123].refresh: `) for standardized error and log reporting.
- **Static vs Prototype**: Heavy mix of static helper methods and prototype-based orchestration.

## Documentation
- **JSDoc**: Ubiquitous usage for type definitions (`@typedef`), parameter descriptions (`@param`), and versioning (`@version`).
- **Changelogs**: Included directly in file headers to track changes at a granular level.

## Data Structures
- **Typed Arrays**: `Float64Array` used for numerical arrays like `STATS` and `POVART` to ensure performance and precision.
- **Maps**: Used for registries (`_registry`, `INDEX`) to provide O(1) lookups.

## Implementation Patterns
- **Database Workers**: Offloading SQLite operations to `worker_threads` using a request/response messaging pattern via `requestID`.
- **Hydration**: Custom logic in `database_worker.js` to restore `Map` and `Float64Array` objects from JSON strings during database loads.
- **Self-Cleaning Triggers**: Database schema includes SQLite triggers for automated FTS (Full-Text Search) index maintenance.
