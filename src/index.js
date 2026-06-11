//========================================================================
// #region - META
//========================================================================
/**
 * @namespace MAGPIE_Server
 * @name index
 * @desc dictionary and switchboard
 * @author Matheraptor
 * @licence GPL-3.0
 * @desc stack:
 * - Node.js
 * - Express
 * - jsonwebtoken
 * - Socket.io
 * - better-sqlite3
 * - repl
 * - cli-spinner
 * - cli-progress
 * ------------------------------------------------------------------------
 * {@link MAGPIE.meta.desc}
 * 
 * @desc current
 * 
 * @version 0.39.0 2026 06 11
 * - full pre-production prototype rewrite
 * 
 * ------------------------------------------------------------------------
 * 
 * @version 0.38.6 2026 06 10
 * - TWEAKED: .logs/ => logs/
 * - TWEAKED: boot scripts location and flow
 * - FIXED: exposed public/*_backup.*
 * - FIXED: missing cleanup login in start.sh
 * - FIXED: run_server.sh obsolete and not updated to new flow
 * 
 * @version 0.38.2 2026 06 08
 * - ADDED: css regions
 * - FIXED: legacy ShelderEvo won't load at all
 * - FIXED: css legacy entanglement
 * - FIXED: world.db corruption due to invalid row in entity_children
 * 
 * @version 0.37.0 2026 06 07
 * - ADDED: ShelderEvo socket session resume
 * - ADDED: ShelderEvo app localStorage
 * - ADDED: ShelderEvo app handoff
 * - ADDED: /Adoption route
 * - TWEAKED: accountHandler
 * - TWEAKED: cli_handler
 * - TWEAKED: css
 * - FIXED: improper registration flow
 * - FIXED: login not routing to boot
 * 
 * @version 0.35.0 2026 06 05
 * - ADDED: ShelderEvo client scaffolding
 * - ADDED: client socket handling
 * - ADDED: mailer service
 * - ADDED: ASCII splash and logo
 * - FIXED: accountHandler incomplete logic
 * 
 * @version 0.33.0 2026 06 04
 * - ADDED: new custom domain via Cloudflare
 * - ADDED: 2-step registration with email confirmation
 * - ADDED: password recovery
 * - FIXED: socket unable to process protocol
 * 
 * @version 0.32.0 2026 06 03
 * - ADDED: player auth phase 1
 * - ADDED: player account phase 1
 * - ADDED: homepage CLI button
 * - ADDED: CLI socket phase 1
 * - ADDED: CLI account phase 1
 * - FIXED: CLI box sizing
 * - FIXED: entity skipping next target
 * 
 * @version 0.31.0 2026 06 01
 * - ADDED: ECG phase 1
 * - ADDED: entity.bio phase 1
 * - ADDED: date._printSTZ
 * - ADDED: physics._U_ETE
 * - ADDED: physics._U_printDistance
 * - TWEAKED: entity._target_queue_geodetic
 * - FIXED: seekTarget not using proper rotor physics
 * - FIXED: rotorToEuler
 * 
 * @version 0.30.3 2026 05 31
 * - FIXED: context handling
 * 
 * @version 0.30.2 2026 05 30
 * - ADDED: exp.waypoint logic and options based on exp.keys and their order
 * - ADDED: physics 2body gravity
 * - ADDED: physics: velocity fwd clamping
 * - ADDED: hive slot conflict check
 * - FIXED: hive context handling
 * - FIXED: hive host/kick
 * - FIXED: hive host bug actually caused by entity *194.type 0
 * - FIXED: Vspeeds improperly indexed
 * - FIXED: exp.targetNext not awaiting key target next
 * - FIXED: physics.getAt not triggering cruising dampener
 * - FIXED: physics.getTt confused logic
 * - FIXED: public telemetry
 * 
 * @version 0.26.1 2026 05 28
 * - ADDED: Component.forces
 * - ADDED: Component.processors phase 1
 * - ADDED: Intent vs Locomotion
 * - TWEAKED: entity.seekTarget
 * - FIXED: physics.getTt_axis unable to capture target
 * 
 * @version 0.25.0 2026 05 26
 * - ADDED: dedicated runtime dt
 * - FIXED: HIVE dt tied to runtime layer delta 
 * 
 * @version 0.24.0 2026 05 26
 * - ADDED: Entity.agency scaffolding
 * - TWEAKED: reverted away from db.fts5 due to corruption
 * - FIXED: hive hiccups
 * 
 * @version 0.23.6 2026 05 25
 * - ADDED: context handling methods
 * - FIXED: seekTarget orchestration typos and flickering
 * - FIXED: SERVER.BOOT.shutdown hanging on HIVE.save()
 * 
 * @version 0.23.1 2026 05 24
 * - ADDED: STATE.FSM_POSTURE
 * - ADDED: HIVE.saveBuffers
 * - ADDED: {@link MAGPIE.KEY.INDEX.ORIENTATION}
 * - ADDED: {@link MAGPIE.KEY.INDEX.VELOCITY} 
 * - TWEAKED: URGENCY and GRAVITY incremental
 * - TWEAKED: changing Vstate and Rstate to FSM stateID
 * - FIXED: PHYSICS._getTt_local unable to seek target heading
 * - FIXED: PHYSICS._getTt_local unable to hold target heading
 * - FIXED: HIVE._host_context unreliable layerID
 * 
 * @version 0.22.29 2026 05 22
 * - ADDED: HIVE._set_${component} methods
 * - ADDED: SYMBOL._add${element} methods
 * - TWEAKED: entity.onState => .addState
 * - TWEAKED: merged runtime-retrofit branch
 * - TWEAKED: SYMBOL._set aliased to HIVE instead of DATABASE
 * - FIXED: MAGPIE_IO.WORKER not being used
 * - FIXED: MAGPIE_SYSTEM .log & .error updated to use worker
 * - FIXED: emote cascading errors due to invalid passed stamina_index
 * 
 * @version 0.22.24 2026 05 20
 * - FIXED: runtime.refresh lagging (being tested)
 * - FIXED: runtime.refresh racing ahead
 * - FIXED: hive.buffers not being used
 * 
 * @version 0.22.21 2026 05 19
 * - ADDED: MAGPIE.KEY.INDEX.STAMINA Map<keyID, stamina_index>
 * - ADDED: MAGPIE.KEY.INDEX STAMINA_0 to STAMINA_9 Enumerator<stamina_index>
 * - TWEAKED: entity.addState is now .onState — stateID is fetched from trait
 * - TWEAKED: stamina_index instead of traitIndex, for tracking card played
 * 
 * @version 0.22.19 2026 05 18
 * - FIXED: MAGPIE_DATE.weekDay not updating at ultraTICK
 * 
 * @version 0.22.18 2026 05 17
 * - ADDED: entity ._trait* basic handling methods
 * - FIXED: typo in entity._get_exps causing cascading errors
 * - FIXED: entity fitness handling and validation
 * 
 * @version 0.22.14 2026 05 16
 * - ADDED: server instance background logger
 * - ADDED: Termius SSH ID
 * - ADDED: nGix inverse proxy and npm extension
 * - ADDED: MAGPIE_CONTEXT prototype
 * - TWEAKED: improved RUNTIME.refresh ticking allows for layer-specific frame-count
 * - TWEAKED: wrapped entity exp handling to isolate future improvements
 * - TWEAKED: changing exp array handling from a dynamic/shift-push (O(n)) to static/index_accumulator (O(1)) 
 * - FIXED: MAGPIE_KEY.setup incorrectly indexing VSpeeds
 * - FIXED: MAGPIE_SYMBOL.getVspeeds incorrectly mapping Vspeeds
 * - FIXED: changing exp handling broke some methods
 * - FIXED: DATABASE key labels
 * - FIXED: RUNTIME ticking
 * 
 * @version 0.22.11 2026 05 15
 * - ADDED: DATABASE.pragma cache_size -64000 to mitigate the read flooding
 * - ADDED: DATABASE.helpers for symbol recipes/components
 * - ADDED: MAGPIE.KEYS for requirements, compounds, recipes, components, and stats 
 * - ADDED: RUNTIME.refresh clamp catch-up loop to prevent execution spikes if(this._base > 100) this._base = 100;
 * - ADDED: MAGPIE_KEY.setup routine to index the axiom keys
 * - TWEAKED: MAGPIE_SYMBOL.STATS now includes requirements/compounds
 * - TWEAKED: MAGPIE_SYMBOL .requirementID and .compoundID deprecated
 * - TWEAKED: DATABASE.getExpKeys using more efficient sql
 * - FIXED: DATABASE.saveSymbolSync iterating through inexistent symbol's .requirements and .compounds 
 * - FIXED: DATABASE.getRow passing floats instead of integers, causing unnecessary read overhead
 * - FIXED: catastrophic bug "return" within for loop in HIVE .tick_buffer and .tick_remote causing subsequent entities in loop to be dropped
 * - FIXED: RUNTIME.refresh while(this._base > 1) race condition
 * - FIXED: RUNTIME.refresh not async preventing safe database execution
 * - FIXED: DATABASE.saveSymbol typo
 * - FIXED: SYMBOL.STATS inconsistent key/value pair
 * - FIXED: MAGPIE.KEY.INDEX.VSPEEDS incorrectly initializing, causing SYMBOL.getVspeeds to fail
 * - FIXED: SERVER.BOOT.shutdown hanging on incorrectly defined async behavior
 * 
 * @version 0.22.4 2026 05 14
 * - ADDED: MAGPIE_IO.WORKER for fsio and logging
 * - ADDED: MAGPIE_SYMBOL_fts [FTS5 indexing](../../HASTRAL/03_MEMORY/wiki/better-sqlite3/fts5-search.md)
 * - ADDED: MAGPIE_SYMBOL name search
 * - TWEAKED: MAGPIE_SYMBOL.STATS back to Float64Array key/value pairs
 * - TWEAKED: [HIVE].save() logToConsole: true => false
 * - FIXED: [BOOT].shutdown logPath incorrectly set to err.message 
 * 
 * @version 0.22.2 2026 05 13
 * - ADDED: basic methods and logic for exp/key manipulation
 * - ADDED: {@link MAGPIE.KEY.EMOTE.INDEX.meta}
 * - ADDED: {@link MAGPIE_SYMBOL.meta}
 * - FIXED: key handling and database calls
 * 
 * @version 0.21.11 2026 05 12
 * - ADDED: physics new method .rotorFromFrame and .rotorSlerp
 * - FIXED: physics.clampToGround jittery Og output due to contradicting rotor maths
 * - FIXED: physics.getAt braking magnitude decreasing exponentially resulting in inability to achieve Vspeed 0 in a timely manner
 * - FIXED: physics.getATpR incorrectly calculating Oerror
 * - FIXED: entity.clampToGround incorrectly clamping A and R when it should only be clamping P, O, and V
 * 
 * @version 0.21.8 2026 05 11
 * - FIXED: physics.getAt has no cruise tolerance, causing jittering of 
 * 	acceleration to constantly match the cruise speed
 * - FIXED: entity.updatePhysics infinite getAt due to no cutoff dV
 * - FIXED: entity.updatePhysics incorrectly applying vector deltas
 * - FIXED: physics._emote_seekTarget incorrectly passing options?.tolerance instead of options
 * - FIXED: runtime refresh incorrectly ticking layers
 * - FIXED: hive refresh incorrectly ticking entities, causing invalid physics updates
 * - FIXED: hive standard layer incorrectly treated as remote
 * 
 * @version 0.21.5 2026 05 10
 * - FIXED: a number of typos and logic bugs in entity.refresh, states, and 
 * 	emotes related to processing exp
 * 
 * @version 0.21.4 2026 05 09
 * - ADDED: hive refresh fully restored
 * - ADDED: hive.move 
 * - ADDED: database_worker dropTable and addColumnToTable methods
 * - FIXED: database tables foreign keys not properly setup
 * - FIXED: database tables fields not properly setup
 * - FIXED: SERVER.js handler not type-checking, causing a commented-out playerHandler.js to crash the boot
 * - FIXED: unnecessary "zod" dependency mistakenly added by ESlint
 * - FIXED: playerHandler.js put on stand-by
 * 
 * @version 0.20.9 2026 05 08
 * - ADDED: database multi-entity save transaction
 * - FIXED: HIVE kick typo
 * - FIXED: HIVE hosting methods not setup for hybrid direct/remote hosting
 * - FIXED: Entity.setup of dummy slots for layer 0/1 causing errors
 * - FIXED: Entity hive getters invalid methods
 * - FIXED: Entity refresh bugs
 * 
 * @version 0.20.8 2026 05 06
 * - ADDED: database_worker.js relations support 
 * - ADDED: MAGPIE_EMOTE database fetch methods 
 * 
 * @version 0.20.7 2026 05 05
 * - ADDED: MAGPIE_EXP, and EXP_KEYS tables to setup
 * - ADDED: relational tables support for database_worker.createTable
 * 
 * @version 0.20.6 2026 05 03
 * - TWEAKED: MAGPIE_ENTITY restructured for efficiency
 * - TWEAKED: reviver/replacer "@" swapped for "_firmware"
 * - FIXED: DATABASE prepareEntity not working due to lacking a return
 * 
 * @version 0.20.5 2026 05 02
 * - ADDED: METASTATE clock back online
 * - ADDED: ENTITY back online
 * - ADDED: DATABASE, HIVE, and METASTATE back online
 * - FIXED: RUNTIME unable to complete loop
 * 
 * @version 0.20.2 2026 04 30
 * - ADDED: MAGPIE_RUNTIME._memoryUsage() method
 * - FIXED: REPL.start({terminal: true}) might be causing memory leaks
 * - FIXED: invalid 0.19.3 MAGPIE_PHYSICS import in system.js
 * - FIXED: orphaned logging methods called in system.js 
 * 
 * @version 0.20.0 2026 04 25
 * - TWEAKED: new project structure from scratch
 * 
 * @version 0.19.2 2026 04 20
 * - FIXED: MAGPIE_ENTITY.refresh() unable to process multiple exps and use STM/LTM 
 * - TWEAKED: folder restructure with class decomposition in ./core/
 * - index.js (this file)
 * - system.js {@link MAGPIE_SYSTEM}
 * - component.js {@link MAGPIE_COMPONENT}
 * - entity.js {@link MAGPIE_ENTITY}
 * - player.js {@link MAGPIE_PLAYER}
 * - key.js {@link MAGPIE_KEY}
 * - class.js {@link MAGPIE.REGISTRY}
 * 
 * @version 0.19.1 2026 04 19
 * - TWEAKED: MAGPIE_ENTITY overhaul
 * 
 * @version 0.19.0 2026 04 14
 * - TWEAKED: few tweaks
 * 
 * @version 0.18.9 2026 03 25
 * 
 * @version 0.18.8 2026 03 19
 * - ADDED: SYSTEM.Utility.printETA(s)
 * - ADDED: ENTITY.refresh dt overflow protection
 * - ADDED: ENTITY.refresh dt overflow protection automatically attempt to sync metadate by requesting HIVE layer promotion
 * - FIXED: MAGPIE_SERVER.error unreadable format
 * - FIXED: ENTITY.refresh dt overflow nested bugs  leading up to HIVE.reqProm
 * - FIXED: printETA minutes not % 60, and hours not % 24
 * 
 * @version 0.18.4 2026 03 17
 * - ADDED: Database sitrep during boot
 * 
 * @version 0.18.3 2026 03 16
 * - FIXED: incongruence with "timestamp" and "CTZ"; timestamp must be a type Number of either Date.now() or equivalent; CTZ is a type String
 * - FIXED: multiple uses of "timestamp" as a "fake" Number for calculations, resulting in inaccurate data
 * - FIXED: ENTITY.refresh calculating its "dt" from real timestamp, resulting in inaccurate intervals and dt spikes due to time lag
 * - FIXED: entity refresh log bugs preventing correct application of forces
 * 
 * @version 0.18.0 2026 03 13
 * - ADDED: helper methods for MAGPIE_ENTITY to get/set POVART elements
 * - FIXED: basic entity refresh and physics loop failing
 * 
 * @version 0.17.18 2026 03 12
 * - FIXED: overhauled entity refresh and update loop
 * 
 * @version 0.17.17 2026 03 11
 * - FIXED: various typos and syntax errors as well as returning null instead of proper types
 * 
 * @version 0.17.16 2026 03 10
 * - FIXED: endless loop in MAGPIE_HIVE.save() due to "i < keys" instead of "i < count"
 * - FIXED: MAGPIE_EMOTE.setup() triggers circular dependency warning due to trying to load SERVER.js exports before being initialized
 * - FIXED: PHYSICS.validate(POVART) check for Object.prototype.toString.call() is "Float64Arrat" instead of "[object Float64Array]"
 * - FIXED: unable to HIVEsave any other type of entity other than default
 * - FIXED: {@link MAGPIE_SERVER.error} not logging error.stack
 * - FIXED: few bugs with typos. CTRL+F verison for details
 * 
 * @version 0.17.10 2026 03 09
 * - FIXED: few bugs with typos and invalid return statements. CTRL+F version for details
 * 
 * @version 0.17.9 2026 03 08
 * - FIXED: VSCode Remote SSH connection slow and draining excessively on VM performance
 * - FIXED: client relying on development-domain (localhost)
 * - FIXED: development vs production environment conficts
 * - FIXED: unable to save Map objects to database due to JSON.stringify limitations
 * - FIXED: MAGPIE_ENTITY not setting up properly due to malformed setupmethods
 * 
 * @version 0.17.5 2026 03 07
 * - ADDED: {@link MAGPIE_SERVER.CLI} cli-progress bar to reduce logs bloat
 * - FIXED: MAGPIE_DATE.leapYear() is not a function => should be .leapDay()
 * - FIXED: MAGPIE_METASTATE and MAGPIE_DATE decoupled accidentally by 0.17.2 tweaking of runtime logic
 * - FIXED: server version not updated
 * 
 * @version 0.17.2 2026 03 06
 * - ADDED: Google Cloud server compute instance and connected it to project MAGPIE 
 * - ADDED: configuration to run DuckDNS subdomain 
 * - FIXED: git repo running behind and having branch issues
 * - FIXED: DATABASE methods incorrectly setup for async calls by client systems
 * - FIXED: MAGPIE_HIVE lacking initialization
 * 
 * @version 0.17.1 2026 03 05
 * - ADDED: worker_threads and web worker
 * - TWEAKED: MAGPIE_SERVER.error message handling for improved readability of errors 
 * - FIXED: version not correctly showing up as M.m.p due to new number[] format
 * - FIXED: version saving broken and breaking the entire METASTATE revival process
 * @version 0.17.0 2026 03 02 
 * - ADDED: complete rewrite
 * - ADDED: MAGPIE_HIVE for MAGPIE_ENTITY handling
 * - TWEAKED: removed MAGPIE_LOG
 * - TWEAKED: rearranged MAGPIE_RUNTIME for systems only
 * @version 0.16.4 2026 02 28
 * - TWEAKED: entity.update logic conformity with v0.4.3 MAGPIE_PHYSICS.js
 * - FIXED: various typos, context errors, and structural weaknesses
 * - FIXED: entity.update adds dA and dT to A0 and A1 when it's supposed to be the processInput's job to do that.
 * @version 0.16.3 2026 02 27
 * - TWEAKED: conformity update with v0.6.6 MAGPIE_SERVER.js and v0.4.2 MAGPIE_PHYSICS.js
 * - FIXED: RUNTIME.kick not kicking properly
 * @version 0.16.2 2026 02 26
 * - ADDED: RUNTIME.refreshGuest wrapper to handle server-side logic
 * - TWEAKED: re-introduced the "@" hydration method from RMMZ JsonEx by leveraging JSON.parse reviver and JSON.stringify replacer
 * - FIXED: ENTITY.refresh unable to processInput due to incorrect parameter defaults
 * - FIXED: RUNTIME.hosting and kicking incomplete logic
 * 
 * @version 0.16.1 2026 02 24
 * - TWEAKED: conformity update with v0.4.0 MAGPIE_PHYSICS.js
 * - ADDED: MAGPIE_EXP prototype
 * - FIXED: MAGPIE.KEY.PHYSICS.POVART using deprecated definitions
 * 
 * @version 0.16.0 2026 02 21
 * - ADDED: MAGPIE_DATE
 * - FIXED: MAGPIE_DATE.ultraTICK unable to parse months.days
 * 
 * @version 0.15.0 2026 02 18
 * - TWEAKED: integrated MAGPIE_SERVER
 * 
 * @version 0.14.0 2026 02 17
 * - TWEAKED: complete overhaul to decouple MAGPIE structure from RMMZ
 * - NEW: MAGPIE_MZ.js to handle RMMZ plugin integration
 * - NEW: MAGPIE_SYSTEM.login() to let MAGPIE_RUNTIME handle systems as 
 *   guests
 * 
 * @version 0.13.1 2026 02 15
 * - FIXED: now() not in MAGPIE_SYSTEM prototype, causing cascading issues in inheritance
 * 
 * @version 0.13.0 2026 02 04
 * - complete rewrite
 * - project ADELE integration
 * - GEOTAC design integration
 * - ECS/OOP hybrid
 * - nwjs standalone compatibility
 * 
 * @version 0.12.0 2025 12 25
 * - major overhaul
 * 
 * @version 0.11.2 2025 11 01
 * - fixed: MAGPIE_Runtime guest hosting and system refresh not configured properly
 * 
 * @version 0.11.1 2025 10 30
 * - fixed MAGPIE_Log only logging playtime data
 * - added MAGPIE_Log compatibility with DateTime System
 * 
 * @version 0.11.0 2025 09 25
 * - MAGPIE_Commodity and MAGPIE_Entity integration
 * 
 * @version 0.10.0 2025 08 28
 * - migrated MAGPIE_MCON to MAGPIE_CBE
 * - MAGPIE_Runtime bugfixes and consolidation
 * 
 * @version 0.9.1 2025 08 27
 * - MAGPIE_EntityDatabase update and conformity overhaul
 * 
 * @version 0.9.0 2025 08 25
 * - SYS overhaul with runtime prototypes and new structure
 * - NEW: Resource and Entity classes + databases framework
 * - NEW: Magpayan language initial build
 * 
 * @version 0.8.0 2025 08 21
 * - HIMS overhaul
 * 
 * @version 0.7.1 2025 08 14 
 * - MAGPIE.run refresh loop bugfix: _guests refresh won't accept null causing catastrophic error
 * 
 * @version 0.7.0 2025 07 31 
 * - plugin suite overhaul
 * 
 * @version 0.6.0 2025 07 26 
 * - plugin rewrite
 * 
 * @version 0.5.2 
 * - plugin cleanup (removed Plugin Manager section)
 * 
 * @version 0.5.1 
 * - fixed: HIMS and MAGPIE code still in ShelderEvo_Core.js
 * 
 * @version 0.5.0 
 * - added utilities and HIMS framework
 * 
 * @version 0.4.0 
 * - restructuring
 * 
 * @version v0.3.0 
 * - added commodities and installation framework
 * 
 * @version 0.2.0 
 * - added basic functionality
 * 
 * @version 0.1.0 
 * - initial build
 * ------------------------------------------------------------------------
 * 
 * 
 */
