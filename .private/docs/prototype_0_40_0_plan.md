---
name: MAGPIE ShelderEvo MMORPG pre-production 0.4*.* prototype plan
type: implementation plan
version: 0.39.0 20260610
---

# M.A.G.P.I.E. Shelder Evolution

## Pre-production Prototype {#top}

- [M.A.G.P.I.E. Shelder Evolution](#magpie-shelder-evolution)
  - [Pre-production Prototype {#top}](#pre-production-prototype-top)
  - [SPEC](#spec)
    - [Purpose](#purpose)
    - [Package](#package)
    - [Current state](#current-state)
      - [Prototype attempt 0.38.\*](#prototype-attempt-038)
    - [Full-stack](#full-stack)
    - [MMORPG Server](#mmorpg-server)
      - [Nodejs](#nodejs)
      - [Express](#express)
      - [Socket.io](#socketio)
      - [Handlers](#handlers)
      - [JWT](#jwt)
      - [Scrypt](#scrypt)
      - [Nodemailer](#nodemailer)
      - [Better-sqlite3](#better-sqlite3)
    - [MMORPG Client](#mmorpg-client)
      - [NWjs](#nwjs)
      - [RPG Maker MZ](#rpg-maker-mz)
      - [Socket.io-client](#socketio-client)
    - [External dependencies](#external-dependencies)
    - [Resources](#resources)
    - [Assets](#assets)
    - [Budget](#budget)
  - [TARGET architecture](#target-architecture)

[Back to top ⤴️](#top)

---

## SPEC

### Purpose

### Package

### Current state

#### Prototype attempt 0.38.*

### Full-stack

[Back to top ⤴️](#top)

---

### MMORPG Server

**Structure:**

```markdown
`MAGPIE_Server`/
├── `SERVER.js`              # Main entry point & Socket.io orchestrator
├── `package.json`           # Dependencies & scripts
├── config/
│   └── `config.js`          # Processes .env → App Configuration
├── data/
│   └── `*.js`               # JSON-like data injected at boot
├── public/                # Statically served frontend
│   ├── `index.html`         # Homepage
│   ├── `main.js`            # Client-side logic
│   ├── `home.css`           # Homepage styles
│   └── routes/            # Other HTML/CSS/JS areas
└── src/
    ├── `*.js`               # General application code
    ├── plugins/
    │   └── `*.js`           # Modular plugin extensions
    ├── services/
    │   ├── `*.js`           # Background workers / Business logic
    │   └── `mailer.js`      # Nodemailer implementation
    └── handlers/
        └── `*.js`           # Decoupled io.on() event handlers
```

[Back to top ⤴️](#top)

---

#### Nodejs

**Require stack:**

[SERVER.js](../../SERVER.js)

```javascript
MAGPIE_SERVER.config = require("./config/server_config")
const { timeEnd } = require("node:console")
const express = require("express")
const ratelimit = require("express-rate-limit")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
const cliSpinner = require("cli-spinner")
const cliProgress = require("cli-progress")
const fs = require("fs")
const path = require("path")
const vm = require("node:vm")
const readline = require("readline")
/**
 * @typedef {import("jsonwebtoken")} jwt
 * @type {jwt}
 */
const jwt = require("jsonwebtoken")
MAGPIE_SERVER.MAIL = require("./src/services/mailer")
MAGPIE_SERVER.FS = fs
MAGPIE_SERVER.PATH = path
MAGPIE_SERVER.VM = vm
MAGPIE_SERVER.JWT = jwt
```

[Back to top ⤴️](#top)

---

#### Express

```javascript
//@region IMPORT
const { express } = require("express")
const { createServer } = require("node:http")
```

[Back to top ⤴️](#top)

---

#### Socket.io

**Server-side:**

```javascript
//JAVASCRIPT

//@region IMPORT
const { express } = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
//@region SERVER/App
const app = express()
const server = createServer(app)
const io = new Server(server, {
    //@audit-ok cors configs
    cors: {
    origin: [MAGPIE.KEY.SERVER.DOMAIN],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  allowUpgrades: true
})
instrument(io, {
    auth: false,
    mode: "development"
})
app.use((req, res, next) => {
    // @audit-ok [HTTP REQUEST] debug logging
    MAGPIE_SERVER.log(`[HTTP REQUEST] ${req.method} ${req.url}`)
    next()
})
```

---

**Client-side:**

[`public/` domain homepage:](../../public/main.js):

```javascript
//========================================================================
// #region - SOCKET
//========================================================================
/** @type {import("socket.io-client").Socket} */
const socket = io(window.location.origin, {
    auth: {
        token: localStorage.getItem("jwt_token")
    },
    query: {
        entityID: MAGPIE_CLIENT.params.get("entityID"),
        playerID: MAGPIE_CLIENT.params.get("playerID")
    },
    transports: ["websocket", "polling"],
    secure: MAGPIE_CLIENT.secure_socket
})
```

```html
<script src="/socket.io/socket.io.js"></script>
<script type="text/javascript" src="/main.js"></script>
```

[Desktop client app / 'launcher'](../../../ShelderEvo/index.html)

```html
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
<script src="js/plugins/app/cli.js"></script>
```

[Back to top ⤴️](#top)

---

#### Handlers

---

#### JWT

---

#### Scrypt

Native Nodejs 'crypto' & Identity Security.

**Password Hashing:**

- Use `scrypt` for password storage to resist brute-force and hardware acceleration attacks.

**Email Privacy (Dual-Column Strategy):**
To ensure player privacy and GDPR compliance while maintaining high-performance lookups, the system implements a split-storage model:

1. **Searchable Identity (`email_hash`)**:
   - **Algorithm**: `HMAC-SHA256` with a static `HASH_SALT`.
   - **Purpose**: Deterministic lookup. Allows the server to find a user by email without storing the plaintext email in a searchable format.
   - **Complexity**: $O(1)$ index lookup.

2. **Recoverable Identity (`email_encrypted`)**:
   - **Algorithm**: `AES-256-GCM` (Authenticated Encryption).
   - **Structure**: `iv:authTag:encryptedData`.
   - **Purpose**: Secure storage for communication. Only decryptable via the `EMAIL_MASTER_KEY`.
   - **IV (Initialization Vector)**: Unique random bytes per encryption to prevent pattern analysis.
   - **Auth Tag**: Ensures the encrypted data hasn't been tampered with.

**Workflow**:

- **Registration**: $\text{Email} \rightarrow \text{Hash}(\text{Salt}) \rightarrow \text{db Column A}$ AND $\text{Email} \rightarrow \text{Encrypt}(\text{Key}) \rightarrow \text{db Column B}$.
- **Login**: $\text{Input Email} \rightarrow \text{Hash}(\text{Salt}) \rightarrow \text{Query Column A}$.
- **Communication**: $\text{Column B} \rightarrow \text{Decrypt}(\text{Key}) \rightarrow \text{Plaintext Email}$.

---

#### Nodemailer

---

#### Better-sqlite3

[Back to top ⤴️](#top)

---

### MMORPG Client

#### NWjs

#### RPG Maker MZ

#### Socket.io-client

[Back to top ⤴️](#top)

---

### External dependencies

### Resources

### Assets

### Budget

[Back to top ⤴️](#top)

---

## TARGET architecture

---
