# Tech Stack - MAGPIE_Server

## Core Runtime
- **Node.js**: Primary execution environment (CommonJS).
- **Worker Threads**: Utilized for offloading intensive tasks (Database, File I/O).

## Web & API
- **Express (v5.2.1)**: Web framework for HTTP routes (account management, verification).
- **Socket.io (v4.2.0)**: Real-time bidirectional event-based communication for game state.
- **jsonwebtoken (v9.0.3)**: Security tokens for session management and verification.
- **express-rate-limit**: Middleware to limit repeated requests to public endpoints (e.g., login).

## Data Persistence
- **SQLite (via better-sqlite3 v12.9.0)**: High-performance, synchronous SQLite library.
- **WAL Mode**: Write-Ahead Logging enabled for concurrent read/write performance.

## Physics & Math
- **ganja.js (v1.0.204)**: Geometric Algebra library (3,0,1 PGA) for 3D physics and rotations.
- **Float64Array**: Heavy use for high-precision numerical data (POVART, STATS).

## Utilities & Tooling
- **dotenv**: Environment variable management.
- **nodemailer (v8.0.10)**: Email delivery service.
- **cli-progress**: Multi-bar progress tracking for boot/shutdown sequences.
- **cli-spinner**: Terminal spinners for CLI feedback.
- **Node REPL**: Interactive administrative console embedded in the server.
