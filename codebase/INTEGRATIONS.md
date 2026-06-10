# Integrations - MAGPIE_Server

## External Services
- **SMTP / SendGrid**: Integrated via `nodemailer` for sending registration confirmations and password reset emails.
- **Cloudflare / GCP**: Mentioned in changelogs and README for domain management and hosting (Google Cloud Platform).
- **DuckDNS**: Used for dynamic DNS stabilization (referenced in `README.md`).

## Libraries & APIs
- **Socket.io Admin UI**: Instrumentation enabled for monitoring socket connections (`@socket.io/admin-ui`).
- **Ganja.js**: Integrated for Projective Geometric Algebra (PGA) calculations.

## Internal Subsystems
- **Mailer Service (`core/mailer.js`)**: Wraps SMTP functionality.
- **Database Worker (`core/database_worker.js`)**: Orchestrates access to `world.db` and `server.db`.
- **FSIO Worker (`core/workers/fsio.js`)**: Dedicated thread for asynchronous log writing and filesystem operations.
