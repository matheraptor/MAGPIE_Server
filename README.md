---
type: readme
version: 0.20.1 2026-04-25
tags: [MAGPIE, server, readme]
---

# MAGPIE Server for Shelder Evolution {#top}

- [MAGPIE Server for Shelder Evolution {#top}](#magpie-server-for-shelder-evolution-top)
  - [Meta](#meta)
    - [What is MAGPIE Server?](#what-is-magpie-server)
    - [What is Shelder Evolution?](#what-is-shelder-evolution)
    - [Why a MMORPG?](#why-a-mmorpg)
    - [How does 'roguelike deckbuilding' fit in?](#how-does-roguelike-deckbuilding-fit-in)
    - [What genre and why is it hard sci/fi?](#what-genre-and-why-is-it-hard-scifi)
    - [Why 'Grey Tone' is just a baseline](#why-grey-tone-is-just-a-baseline)
    - ['Bleak Agency' doesn't mean you are insignificant](#bleak-agency-doesnt-mean-you-are-insignificant)
    - [Lore themes and the meta-narrative](#lore-themes-and-the-meta-narrative)
    - [The case for a business model](#the-case-for-a-business-model)
    - [Roadmap](#roadmap)
  - [Index](#index)
  - [NodeJS server + NWjs client](#nodejs-server--nwjs-client)
    - [Pseudo-server](#pseudo-server)
    - [Hosting and Domain](#hosting-and-domain)
    - [RMMZ-based client](#rmmz-based-client)
  - [ECS/OOP hybrid architecture](#ecsoop-hybrid-architecture)
  - [Express server](#express-server)
  - [Socket.io](#socketio)
  - [JWT security](#jwt-security)
  - [Better-sqlite3 database](#better-sqlite3-database)
  - [REPL](#repl)
    - [CLI-progress](#cli-progress)
    - [CLI-spinner](#cli-spinner)
  - [Lore](#lore)

[Back to Top ⤴️](#top)

---

## Meta

[Back to Top ⤴️](#top)

---

### What is MAGPIE Server?

M.A.G.P.I.E.[^MAGPIE]

The MAGPIE Server is the core architecture that drives the Shelder Evolution experience. The game's architecture is based on the following components:

- **Central Server**
  - Unique and hierarchical coordination starting from 'REYA' — the admin, and descending through levels:
    - **REYA**
      - **ROLE_MODEL / MOD** (moderator)
      - **EXPERT / DEV** (gamedevs or lore writers)
      - **GUIDE** (the game masters)
    - Playerbase with an additional hierarchy of roles:
      - **PLAYER** (base level that everyone has as a member of the community, because we are all, at our core, PLAYERs)
      - **Leader** (members leading factions/groups)
      - **Legend** (popular members known for deeds and contributions)
      - **Elder** (honorary members for longevity)
    - NPCs integrated directly into the lore and meta-structure:
      - All creatures, whether controlled by a human or by the game's AI, are technically NPCs. The PLAYER is a guide, and the adopted creature is not an avatar but a disciple. Ergo, the concept of a standard NPC doesn't exist because they are *all* NPCs. The only difference is the mentor guiding them.

[Back to Top ⤴️](#top)

---

### What is Shelder Evolution?

[Shelder Evolution](https://www.notion.so/Shelder-Evolution-4ab289bcbf5144e3ad24aaf9d4fc20ad?pvs=21) is a multi-platform project that encompasses the saga (lore), the content (art/music/vlogs/merchandise), the meta (the game world / server) with its interoperable access points (client), and the backend (admin/gamedev).

The content outlet ranges from digital art using tools like Krita, GIMP, and Aseprite, to merchandise. Specifically:

- Webcomic (w.i.p. 'Wild World' on [Webtoons](https://www.webtoons.com/en/canvas/wild-world/list?title_no=392510))
- [Game Assets](https://matheraptor.itch.io/)
- Art for merchandise, sold via Spreadshirt or Amazon
- Music through the virtual band '[Trickster Switch](https://soundcloud.com/tricksterswitch/sets)'
- Vlogs such as the [MatheraptorShow](https://www.youtube.com/@MaTheRaptor)

[Back to Top ⤴️](#top)

---

### Why a MMORPG?

Let's state right away that the final idea is to create an MMORPG on the scale of Eve Online, featuring its own internal economy and a single persistent server that unifies the lore in one place while encouraging individual granularity to create personal sub-lore.

Naturally, this is the endgame, not the current state of affairs. We are starting instead with a single-player app that already takes a multiplayer approach, emulating aspects typically found in an MMORPG—such as logging into a server to join a persistent community, the presence of other entities pursuing their own paths, and an internal economy.

[Back to Top ⤴️](#top)

---

### How does 'roguelike deckbuilding' fit in?

As explained above, the architecture is based on a collectible card game (CCG). If you are already a fan of Pokémon, Magic, Yu-Gi-Oh, etc., you should have an idea of what it entails. Although the specific idea for this game differs from any other card game currently on the market—which is exactly why there was a need to create an original one, allowing the freedom to do it my way.

The base unit of action in the game is the **CREATURE**:

- Each creature has its own life with gradual growth, starting from conception as a fetus, up to definitive death.
- Each creature is therefore a unique persistent entity, whose death is permanent.
- Adoption is the primary mechanic through which a PLAYER can acquire the guidance of a creature and maintain it until its death.
- Every creature provides the adopting PLAYER with a CREATURE DECK that represents the card abstraction of that entity in the game.

The base interaction in the game is the **ACTION**, with its alternative of inaction — **REST**:

- Every action involves choosing and using a card from one's hand. The cost of an action is inherent to the hand itself, which represents **STAMINA**.
- You can only draw cards during rest, which acts as a stamina recharge, thereby necessarily forfeiting the action for that turn. The cost of resting is inherent in the consumption of cards from the deck, which represents the **RESERVE**.
- When the reserve runs out, one of the cards in the discard pile is exiled as an INJURY, taking the form of FATIGUE. Each fatigue reduces stamina by 1, thus limiting the maximum number of cards you can hold in your hand.
- When fatigue prevents holding any cards, the creature is EXHAUSTED and is lost to EXHAUSTION. This does not equal death, unless the opponent decides to prey upon your defenseless creature.
- If the entire reserve becomes an injury, or a vital trait is injured, the creature dies from its wounds.
- A dead creature becomes food for other creatures — the foundation of predation, and the focal point of the internal economy.

[Back to Top ⤴️](#top)

---

### What genre and why is it hard sci/fi?

[Back to Top ⤴️](#top)

---

### Why 'Grey Tone' is just a baseline

[Back to Top ⤴️](#top)

---

### 'Bleak Agency' doesn't mean you are insignificant

[Back to Top ⤴️](#top)

---

### Lore themes and the meta-narrative

The base goal of the game is the acquisition of **EVOLUTION POINTS (EVP)**, which are necessary for meta-interactions, chief among them being adoption:

- Adopting creatures costs EVP. Unless the cost is 0 (like for 'starter species'), you pay in evolution points, effectively treating them as meta-currency.
- EVP can also be invested to develop exotic traits and hack evolution.
- EVP are generated primarily when giving birth to a fetus. Additional EVP are awarded during the offspring's growth as bonuses for this main 'QUEST'.

The base goal of the metagame/community is the acquisition of **CLOUT POINTS**, necessary to level up in roles:

- The simple act of playing, the trade of evolution points, and the creation of evolution points itself provide clout bonuses.
- Contributions to the community, such as monetary donations or volunteering for management tasks, provide additional clout bonuses.

[Back to Top ⤴️](#top)

---

### The case for a business model

[Back to Top ⤴️](#top)

---

## Current Implementation Status (v0.39.3)

| Component | Status | Target |
| :--- | :--- | :--- |
| **Physics Engine** | Production | PGA-based Kinematics (Complete) |
| **Database** | Production | Better-SQLite3 Worker (Complete) |
| **Entity System** | Beta | Stats & Stats (Complete) / Collision (Pending) |
| **Gameplay Mechanics**| Design | Action/Rest Card Loop (Incomplete) |
| **Security** | Alpha | JWT (Working) / Email Privacy Shield (Pending) |

---

### Roadmap

- **Development on NW.js via HTML/CSS/Javascript**
  - PC downloadable app with negligible requirements (if the PC runs Chrome, it runs the app).
  - 0 dependencies - plug-and-play game - download it, and play.
  - Javascript/JSON architecture based on ES6/JSDocs making modding easy, and allowing the implementation of external links without visible performance costs.
    - Synchronization module via Discord through API.
    - RP details generation module via local LLM.
    - Integration module with strategic dashboard.
- **Development on Node.js with advanced ESM, API, MCP functions**
  - ESM allows advanced package (plugins) integration.
  - APIs allow fast and automated data exchange.
  - MCP facilitates the integration of generative AI models (LLM) to assist with RP details, or other types of automation.
- **Simple Server**
  - Renting a virtual machine on Google Cloud.
  - Node.js integration on the virtual machine.
  - Pay-as-you-go system through donations to the server.
- **Complex Server**
  - Renting a specialized virtual server.
  - Expanding Node.js with modules to manage server security and RMMZ multiplayer.
  - Subscription system, with a 0-cost trial subscription for 'starter-species', and an EVP/CLOUT conversion program into free subscription months.
- **Mobile**
  - Integration on Android mobile.
- **Full MMORPG**
  - Proprietary server.
  - Specialized Node.js app, no longer enslaved to the RPG Maker MZ engine.
  - In-app integrated web services.

[Back to Top ⤴️](#top)

---

## Index

[Back to Top ⤴️](#top)

---

## NodeJS server + NWjs client

The architecture relies on Node.js inherently present in modern browsers, making it easily implementable without complicated or heavy system requirements. Android app integration is on the roadmap (though not guaranteed), making it a portable game that can be played asynchronously, keeping it 'always on' in the background to maximize its strategic card game architecture.

### Pseudo-server

Through the use of tools like Discord and the integrations possible between it and the game app, we can emulate an MMORPG experience even without having everything physically necessary to do so yet. The bulk of the work is done on Discord, where players sync with the rest of the community. Then, the actual experiences take place in-game, leveraging the JRPG architecture of RPG Maker MZ and the modularity of cards thanks to the Card Game Combat plugin, transforming RMMZ into an expandable card game like Pokémon or Magic.

---

### Hosting and Domain

[DuckDNS](https://www.duckdns.org/) for free dynamic DNS.

- [Ephemeral Stabilizer](./core/duckdns/ephemeral_stabilizer.md) script to keep the IP updated.

[Back to Top ⤴️](#top)

---

### RMMZ-based client

For those unfamiliar, RMMZ is a game engine focused on JRPGs, based on the NW.js architecture. It is therefore a Javascript web app that also allows the integration of internal plugins or direct Javascript code. It is not strictly limited to the JRPG architecture, which is why, in our case, we are implementing a CCG (collectible card game) genre.

[Back to Top ⤴️](#top)

---

## ECS/OOP hybrid architecture

[Back to Top ⤴️](#top)

---

## Express server

[Back to Top ⤴️](#top)

---

## Socket.io

[Back to Top ⤴️](#top)

---

## JWT security

[Back to Top ⤴️](#top)

---

## Better-sqlite3 database

[Back to Top ⤴️](#top)

---

## REPL

[Back to Top ⤴️](#top)

---

### CLI-progress

[Back to Top ⤴️](#top)

---

### CLI-spinner

[Back to Top ⤴️](#top)

---

## Lore

Starting from the 50s, a group of nerds formed a secret society that later grew and split into two. These continued to grow independently up to the present day, when, parallel to the development of AI, the focus increasingly shifted towards space colonization. It is exactly with this perspective that, in a future heavily styled after 'The Expanse', the 'M.A.G.P.I.E.' project finally sees the light—a seed ship designed for intergalactic travel to colonize a planet as similar to Earth as possible.

The creators of this project are convinced of the existence of the aforementioned planet—'Shelder'—in an almost prophetic vision of the distant future. Whether it's a prophecy coming true, or the Drake Equation disproving the Fermi paradox, the fact is that the 'HSS Venture' actually finds 'Shelder' in the Orion galactic arm, thus reaching the end of its 40k+ years of (subjective) travel. Meanwhile, entire human empires have been born, grown, and fallen, and most Earthlings have forgotten that this adventure was ever even conceived. From the relativistic point of view of the travelers aboard the Venture, digitized directly into the ship's AI mainframe, a fraction of time has passed, and as far as they are concerned, Earth might as well just be an idea, a fictitious fabrication, a legend.

These digital minds find themselves facing a difficult decision: download themselves—that is, return to a physical body—or remain in cyberspace, continuing to enjoy all the perks that have become second nature and make them feel like deities. But MAGPIE cannot stop and wait for their decision; it is already intent on directing an independent society of drones to build the infrastructure necessary for the colonization of the entire 'Shel' star system, where the planet 'Shelder' resides.

Once the planet is colonized and the first scientific study programs are launched, MAGPIE discovers that the local biosphere is highly evolved, comparable to an Earth in the Cretaceous period—it seems the natives have followed a path very similar to that of Earthlings. What could effectively be called 'Dinosaurs' (and will later be renamed 'Sheldosaurs') are the most prominent megafauna on the planet, with vast biodiversity in every possible biome. Integrating the human species into this delicate meta-ecosystem will require a cautious and well-studied balance, certainly not a task to leave in the hands of the megalomaniacal minds of digitized humans.

Thus, a rivalry forms between the majority of the digital minds (the pro-tech/anti-AI faction), the pro-AI minority alongside the drones, and the naturalist minority (anti-tech/anti-AI). This trilateral rivalry will be the fulcrum of all the main conflicts of the saga, also extending to the local fauna, thanks to a 'small oversight' involving the 'accidental' implementation of a technological perk designed to help monitor the fauna—a runaway process that grants 'intelligence' to the test subjects and gives life to a fourth faction: the 'chips', or intelligent fauna.

[Back to Top ⤴️](#top)

---

[^MAGPIE]: (M)odular (A)rchitecture (G)eneral-(P)urpose (I)ntelligence (E)ngine

---