//========================================================================
// #region - META
//========================================================================
class MAGPIE
{
    //
}
MAGPIE.meta = {
    name: "M.A.G.P.I.E.",
    desc: "(M)odular (A)lgorithmic (G)eneral-(P)urpose (I)ntelligence (E)ngine",
    version: [0,39,0],
    firmwareName: "MAGPIE",
    firmwareDate: "20260611"
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - KEY
//========================================================================
MAGPIE.KEY = {}
MAGPIE.KEY.meta = {
    name: "M.A.G.P.I.E. semantic key dictionary",
    desc: "",
    firmwareName: "MAGPIE_KEY"
}
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Config
//------------------------------------------------------------------------
MAGPIE.config = require("../config/server_config")
MAGPIE.KEY.NODE_ENV = MAGPIE.config.NODE_ENV;
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Server
//------------------------------------------------------------------------
MAGPIE.KEY.SERVER = {}
MAGPIE.KEY.SERVER.DOMAIN = MAGPIE.config.domain
MAGPIE.KEY.SERVER.JWT_SECRET = MAGPIE.config.jwtSecret
MAGPIE.KEY.SERVER.PORT = MAGPIE.config.PORT
/** @desc 20 max login attemps within cooldown window */
MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS = 20
/** @desc 15m login attempts cooldown window*/
MAGPIE.KEY.SERVER.LOGIN_COOLDOWN = 15
/** @type {String} domain without "http/https://" */
MAGPIE.KEY.SERVER.DOMAIN_STRIPPED = MAGPIE.config.domain.slice(MAGPIE.config.domain.indexOf(":") + 3);
/** 
 * @desc admin email route via 
 * {@link [Cloudflare](https://dash.cloudflare.com/f9be63832257af6f7644accd541a4bca/shelderevolution.org/email/routing/routes)} 
 * */
MAGPIE.KEY.SERVER.ADMIN_EMAIL = `admin@${MAGPIE.KEY.SERVER.DOMAIN_STRIPPED}`
MAGPIE.KEY.SERVER.NO_REPLY = `noreply@${MAGPIE.KEY.SERVER.DOMAIN_STRIPPED}`
/**
 * @desc server preset messages 
 * 
 */
MAGPIE.KEY.SERVER.MESSAGE = {}
MAGPIE.KEY.SERVER.MESSAGE.BOOT = "[BOOT SEQUENCE]"
MAGPIE.KEY.SERVER.MESSAGE.BOOTED = "SERVER ONLINE listening on: "
MAGPIE.KEY.SERVER.MESSAGE.INTERNAL_ERROR = `<h1>Internal server error</h1>
    <p>Please, try again later.</p>
    <p>If you see this persist for over 1 hour, please, report it to [${MAGPIE.KEY.SERVER.ADMIN_EMAIL}].</p>`
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Http
//------------------------------------------------------------------------
MAGPIE.KEY.HTTP = {};
/**
 * @desc Successful
 * @desc In simple terms, the HTTP status 200 response code means that a 
 * server has successfully processed a request. Likewise, codes in the 
 * 400s and 500s mean a request has failed.
 */
MAGPIE.KEY.HTTP.STATUS_200 = {
	code: 200,
	message: "Successful",
	desc: `In simple terms, the HTTP status 200 response code means 
	that a server has successfully processed a request. Likewise, 
	codes in the 400s and 500s mean a request has failed.`
}
/**
 * @desc Bad Request
 * @desc The 400 (Bad Request) status code indicates that the server 
 * cannot or will not process the request due to something that is 
 * perceived to be a client error. In response to an invalid request, 
 * the server should issue the exact 4xx code in the case of an 
 * unsuccessful request.
 */
MAGPIE.KEY.HTTP.STATUS_400 = {
	code: 400,
	message: "Bad Request",
	desc: `The 400 (Bad Request) status code indicates that the server 
	cannot or will not process the request due to something that is 
	perceived to be a client error. In response to an invalid request, 
	the server should issue the exact 4xx code in the case of an 
	unsuccessful request.`
}
/**
 * @desc Unauthorized
 * @desc The HTTP 401 Unauthorized client error response status 
 * code indicates that a request was not successful because it lacks 
 * valid authentication credentials for the requested resource.
 */
MAGPIE.KEY.HTTP.STATUS_401 = {
	code: 401,
	message: "Unauthorized",
	desc: `The  HTTP 401 Unauthorized client error response status code 
	indicates that a request was not successful because it lacks valid 
	authentication credentials for the requested resource.`
}
/**
 * @desc "Forbidden"
 * @desc A 403 'Forbidden' error is an HTTP status code indicating that 
 * the server understood the request but refuses to authorize it, 
 * usually due to insufficient permissions or intentional blocking. 
 * It means the site is restricted or the user lacks access rights, 
 * making repeated attempts without modification futile.
 */
MAGPIE.KEY.HTTP.STATUS_403 = {
	code: 403,
	message: "Forbidden", 
	desc: "A 403 'Forbidden' error is an HTTP status code indicating "
		+ "that the server understood the request but refuses to authorize "
		+ "it, usually due to insufficient permissions or intentional "
		+ "blocking. It means the site is restricted or the user lacks "
		+ "access rights, making repeated attempts without modification futile."
};
/**
 * @desc "Conflict"
 * @desc The standard HTTP status code for attempting to create a resource 
 * that already exists (causing a unique constraint violation in your 
 * database) is 409 Conflict. Using 409 tells the client specifically 
 * that the server understands the request, but it cannot be completed 
 * due to an asset collision.
 */
MAGPIE.KEY.HTTP.STATUS_409 = {
	code: 409,
	message: "Conflict",
	desc: "The standard HTTP status code for attempting to create a resource "
		+ "that already exists (causing a unique constraint violation in your "
		+ "database) is 409 Conflict. Using 409 tells the client specifically "
		+ "that the server understands the request, but it cannot be completed "
		+ "due to an asset collision."
}
/**
 * @desc Internal Server Error
 * @desc An HTTP 500 status code (Internal Server Error) indicates 
 * that the server encountered an unexpected condition that prevented 
 * it from fulfilling the request.
 */
MAGPIE.KEY.HTTP.STATUS_500 = {
	code: 500,
	message: "Internal Server Error",
	desc: `An HTTP 500 status code (Internal Server Error) indicates 
	that the server encountered an unexpected condition that prevented 
	it from fulfilling the request.`
}
/**
 * @desc "too many requests"
 * @desc The HTTP 429 "Too Many Requests" status code indicates the user 
 * has sent too many requests to a server within a given timeframe, 
 * triggering rate limiting. This client-side error protects servers 
 * from abuse, such as DDoS attacks, scrapers, or excessive bot activity. 
 * It is commonly resolved by waiting, reducing request frequency, or 
 * checking API limits.
 */
MAGPIE.KEY.HTTP.STATUS_429 = {
	code: 429,
	message: "Too many requests!",
	desc: "The HTTP 429 'Too Many Requests' status code indicates the user "
		+ "has sent too many requests to a server within a given timeframe, "
		+ "triggering rate limiting. This client-side error protects servers "
		+ "from abuse, such as DDoS attacks, scrapers, or excessive bot activity. "
		+ "It is commonly resolved by waiting, reducing request frequency, "
		+ "or checking API limits."
};
// #endregion
//------------------------------------------------------------------------
/**
 * @name semantics
 * @desc component of {@link MAGPIE.KEY}
 * @desc system of {@link MAGPIE}
 * @typedef {Number} keyID
 * @typedef {{
 * type: Number,
 * label: String,
 * origin: keyID,
 * component: keyID,
 * compound: keyID,
 * legacy: keyID
 * }} key_data
 * @typedef {Number} index array[index]
 * @typedef {Enumerator<Number>} key_type
 * 
 */
//------------------------------------------------------------------------
// #region > Semantics
//------------------------------------------------------------------------
MAGPIE.KEY.SEMANTICS = {};
MAGPIE.KEY.SEMANTICS.meta = {
    name: "M.A.G.P.I.E. semantic keys"
}
/** @desc {@link MAGPIE.KEY.meta} */
MAGPIE.KEY.TYPE = {}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * @typedef {index} stamina_index entity.fitness[stamina_index] ({@link MAGPIE.KEY.FITNESS.STAMINA})
 * @typedef {index} state_index entity.fitness[2 + size * 2 + index]
 */
//------------------------------------------------------------------------
// #region > Fitness
//------------------------------------------------------------------------
MAGPIE.KEY.FITNESS = {}
MAGPIE.KEY.FITNESS.STAMINA = 6
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = { MAGPIE }
/**
 * 
 * @desc back to {@link MAGPIE}
 *
 */
//========================================================================
// END OF FILE
//========================================================================