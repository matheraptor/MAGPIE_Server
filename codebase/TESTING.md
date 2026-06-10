# Testing Strategy - MAGPIE_Server

## Frameworks
- **None**: No automated test suite (Jest, Mocha, etc.) is currently configured in `package.json`.

## Manual Testing
- **Embedded REPL**: The primary method for testing internal state. The server starts an interactive console allowing live inspection of `SERVER`, `HIVE`, `RUNTIME`, etc.
- **Scratchpad (`plugins/scratchpad.js`)**: A live-reloading execution environment. Saving this file triggers `SERVER.js` to eval its contents in a sandbox context.
- **Socket.io Admin UI**: Used for real-time monitoring of network events and room membership.

## Internal Validation
- **Validation Methods**: Core classes include extensive validation logic (e.g., `MAGPIE_PHYSICS.isValidPOVART`, `MAGPIE_ENTITY.isValidFitness`, `MAGPIE_STATE.validate`).
- **Type Checking**: runtime checks using `instanceof` and `constructor.name` before processing objects.

## Diagnostic Tools
- **Diego Coupling Reports**: Found in `admin/docs/`, these provide historical diagnostic data and fixing guides for specific architectural bottlenecks.
- **Memory Reporting**: `MAGPIE_RUNTIME.prototype._memoryUsage()` provides periodic heap reports.
