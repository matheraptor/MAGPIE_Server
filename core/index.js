//========================================================================
// #region - META
//========================================================================
/**
 * @namespace MAGPIE
 * @author Matheraptor
 * @licence CC
 * 
 * @version 0.22.11
 * 
 * @depdendencies 
 * - Node.js 
 * - express 
 * - JWT 
 * - Socket.io 
 * - better-sqlite3 
 * - repl 
 * - jsonwebtoken 
 * - cli-spinner
 * ------------------------------------------------------------------------
 * @changelog 20260302 {@link MAGPIE.meta.version}
 * 
 * @version 0.22.13 2026 05 16
 * - ADDED: server instance background logger
 * - ADDED: Termius SSH ID
 * - ADDED: nGix inverse proxy and npm extension
 * - TWEAKED: improved RUNTIME.refresh ticking allows for layer-specific
 * 		frame-count
 * - TWEAKED: wrapped entity exp handling to isolate future improvements
 * - TWEAKED: changing exp array handling from a dynamic/shift-push (O(n)) to 
 * 		static/index_accumulator (O(1)) 
 * - FIXED: MAGPIE_KEY.setup incorrectly indexing VSpeeds
 * - FIXED: MAGPIE_SYMBOL.getVspeeds incorrectly mapping Vspeeds
 * - FIXED: changing exp handling broke some methods
 * 
 * @version 0.22.11 2026 05 15
 * - ADDED: DATABASE.pragma cache_size -64000 to mitigate the 
 * 		read flooding
 * - ADDED: DATABASE.helpers for symbol recipes/components
 * - ADDED: MAGPIE.KEYS for requirements, compounds, recipes, components, 
 * 		and stats 
 * - ADDED: RUNTIME.refresh clamp catch-up loop to prevent execution spikes
 * 		if(this._base > 100) this._base = 100;
 * - ADDED: MAGPIE_KEY.setup routine to index the axiom keys
 * - TWEAKED: MAGPIE_SYMBOL.STATS now includes requirements/compounds
 * - TWEAKED: MAGPIE_SYMBOL .requirementID and .compoundID deprecated
 * - TWEAKED: DATABASE.getExpKeys using more efficient sql
 * - FIXED: DATABASE.saveSymbolSync iterating through inexistent symbol's
 * 		.requirements and .compounds 
 * - FIXED: DATABASE.getRow passing floats instead of integers, causing
 * 		unnecessary read overhead
 * - FIXED: catastrophic bug "return" within for loop in HIVE .tick_buffer 
 * 		and .tick_remote causing subsequent entities in loop to be dropped
 * - FIXED: RUNTIME.refresh while(this._base > 1) race condition
 * - FIXED: RUNTIME.refresh not async preventing safe database execution
 * - FIXED: DATABASE.saveSymbol typo
 * - FIXED: SYMBOL.STATS inconsistent key/value pair
 * - FIXED: MAGPIE.KEY.INDEX.VSPEEDS incorrectly initializing, causing
 * 		SYMBOL.getVspeeds to fail
 * - FIXED: SERVER.BOOT.shutdown hanging on incorrectly defined async 
 * 		behavior
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
 * - FIXED: physics.clampToGround jittery Og output due to contradicting 
 * 		rotor maths
 * - FIXED: physics.getAt braking magnitude decreasing exponentially resulting
 * 		in inability to achieve Vspeed 0 in a timely manner
 * - FIXED: physics.getATpR incorrectly calculating Oerror
 * - FIXED: entity.clampToGround incorrectly clamping A and R when it should
 * 		only be clamping P, O, and V
 * 
 * @version 0.21.8 2026 05 11
 * - FIXED: physics.getAt has no cruise tolerance, causing jittering of 
 * 	acceleration to constantly match the cruise speed
 * - FIXED: entity.updatePhysics infinite getAt due to no cutoff dV
 * - FIXED: entity.updatePhysics incorrectly applying vector deltas
 * - FIXED: physics._emote_seekTarget incorrectly passing options?.tolerance
 * 		instead of options
 * - FIXED: runtime refresh incorrectly ticking layers
 * - FIXED: hive refresh incorrectly ticking entities, causing invalid 
 * 		physics updates
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
 * - FIXED: SERVER.js handler not type-checking, causing a commented-out 
 * 		playerHandler.js to crash the boot
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
 * - FIXED: MAGPIE_ENTITY.refresh() unable to process multiple exps and use
 * 		STM/LTM 
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
 * - ADDED: ENTITY.refresh dt overflow protection automatically attempts
	to sync metadate by requesting HIVE layer promotion
 * - FIXED: MAGPIE_SERVER.error unreadable format
 * - FIXED: ENTITY.refresh dt overflow nested bugs  leading up
	to HIVE.reqProm
 * - FIXED: printETA minutes not % 60, and hours not % 24
 * 
 * @version 0.18.4 2026 03 17
 * - ADDED: Database sitrep during boot
 * 
 * @version 0.18.3 2026 03 16
 * - FIXED: incongruence with "timestamp" and "CTZ"; timestamp must be a
 * 		type Number of either Date.now() or equivalent; CTZ is a type String
 * - FIXED: multiple uses of "timestamp" as a "fake" Number for calculations,
 * 		resulting in inaccurate data
 * - FIXED: ENTITY.refresh calculating its "dt" from real timestamp, resulting
 * 		in inaccurate intervals and dt spikes due to time lag
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
 * - FIXED: various typos and syntax errors as well as returning null instead
 * 		of proper types
 * 
 * @version 0.17.16 2026 03 10
 * - FIXED: endless loop in MAGPIE_HIVE.save() due to "i < keys" instead of
 * 		"i < count"
 * - FIXED: MAGPIE_EMOTE.setup() triggers circular dependency warning due to
 * 		trying to load SERVER.js exports before being initialized
 * - FIXED: PHYSICS.validate(POVART) check for Object.prototype.toString.call()
 * 		is "Float64Arrat" instead of "[object Float64Array]"
 * - FIXED: unable to HIVEsave any other type of entity other than default
 * - FIXED: {@link MAGPIE_SERVER.error} not logging error.stack
 * - FIXED: few bugs with typos. CTRL+F verison for details
 * 
 * @version 0.17.10 2026 03 09
 * - FIXED: few bugs with typos and invalid return statements. CTRL+F version
 * 		for details
 * 
 * @version 0.17.9 2026 03 08
 * - FIXED: VSCode Remote SSH connection slow and draining excessively on
 * 		VM performance
 * - FIXED: client relying on development-domain (localhost)
 * - FIXED: development vs production environment conficts
 * - FIXED: unable to save Map objects to database due to JSON.stringify
 * 		limitations
 * - FIXED: MAGPIE_ENTITY not setting up properly due to malformed setup
 * 		methods
 * 
 * @version 0.17.5 2026 03 07
 * - ADDED: {@link MAGPIE_SERVER.CLI} cli-progress bar to reduce logs bloat
 * - FIXED: MAGPIE_DATE.leapYear() is not a function => should be .leapDay()
 * - FIXED: MAGPIE_METASTATE and MAGPIE_DATE decoupled accidentally by 0.17.2
 * 		tweaking of runtime logic
 * - FIXED: server version not updated
 * 
 * @version 0.17.2 2026 03 06
 * - ADDED: Google Cloud server compute instance {@link MAGPIE.config.instance_name}
 * 		and connected it to project MAGPIE {@link MAGPIE.config.project_id}
 * - ADDED: configuration to run DuckDNS subdomain {@link MAGPIE.config.domain}
 * - FIXED: git repo running behind and having branch issues
 * - FIXED: {@link MAGPIE_DATABASE} methods incorrectly setup for async calls by
 * 		client systems
 * - FIXED: {@link MAGPIE_HIVE} lacking initialization
 * 
 * @version 0.17.1 2026 03 05
 * - ADDED: worker_threads and {@link MAGPIE_DATABASE._worker} web worker
 * - TWEAKED: {@link MAGPIE_SERVER.error} message handling for improved 
 * 		readability of errors 
 * - FIXED: version not correctly showing up as M.m.p due to new number[]
 * 		format
 * - FIXED: version saving broken and breaking the entire METASTATE 
 * 		revival process
 * @version 0.17.0 2026 03 02 
 * - ADDED: complete rewrite
 * - ADDED: {@link MAGPIE_HIVE} for {@link MAGPIE_ENTITY}
 * - TWEAKED: removed MAGPIE_LOG
 * - TWEAKED: rearranged {@link MAGPIE_RUNTIME} for systems only
 * @version 0.16.4 2026 02 28
 * - TWEAKED: entity.update logic conformity with v0.4.3 MAGPIE_PHYSICS.js
 * - FIXED: various typos, context errors, and structural weaknesses
 * - FIXED: entity.update adds dA and dT to A0 and A1 when it's supposed
 * 		to be the processInput's job to do that.
 * @version 0.16.3 2026 02 27
 * - TWEAKED: conformity update with v0.6.6 MAGPIE_SERVER.js and
 * 		v0.4.2 MAGPIE_PHYSICS.js
 * - FIXED: RUNTIME.kick not kicking properly
 * @version 0.16.2 2026 02 26
 * - ADDED: RUNTIME.refreshGuest wrapper to handle server-side logic
 * - TWEAKED: re-introduced the "@" hydration method from RMMZ JsonEx by
 * 		leveraging JSON.parse reviver and JSON.stringify replacer
 * - FIXED: ENTITY.refresh unable to processInput due to incorrect 
 * 		parameter defaults
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
 * - FIXED: now() not in MAGPIE_SYSTEM prototype, causing cascading issues
 * in inheritance
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
 * - fixed: MAGPIE_Runtime guest hosting and system refresh not configured
 * 		properly
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
 * - MAGPIE.run refresh loop bugfix: _guests refresh won't accept null
 *   causing catastrophic error
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
 * @typedef {Object} MAGPIE
 * @type {MAGPIE}
 * @returns {new MAGPIE}
 * @property {MAGPIE_KEY}       MAGPIE.KEY      {@link MAGPIE_KEY}
 * @property {MAGPIE_SYSTEM}    MAGPIE.SYS      {@link MAGPIE_SYSTEM}
 * @property {MAGPIE_SYSTEM}    MAGPIE.DATA     {@link MAGPIE_DATA}
 * @property {MAGPIE_SYSTEM}    MAGPIE.COMP     {@link MAGPIE_COMPONENT}
 * @property {MAGPIE_SYSTEM}    MAGPIE.ENTITY   {@link MAGPIE_ENTITY}
 * @property {MAGPIE_SYSTEM}    MAGPIE.RUNTIME  {@link MAGPIE_RUNTIME}
 * @property {MAGPIE_SYSTEM}    MAGPIE.CONSOLE  {@link MAGPIE_CONSOLE}
 * @property {MAGPIE_SYSTEM}    MAGPIE.CORE     {@link MAGPIE_CORE}
 * @property {MAGPIE_SYSTEM}    MAGPIE.MCON     {@link MAGPIE_MCON}
 * @property {MAGPIE_SYSTEM}    MAGPIE.DRONE    {@link MAGPIE_DRONE}
 * @property {MAGPIE_SYSTEM}    MAGPIE.ARK      {@link MAGPIE_ARK}
 * @property {MAGPIE_SYSTEM}    MAGPIE.HIMS     {@link MAGPIE_HIMS}
 */
//========================================================================
// #endregion - 
//========================================================================





//========================================================================
//#region - CLASS
//========================================================================
class MAGPIE {
	static {
		this.meta = {
			name: "M.A.G.P.I.E",
			desc: "(M)odular (A)lgorithmic (G)eneral-(P)urpose (I)ntelligence (E)ngine",
			version: [0, 22, 12],
			firmwareName: "MAGPIE",
			firmwareDate: "20260516"
		};
	}
}

/**
 * 
 * back to {@link MAGPIE}
 */
//#endregion - CLASS
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - KEY
//========================================================================
MAGPIE.KEY = {};
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Config
//------------------------------------------------------------------------
MAGPIE.config = require("./config");
MAGPIE.KEY.NODE_ENV = MAGPIE.config.NODE_ENV;
// #endregion
//------------------------------------------------------------------------
/**
 * @name semantics
 * @desc component of {@link MAGPIE.KEY}
 * @desc system of {@link MAGPIE}
 * @typedef {Number} keyID
 * @typedef {{
 *  type: Number,
 *  label: String,
 *  origin: keyID[],
 *  component: keyID[],
 *  legacy: keyID[],
 *  compound: keyID[]
 * }} key_data
 * 
 * 
 */
//------------------------------------------------------------------------
// #region > Semantics
//------------------------------------------------------------------------
MAGPIE.KEY.SEMANTICS = {};
MAGPIE.KEY.SEMANTICS.meta = {
	firmwareName: "MAGPIE_SEMANTICS",
	name: "M.A.G.P.I.E. semantic keys"
}
/** @typedef {Enumerator<Number>} key_type */
MAGPIE.KEY.TYPE = {};
/** @type {key_type} */
MAGPIE.KEY.TYPE.AXIOM = 0;
/** @type {key_type} */
MAGPIE.KEY.TYPE.KEY = 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METAKEY = 2;
/** @type {key_type} */
MAGPIE.KEY.TYPE.SEMANTIC = 3;
/** @type {key_type} */
MAGPIE.KEY.TYPE.CONTEXT = 4;
/** @type {key_type} */
MAGPIE.KEY.TYPE.VACANT_1 = 5;
/** @type {key_type} */
MAGPIE.KEY.TYPE.EXP = 6;
/** @type {key_type} */
MAGPIE.KEY.TYPE.EMOTE = 7;
/** @type {key_type} */
MAGPIE.KEY.TYPE.TRIGGER = 8;
/** @type {key_type} */
MAGPIE.KEY.TYPE.EVAL = 9;
/** @type {key_type} */
MAGPIE.KEY.TYPE.TIME = 10;
/** @type {key_type} */
MAGPIE.KEY.TYPE.STATE = 11;
/** @type {key_type} */
MAGPIE.KEY.TYPE.TICKET = 12;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METAEXP = 20;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METATICKET = 21;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METACONTEXT = 22;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTERKEY = 30;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTERCONTEXT = 31;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTEREXP = 32;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTERTICKET = 33;
/**
 * 
 * @typedef {Enumerator<Number>} key_index
 * @typedef {import("./component").key_label} key_label
 */
/** 
 * 
 */
MAGPIE.KEY.INDEX = {};
MAGPIE.KEY.INDEX.meta = "";
/** @type {key_index} */
MAGPIE.KEY.INDEX.TEMPLATE = 0;
/** @type {key_index} */
MAGPIE.KEY.INDEX.SUBJECT = 10;
/** @type {key_index} */
MAGPIE.KEY.INDEX.OBJECT = 11;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TARGET = 12;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TRIVIAL = 13;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TIME = 14;
/** @type {key_index} */
MAGPIE.KEY.INDEX.REQUIREMENTS = 1001;
/** @type {key_index} */
MAGPIE.KEY.INDEX.COMPOUNDS = 1002;
/** @type {key_index} */
MAGPIE.KEY.INDEX.RECIPES = 1003;
/** @type {key_index} */
MAGPIE.KEY.INDEX.COMPONENTS = 1004;
/** @type {key_index} */
MAGPIE.KEY.INDEX.STATS = 1005;
/** @type {key_index} */
MAGPIE.KEY.INDEX.LENGTH = 2010;
/** @type {key_index} */
MAGPIE.KEY.INDEX.HEIGHT = 2011;
/** @type {key_index} */
MAGPIE.KEY.INDEX.WIDTH = 2012;
/** @type {key_index} */
MAGPIE.KEY.INDEX.MASSKG = 2013;
/** @type {key_index} */
MAGPIE.KEY.INDEX.DENSITY = 2014;
/** @type {key_index} */
MAGPIE.KEY.INDEX.AREA = 2020;
/** @type {key_index} */
MAGPIE.KEY.INDEX.VOLUME = 2021;
/** @type {Map<key_index, key_label>} */
MAGPIE.KEY.INDEX.VSPEEDS = new Map();
/** @type {key_index} */
MAGPIE.KEY.INDEX.VMAX = 3000;
/** @type {key_index} */
MAGPIE.KEY.INDEX.VSAFE = 3001;
/** @type {key_index} */
MAGPIE.KEY.INDEX.VCRUISE = 3002;
/** @type {key_index} */
MAGPIE.KEY.INDEX.VCREEP = 3003;
/** @type {key_index} */
MAGPIE.KEY.INDEX.VDOCK = 3004;
/** @type {key_index} */
MAGPIE.KEY.INDEX.RMAX = 4000;
/** @type {key_index} */
MAGPIE.KEY.INDEX.RSAFE = 4001;
/** @type {key_index} */
MAGPIE.KEY.INDEX.RCRUISE = 4002;
/** @type {key_index} */
MAGPIE.KEY.INDEX.RCREEP = 4003;
/** @type {key_index} */
MAGPIE.KEY.INDEX.RDOCK = 4004;
/** @type {key_index} */
MAGPIE.KEY.INDEX.AMAX = 5000;
/** @type {key_index} */
MAGPIE.KEY.INDEX.ASAFE = 5001;
/** @type {key_index} */
MAGPIE.KEY.INDEX.ACRUISE = 5002;
/** @type {key_index} */
MAGPIE.KEY.INDEX.ACREEP = 5003;
/** @type {key_index} */
MAGPIE.KEY.INDEX.ADOCK = 5004;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TMAX = 6000;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TSAFE = 6001;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TCRUISE = 6002;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TCREEP = 6003;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TDOCK = 6004;
MAGPIE.KEY.INDEX.VSPEEDS.set("start", Object.keys(MAGPIE.KEY.INDEX).indexOf("VMAX"));
MAGPIE.KEY.INDEX.VSPEEDS.set("end", Object.keys(MAGPIE.KEY.INDEX).indexOf("TDOCK"));
// #endregion
//------------------------------------------------------------------------
/**
 * @name Runtime
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Runtime
//------------------------------------------------------------------------
MAGPIE.KEY.RUNTIME = {};
MAGPIE.KEY.RUNTIME.meta = {
	firmwareName: "MAGPIE_RUNTIME",
	name: "M.A.G.P.I.E. runtime"
};
/** @type {Map<Number, {name: String, delta: Number, slots: Number}} */
MAGPIE.KEY.RUNTIME.LAYER = new Map();
MAGPIE.KEY.RUNTIME.LAYER.set(0, { name: "_GuestsBase", delta: 0.001, slots: 100 });
MAGPIE.KEY.RUNTIME.LAYER.set(1, { name: "_GuestsGame", delta: 0.016, slots: 1000 });
MAGPIE.KEY.RUNTIME.LAYER.set(2, { name: "_GuestsStandard", delta: 1, slots: 5000 });
MAGPIE.KEY.RUNTIME.LAYER.set(3, { name: "_GuestsSuper", delta: 60, slots: 10000 });
MAGPIE.KEY.RUNTIME.LAYER.set(4, { name: "_GuestsMega", delta: 60 ** 2, slots: 50000 });
MAGPIE.KEY.RUNTIME.LAYER.set(5, { name: "_GuestsUltra", delta: 60 ** 2 * 24, slots: 100000 });
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Hive
//------------------------------------------------------------------------
MAGPIE.KEY.HIVE = {};
MAGPIE.KEY.HIVE.meta = "";
/** @type {Enumerator<Number>} amount of HIVE buffer layers */
MAGPIE.KEY.HIVE.BUFFER_SIZE = 3;
/** @type {Enumerator<Number>} amount of HIVE remote layers */
MAGPIE.KEY.HIVE.REMOTE_SIZE = 3;
// #endregion
//------------------------------------------------------------------------
/**
 * @name Date
 * @desc 
 * 
 * @typedef {{
 * calendarID: Number,
 * days: Number,
 * months: {month: days<Number>},
 * weekDays: {index: String},
 * leapMonth: Number,
 * leapYear: Number,
 * dayLength: Number,
 * epochYear: Number
 * }} calendar_data
 */
//------------------------------------------------------------------------
// #region > Date
//------------------------------------------------------------------------
MAGPIE.KEY.CALENDAR = {};
/** @type {Enumerator<Number>} */
MAGPIE.KEY.CALENDAR.GREGORIAN = 0;

// #endregion
//------------------------------------------------------------------------
/**
 * @name server
 * @desc 
 * 
*/
//------------------------------------------------------------------------
// #region > Server
//------------------------------------------------------------------------
MAGPIE.KEY.SERVER = {};
MAGPIE.KEY.SERVER.DOMAIN = MAGPIE.config.domain;
MAGPIE.KEY.SERVER.JWT_SECRET = MAGPIE.config.jwtSecret;
MAGPIE.KEY.SERVER.PORT = MAGPIE.config.port;
MAGPIE.KEY.SERVER.LOGIN_COOLDOWN = 15;
MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS = 20;
MAGPIE.KEY.SERVER.MESSAGE = {};
MAGPIE.KEY.SERVER.MESSAGE.BOOT = "[BOOT SEQUENCE]";
MAGPIE.KEY.SERVER.MESSAGE.BOOTED = "SERVER ONLINE listening on: ";
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Http
//------------------------------------------------------------------------
MAGPIE.KEY.SERVER.HTTP = {};
/**
 * @desc Successful
 * @desc In simple terms, the HTTP status 200 response code means that a 
 * server has successfully processed a request. Likewise, codes in the 
 * 400s and 500s mean a request has failed.
 */
MAGPIE.KEY.SERVER.HTTP.STATUS_200 = {
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
MAGPIE.KEY.SERVER.HTTP.STATUS_400 = {
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
MAGPIE.KEY.SERVER.HTTP.STATUS_401 = {
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
MAGPIE.KEY.SERVER.HTTP.STATUS_403 = {
	message: "Forbidden", 
	desc: "A 403 'Forbidden' error is an HTTP status code indicating "
		+ "that the server understood the request but refuses to authorize "
		+ "it, usually due to insufficient permissions or intentional "
		+ "blocking. It means the site is restricted or the user lacks "
		+ "access rights, making repeated attempts without modification futile."
};
/**
 * @desc Internal Server Error
 * @desc An HTTP 500 status code (Internal Server Error) indicates 
 * that the server encountered an unexpected condition that prevented 
 * it from fulfilling the request.
 */
MAGPIE.KEY.SERVER.HTTP.STATUS_500 = {
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
MAGPIE.KEY.SERVER.HTTP.STATUS_429 = {
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
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Entity
//------------------------------------------------------------------------
MAGPIE.KEY.ENTITY = {};
MAGPIE.KEY.ENTITY.TYPE = require("../data/entity_types")
// #endregion
//------------------------------------------------------------------------
/**
 * @name PHYSICS
 * @desc 
 * 
 * 
 */
//------------------------------------------------------------------------
// #region > Physics
//------------------------------------------------------------------------
MAGPIE.KEY.PHYSICS = {};
/**
 * @typedef {Number} duration in s
 * @typedef {Number} distance in m
 * @typedef {Number} volume in L
 * @typedef {Number} mass in kg
 * @typedef {Number} velocity in m/s
 * @typedef {Number} acceleration in m/s²
 * @typedef {Number} index
 * @typedef {[x<Number>, y<Number>, z<Number>]} vector3 3D vector [x,y,z]
 * @typedef {[yz<Number>, xz<Number>, xy<Number>]} bivector 3D bivector [yz, xz, xy]
 * @typedef {[yz<Number>, xz<Number>, xy<Number>, w<Number>]} rotor
 * @typedef {Number} theta (θ) angular displacement in rad
 * @typedef {Number} omega (ω) angular velocity in rad/s
 * @typedef {Number} alpha (α) angular acceleration in rad/s²
 * @typedef {Number} torque (𝜏) in N*m
 * @typedef {Number} MoI moment of inertia (I) in kg*m²
 * @typedef {Number} electric_current in Ampere (A)
 * @typedef {Number} temperature in Kelvin (K)
 * @typedef {Number} substance Mole (mol)
 * @typedef {Number} luminosity Candela (cd)
 * @typedef {Number} force in Newton (N) = kg * m/s²
 * @typedef {Number} energy in Joule (J) = N * m / kg * m²/s²
 * @typedef {Number} power in Watt (W) = J/s / kg * m²/s³
 * @typedef {Number} pressure in Pascal (Pa) = N/m² or kg/(m*s²)
 * @typedef {Number} frequency in Hertz (Hz) = 1/s
 * @typedef {Number} voltage in Volt (V) = kg * m²/(s³ * A)
 * @typedef {Number} angle_rad in radians (rad) 0 to PI
 * @typedef {Number} angle_deg in degrees (°) 0 to 360
 * @typedef {Number} ratio variable * ratio<0 to 1>
 * @typedef {Number} coefficient variable * coefficient
 * @typedef {Number} percentage %
 * @typedef {Number} density kg/L
 * @typedef {Number} atmo_density atmospheric density = kg/m³ 
 * @typedef {Number} epoch_real_s time in s since epoch J2000
 */
MAGPIE.KEY.PHYSICS.meta = {};
/**
 * @desc reference plane
 * @type {vector3} [x,y,z]
 */
MAGPIE.KEY.PHYSICS.K = [0,0,1];
/**
 * @desc gravitational constant.
 * @desc Multiplied by celestial body's mass to find 'mu' (μ) 
 * @desc {@link MAGPIE.KEY.ORBIT.MU}
 * @type {mass}
 */
MAGPIE.KEY.PHYSICS.G = 6.67430e-11;
/**
 * @desc Astronomical unit based on {@link MAGPIE.KEY.PHYSICS.EARTH.A}
 * @type {distance}
 */
MAGPIE.KEY.PHYSICS.AU = 149597870700;
/**
 * @desc Nautical Mile in meters
 * @type {distance}
 */
MAGPIE.KEY.PHYSICS.NM = 1852;
/**
 * @name Terra
 * @desc 
 */
MAGPIE.KEY.PHYSICS.EARTH = {};
/**
 * @desc celestial body radius in meters
 * @desc standardized for obloid geodetic calculations
 * @type {distance}
 */
MAGPIE.KEY.PHYSICS.EARTH.RADIUS = 6371008;
/**
 * @desc celestial body mass in kg
 * @type {mass}
 */
MAGPIE.KEY.PHYSICS.EARTH.MASS = 5.90034e24;
/**
 * @desc Earth's equatorial radius in meters
 * @type {distance}
 */
MAGPIE.KEY.PHYSICS.EARTH.R = 6378137;
/**
 * @desc standard Earth's gravity in m/s²
 * @desc also the reference for {@link MAGPIE.KEY.PHYSICS.FORCES.FG}
 * @type {acceleration}
 */
MAGPIE.KEY.PHYSICS.EARTH.G = 9.81;
/**@type {velocity} @desc Escape Velocity (Vₑ) */
MAGPIE.KEY.PHYSICS.EARTH.VE = 11160;
/** @type {angle_deg} @desc Axial tilt */
MAGPIE.KEY.PHYSICS.EARTH.AXIAL = 23.44;
/** @type {import("./system").hour} @desc rotation period (h) */
MAGPIE.KEY.PHYSICS.EARTH.ROTATION = 23.9334;
/** @type {luminosity} @desc Albedo */
MAGPIE.KEY.PHYSICS.EARTH.ALBEDO = 0.306;
/** @type {temperature} @desc surface temperature (K) */
MAGPIE.KEY.PHYSICS.EARTH.SURF_TEMP = 287;
/** @type {ratio} @desc eccentricity */
MAGPIE.KEY.PHYSICS.EARTH.E = 0.0167;
/** @type {percentage} @desc % atmospheric O₂*/
MAGPIE.KEY.PHYSICS.EARTH.ATMO_O2 = 20.99;
/** @type {percentage} @desc % atmospheric CO₂ */
MAGPIE.KEY.PHYSICS.EARTH.ATMO_CO2 = 0.04;
/** @type {percentage} @desc % atmospheric Ar */
MAGPIE.KEY.PHYSICS.EARTH.ATMO_AR = 0.93;
/** @type {percentage} @desc % atmospheric N₂ */
MAGPIE.KEY.PHYSICS.EARTH.ATMO_N2 = 78.04;
/** @type {density} @desc atmospheric density = kg/m³ */
MAGPIE.KEY.PHYSICS.EARTH.ATD = 1.221;
/** @type {pressure * 1000} @desc 1 atmo, in kPa */
MAGPIE.KEY.PHYSICS.EARTH.ATMO = 101.3;
MAGPIE.KEY.PHYSICS.EARTH.J2000 = (new Date("2000-01-01T11:58:55.816Z")).getTime()
MAGPIE.KEY.PHYSICS.EARTH.ORBIT_DATA = {
		a: MAGPIE.KEY.PHYSICS.AU,
		e: MAGPIE.KEY.PHYSICS.EARTH.E,
		i: 0,
		raan: 0,
		aop: 102.94,
		nu: 65.4,
		epoch: MAGPIE.KEY.PHYSICS.EARTH.J2000,
		M0: 357.5171
	};
MAGPIE.KEY.PHYSICS.EARTH.DATA = {
	name: "Terra",
	type: MAGPIE.KEY.ENTITY.TYPE.PLANET_TERRESTRIAL,
	orbit: MAGPIE.KEY.PHYSICS.EARTH.ORBIT_DATA
};
/**
 * @desc "e" is Euler's number, a mathematical constant approximately 
 * equal to 2.71828. Nature's Constant: Just as π is the constant for circles, 
 * e is the fundamental constant for growth and change. We can
 * consider it the "S-curve-builder".
 * @desc used in:
 * - {@link MAGPIE_ENTITY.growth}
 */
MAGPIE.KEY.PHYSICS.EULER = 2.71828;
// #endregion
//------------------------------------------------------------------------
/**
 * @name Geodetic
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Geodetic
//------------------------------------------------------------------------
/**
 * component of {@link MAGPIE_GEOGRAPHY}
 * 
 */
MAGPIE.KEY.GEODETIC = {};
MAGPIE.KEY.GEODETIC.DEFAULT = {
	lat: NaN, 
	lon: NaN, 
	ASL: NaN,
	geog: [NaN], 
	forces: [NaN]
}
/**
 * @component of {@link MAGPIE_ENTITY}
 * @sister of {@link MAGPIE.KEY.STATS}
 * @sister of {@link MAGPIE_PHYSICS.aero}
 */
MAGPIE.KEY.PHYSICS.FORCES = {};
/** @type {index} local gravity */
MAGPIE.KEY.PHYSICS.FORCES.FG = 0;
/** @type {index} friction */
MAGPIE.KEY.PHYSICS.FORCES.FF = MAGPIE.KEY.PHYSICS.FORCES.FG + 1
/** @type {index} drag */
MAGPIE.KEY.PHYSICS.FORCES.FD = MAGPIE.KEY.PHYSICS.FORCES.FF + 1;
/** @type {index} lift */
MAGPIE.KEY.PHYSICS.FORCES.FL = MAGPIE.KEY.PHYSICS.FORCES.FD + 1;
/** @type {index} angle of attack */
MAGPIE.KEY.PHYSICS.FORCES.AOA = MAGPIE.KEY.PHYSICS.FORCES.FL + 1;
/** @type {Enumerator<Number>} amount of forces */
MAGPIE.KEY.PHYSICS.FORCES.ARRAY = MAGPIE.KEY.PHYSICS.FORCES.AOA + 1;
// #endregion
//------------------------------------------------------------------------
/**
 * @name Orbit
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Orbit
//------------------------------------------------------------------------
MAGPIE.KEY.ORBIT = {};
/**
 * @typedef {{
 * a: distance, 
 * e: ratio, 
 * i: angle_rad, 
 * raan: angle_rad, 
 * aop: angle_rad,
 * nu: angle_rad,
 * T0: duration,
 * M0: angle_rad
 * }} orbit_data
 */
MAGPIE.KEY.ORBIT.meta = {};
/** @type {Enumerator<Number>} */
MAGPIE.KEY.ORBIT.ID = 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.ORBIT.TYPE = 1;
/** @type {index} semi-major axis */
MAGPIE.KEY.ORBIT.A = 0;
/** @type {index} eccentricity */
MAGPIE.KEY.ORBIT.E = MAGPIE.KEY.ORBIT.A + 1;
/** @type {index} inclination */
MAGPIE.KEY.ORBIT.I = MAGPIE.KEY.ORBIT.E + 1;
/** @type {index} longitude of ascending node */
MAGPIE.KEY.ORBIT.RAAN = MAGPIE.KEY.ORBIT.I + 1;
/** @type {index} argument of periapsis */
MAGPIE.KEY.ORBIT.AOP = MAGPIE.KEY.ORBIT.RAAN + 1;
/** @type {index} true anomaly */
MAGPIE.KEY.ORBIT.NU = MAGPIE.KEY.ORBIT.AOP + 1;
/** @type {index} epoch */
MAGPIE.KEY.ORBIT.T0 = MAGPIE.KEY.ORBIT.NU + 1;
/** @type {index} mean anomaly at epoch */
MAGPIE.KEY.ORBIT.M0 = MAGPIE.KEY.ORBIT.T0 + 1;
/** @type {index} entityID */
MAGPIE.KEY.ORBIT.E_ID = MAGPIE.KEY.ORBIT.M0 + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.ORBIT.ARRAY = MAGPIE.KEY.ORBIT.E_ID + 1;
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > POVART
//------------------------------------------------------------------------
/**
 * component of {@link MAGPIE_ENTITY} 
 * sister of {@link MAGPIE.KEY.ORBIT}
 * @desc Indices for the {@link MAGPIE_ENTITY}.POVART array
 * @property {vector3[0]} P_X
 * @property {vector3[1]} P_Y
 * @property {vector3[2]} P_Z
 * @property {entityID} P_C
 * @property {orbit_data[0]} P_O_A
 * @property {orbit_data[1]} P_O_E
 * @property {orbit_data[2]} P_O_I
 * @property {orbit_data[3]} P_O_RAAN
 * @property {orbit_data[4]} P_O_AOP
 * @property {orbit_data[5]} P_O_NU
 * @property {orbit_data[6]} P_O_T0
 * @property {orbit_data[7]} P_O_M0
 * @property {rotor[0]} O_YZ
 * @property {rotor[1]} O_XZ
 * @property {rotor[2]} O_XY
 * @property {rotor[3]} O_W
 * @property {vector3[0]} V_X
 * @property {vector3[1]} V_Y
 * @property {vector3[2]} V_Z
 * @property {vector3[0]} A_X
 * @property {vector3[1]} A_Y
 * @property {vector3[2]} A_Z
 * @property {bivector[0]} R_YZ
 * @property {bivector[1]} R_XZ
 * @property {bivector[2]} R_XY
 * @property {bivector[0]} T_YZ
 * @property {bivector[1]} T_XZ
 * @property {bivector[2]} T_XY
 * @property {entityID} E_ID
 * 
 */
MAGPIE.KEY.POVART = {};
/**
 * @typedef {Number} P_X position x
 * @typedef {Number} P_Y position y
 * @typedef {Number} P_Z position z
 * @typedef {Number} P_C parent celestial body ID
 * @typedef {distance} P_O_A {@link MAGPIE.KEY.ORBIT.A} in m
 * @typedef {ratio} P_O_E {@link MAGPIE.KEY.ORBIT.E} 0 to 1
 * @typedef {angle_rad} P_O_I {@link MAGPIE.KEY.ORBIT.I} in rad
 * @typedef {angle_rad} P_O_RAAN {@link MAGPIE.KEY.ORBIT.RAAN} in rad
 * @typedef {angle_rad} P_O_AOP {@link MAGPIE.KEY.ORBIT.AOP} in rad
 * @typedef {angle_rad} P_O_NU {@link MAGPIE.KEY.ORBIT.NU} in rad
 * @typedef {epoch_real_s} P_O_T0 {@link MAGPIE.KEY.ORBIT.T0} in s
 * @typedef {angle_rad} P_O_M0 {@link MAGPIE.KEY.ORBIT.M0} in rad
 * @typedef {Number} O_YZ orientation rotor YZ
 * @typedef {Number} O_XZ orientation rotor XZ
 * @typedef {Number} O_XY orientation rotor XY
 * @typedef {Number} O_W orientation rotor scalar
 * @typedef {Number} V_X velocity x
 * @typedef {Number} V_Y velocity y
 * @typedef {Number} V_Z velocity z
 * @typedef {Number} A_X acceleration x
 * @typedef {Number} A_Y acceleration y
 * @typedef {Number} A_Z acceleration z
 * @typedef {Number} R_YZ rotation bivector YZ
 * @typedef {Number} R_XZ rotation bivector YZ
 * @typedef {Number} R_XY rotation bivector XY
 * @typedef {Number} T_YZ torque bivector YZ
 * @typedef {Number} T_XZ torque bivector XZ
 * @typedef {Number} T_XY torque bivector XY
 * @typedef {Number} E_ID entity ID
 * @typedef {Number[]} orbit [a,e,i,raan,aop,nu,T0,M0]
 */
MAGPIE.KEY.POVART.meta = {};
/** @type {index} position x */
MAGPIE.KEY.POVART.P_X = 0;
/** @type {index} position y */
MAGPIE.KEY.POVART.P_Y = MAGPIE.KEY.POVART.P_X + 1;
/** @type {index} position z */
MAGPIE.KEY.POVART.P_Z = MAGPIE.KEY.POVART.P_Y + 1;
/** @type {index} parent celestial body ID */
MAGPIE.KEY.POVART.P_C = MAGPIE.KEY.POVART.P_Z + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.A} */
MAGPIE.KEY.POVART.P_O_A = MAGPIE.KEY.POVART.P_C + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.E} */
MAGPIE.KEY.POVART.P_O_E = MAGPIE.KEY.POVART.P_O_A + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.I} */
MAGPIE.KEY.POVART.P_O_I = MAGPIE.KEY.POVART.P_O_E + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.RAAN} */
MAGPIE.KEY.POVART.P_O_RAAN = MAGPIE.KEY.POVART.P_O_I + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.AOP} */
MAGPIE.KEY.POVART.P_O_AOP = MAGPIE.KEY.POVART.P_O_RAAN + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.NU} */
MAGPIE.KEY.POVART.P_O_NU = MAGPIE.KEY.POVART.P_O_AOP + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.T0} */
MAGPIE.KEY.POVART.P_O_T0 = MAGPIE.KEY.POVART.P_O_NU + 1;
/** @type {index} @desc {@link MAGPIE.KEY.ORBIT.M0} */
MAGPIE.KEY.POVART.P_O_M0 = MAGPIE.KEY.POVART.P_O_T0 + 1;
/** @type {index} orientation rotor YZ */
MAGPIE.KEY.POVART.O_YZ = MAGPIE.KEY.POVART.P_O_M0 + 1;
/** @type {index} orientation rotor XZ */
MAGPIE.KEY.POVART.O_XZ = MAGPIE.KEY.POVART.O_YZ + 1;
/** @type {index} orientation rotor XY */
MAGPIE.KEY.POVART.O_XY = MAGPIE.KEY.POVART.O_XZ + 1;
/** @type {index} orientation rotor scalar */
MAGPIE.KEY.POVART.O_W = MAGPIE.KEY.POVART.O_XY + 1;
/** @type {index} velocity x */
MAGPIE.KEY.POVART.V_X = MAGPIE.KEY.POVART.O_W + 1;
/** @type {index} velocity y */
MAGPIE.KEY.POVART.V_Y = MAGPIE.KEY.POVART.V_X + 1;
/** @type {index} velocity z */
MAGPIE.KEY.POVART.V_Z = MAGPIE.KEY.POVART.V_Y + 1;
/** @type {index} acceleration x */
MAGPIE.KEY.POVART.A_X = MAGPIE.KEY.POVART.V_Z + 1;
/** @type {index} acceleration y */
MAGPIE.KEY.POVART.A_Y = MAGPIE.KEY.POVART.A_X + 1;
/** @type {index} acceleration z */
MAGPIE.KEY.POVART.A_Z = MAGPIE.KEY.POVART.A_Y + 1;
/** @type {index} rotation bivector yz */
MAGPIE.KEY.POVART.R_YZ = MAGPIE.KEY.POVART.A_Z + 1;
/** @type {index} rotation bivector xz */
MAGPIE.KEY.POVART.R_XZ = MAGPIE.KEY.POVART.R_YZ + 1;
/** @type {index} rotation bivector xy */
MAGPIE.KEY.POVART.R_XY = MAGPIE.KEY.POVART.R_XZ + 1;
/** @type {index} torque bivector yz */
MAGPIE.KEY.POVART.T_YZ = MAGPIE.KEY.POVART.R_XY + 1;
/** @type {index} torque bivector xz */
MAGPIE.KEY.POVART.T_XZ = MAGPIE.KEY.POVART.T_YZ + 1;
/** @type {index} torque bivector xy */
MAGPIE.KEY.POVART.T_XY = MAGPIE.KEY.POVART.T_XZ + 1;
/** @type {index} entity's ID */
MAGPIE.KEY.POVART.E_ID = MAGPIE.KEY.POVART.T_XY + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.POVART.ARRAY = MAGPIE.KEY.POVART.E_ID + 1;
/** @type {vector3} entity's default 'forward' vector [x,y,z] */
MAGPIE.KEY.POVART.FWD = [0,1,0];
/** @type {vector3} default 'up' vector [x,y,z] */
MAGPIE.KEY.POVART.UP = [0,0,1];
// #endregion
//------------------------------------------------------------------------
/**
 * component of {@link MAGPIE_ENTITY}
 * sister of {@link MAGPIE.KEY.PHYSICS.POVART}
 * 
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > Stats
//------------------------------------------------------------------------
MAGPIE.KEY.STATS = {};
/**
 * @typedef {Number} STAT aka static parameter
 * @typedef {Number} PARAM STAT modifier aka param
 * @typedef {STAT} FIT fitness aka MHP
 * @typedef {STAT} RES reserve aka HP
 * @typedef {STAT} LVL growth LvL aka LEVEL
 * @typedef {STAT} END endurance aka MMP
 * @typedef {STAT} STA stamina aka MP
 * @typedef {STAT} PWR power aka ATK
 * @typedef {STAT} MASS mass aka DEF
 * @typedef {STAT} SEN sense aka MAT
 * @typedef {STAT} DEX dexterity aka MDF
 * @typedef {STAT} RT reaction time aka AGI
 * @typedef {STAT} EVO evolution aka LUK
 * @typedef {{
 * FIT: FIT,
 * END: END,
 * PWR: PWR,
 * MASS: MASS,
 * SEN: SEN,
 * DEX: DEX,
 * RT: RT,
 * EVO: EVO,
 * G_R: Number,
 * G_I: Number,
 * INERT_X: Number,
 * INERT_Y: Number,
 * INERT_Z: Number,
 * TMAX_X: Number,
 * TMAX_Y: Number,
 * TMAX_Z: Number,
 * FB: coefficient,
 * CM: coefficient,
 * MASSKG: mass,
 * DENSITY: density,
 * LENGTH: distance,
 * HEIGHT: distance,
 * WIDTH: distance,
 * VOLUME: volume,
 * FT: force,
 * VMAX: velocity,
 * AMAX: velocity,
 * BMAX: velocity,
 * GMAX: acceleration,
 * CF: coefficient,
 * CL: coefficient,
 * CD: coefficient,
 * COM_X: distance,
 * COM_Y: distance,
 * COM_Z: distance
 * COL_X: distance,
 * COL_Y: distance,
 * COL_Z: distance
 * }} key_stats
 */
MAGPIE.KEY.STATS.meta = {};
/** @type {index} Fitness aka totalDeckSize */
MAGPIE.KEY.STATS.FIT = MAGPIE.KEY.POVART.E_ID + 1;
/** @type {index} Endurance aka LVL_STA */
MAGPIE.KEY.STATS.END = MAGPIE.KEY.STATS.FIT + 1;
/** @type {index} Power aka ATK */
MAGPIE.KEY.STATS.PWR = MAGPIE.KEY.STATS.END + 1;
/** @type {index} Mass aka DEF */
MAGPIE.KEY.STATS.MASS = MAGPIE.KEY.STATS.PWR + 1;
/** @type {index} Sense aka MAT */
MAGPIE.KEY.STATS.SEN = MAGPIE.KEY.STATS.MASS + 1;
/** @type {index} Dexterity aka MDF */
MAGPIE.KEY.STATS.DEX = MAGPIE.KEY.STATS.SEN + 1;
/** @type {index} Reaction Time aka AGI */
MAGPIE.KEY.STATS.RT = MAGPIE.KEY.STATS.DEX + 1;
/** @type {index} Evolution aka LUK */
MAGPIE.KEY.STATS.EVO = MAGPIE.KEY.STATS.RT + 1;
/** @type {index} @desc Growth Level */
MAGPIE.KEY.STATS.G_LVL = MAGPIE.KEY.STATS.EVO + 1;
/** @type {index} @desc Growth Rate (curve steepness) */
MAGPIE.KEY.STATS.G_R = MAGPIE.KEY.STATS.G_LVL + 1;
/** @type {index} @desc Growth Inflection point ("puberty") */
MAGPIE.KEY.STATS.G_I = MAGPIE.KEY.STATS.G_R + 1;
/** @type {index} inertia x */
MAGPIE.KEY.STATS.INERT_X = MAGPIE.KEY.STATS.G_I + 1;
/** @type {index} Inertia y */
MAGPIE.KEY.STATS.INERT_Y = MAGPIE.KEY.STATS.INERT_X + 1;
/** @type {index} Inertia z */
MAGPIE.KEY.STATS.INERT_Z = MAGPIE.KEY.STATS.INERT_Y + 1;
/** @type {index} max Torque x */
MAGPIE.KEY.STATS.TMAX_X = MAGPIE.KEY.STATS.INERT_Z + 1;
/** @type {index} max Torque y */
MAGPIE.KEY.STATS.TMAX_Y = MAGPIE.KEY.STATS.TMAX_X + 1;
/** @type {index} max Torque z */
MAGPIE.KEY.STATS.TMAX_Z = MAGPIE.KEY.STATS.TMAX_Y + 1;
/** @type {index} Coefficient of Buoyancy */
MAGPIE.KEY.STATS.FB = MAGPIE.KEY.STATS.TMAX_Z + 1;
/** @type {index} @todo Coefficient of integrity: unsure of this */
MAGPIE.KEY.STATS.CM = MAGPIE.KEY.STATS.FB + 1;
/** @type {index} */
MAGPIE.KEY.STATS.MASSKG = MAGPIE.KEY.STATS.CM + 1;
/** @type {index} */
MAGPIE.KEY.STATS.DENSITY = MAGPIE.KEY.STATS.MASSKG + 1;
/** @type {index} */
MAGPIE.KEY.STATS.LENGTH = MAGPIE.KEY.STATS.DENSITY + 1;
/** @type {index} */
MAGPIE.KEY.STATS.HEIGHT = MAGPIE.KEY.STATS.LENGTH + 1;
/** @type {index} */
MAGPIE.KEY.STATS.WIDTH = MAGPIE.KEY.STATS.HEIGHT + 1;
/** @type {index} */
MAGPIE.KEY.STATS.VOLUME = MAGPIE.KEY.STATS.WIDTH + 1;
/** @type {index} Thrust in (N) */
MAGPIE.KEY.STATS.FT = MAGPIE.KEY.STATS.VOLUME + 1;
/** @type {index} */
MAGPIE.KEY.STATS.VMAX = MAGPIE.KEY.STATS.FT + 1;
/** @type {index} */
MAGPIE.KEY.STATS.AMAX = MAGPIE.KEY.STATS.VMAX + 1;
/** @type {index} */
MAGPIE.KEY.STATS.BMAX = MAGPIE.KEY.STATS.AMAX + 1;
/** @type {index} */
MAGPIE.KEY.STATS.GMAX = MAGPIE.KEY.STATS.BMAX + 1;
/** @type {index} Coefficient of friction*/
MAGPIE.KEY.STATS.CF = MAGPIE.KEY.STATS.GMAX + 1;
/** @type {index} Coefficient of Lift*/
MAGPIE.KEY.STATS.CL = MAGPIE.KEY.STATS.CF + 1;
/** @type {index} Coefficient of drag*/
MAGPIE.KEY.STATS.CD = MAGPIE.KEY.STATS.CL + 1;
/** @type {index} Center of Mass*/
MAGPIE.KEY.STATS.COM_X = MAGPIE.KEY.STATS.CD + 1;
/** @type {index} Center of Mass*/
MAGPIE.KEY.STATS.COM_Y = MAGPIE.KEY.STATS.COM_X + 1;
/** @type {index} Center of Mass*/
MAGPIE.KEY.STATS.COM_Z = MAGPIE.KEY.STATS.COM_Y + 1;
/** @type {index} Center of lift*/
MAGPIE.KEY.STATS.COL_X = MAGPIE.KEY.STATS.COM_Z + 1;
/** @type {index} Center of lift*/
MAGPIE.KEY.STATS.COL_Y = MAGPIE.KEY.STATS.COL_X + 1;
/** @type {index} Center of lift*/
MAGPIE.KEY.STATS.COL_Z = MAGPIE.KEY.STATS.COL_Y + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.MOTHER = MAGPIE.KEY.STATS.COL_Z + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.FATHER = MAGPIE.KEY.STATS.MOTHER + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.COMPOUND = MAGPIE.KEY.STATS.FATHER + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.HOST = MAGPIE.KEY.STATS.COMPOUND + 1;
/** @type {Enumerator<Number>} */
MAGPIE.KEY.STATS.ARRAY = MAGPIE.KEY.STATS.HOST + 1;
/** @desc max stretch for {@link MAGPIE_ENTITY.growth} */
//
MAGPIE.KEY.STATS.TOLERANCE_BASE = 0.5;
MAGPIE.KEY.STATS.AGILITY_MOD_MIN = 0.5;
MAGPIE.KEY.STATS.AGILITY_MOD_MAX = 100;
MAGPIE.KEY.STATS.STRETCH = 2;
//#endregion
//------------------------------------------------------------------------
/**
 * @namespace MAGPIE_CELESTIAL.traits
 * @component of {@link MAGPIE_CELESTIAL}
 * @sister of {@link MAGPIE_ORBIT}
 * @desc methods:
 * - {@link MAGPIE_PHYSICS.celestial}
 */
//------------------------------------------------------------------------
//#region > Celestial
//------------------------------------------------------------------------
MAGPIE.KEY.CELESTIAL = {};
/** @type {index} */
MAGPIE.KEY.CELESTIAL.MASS = MAGPIE.KEY.STATS.MASSKG;
/**@type {index} */
MAGPIE.KEY.CELESTIAL.CMF = MAGPIE.KEY.STATS.MASS;
/** @type {index} axial tilt */
MAGPIE.KEY.CELESTIAL.AXIAL = MAGPIE.KEY.STATS.COM_X;
/** @type {index} rotation period */
MAGPIE.KEY.CELESTIAL.ROTATION = MAGPIE.KEY.STATS.COM_Y;
/** @type {index} */
MAGPIE.KEY.CELESTIAL.ALBEDO = MAGPIE.KEY.STATS.RT;
/** @type {index} greenhouse effect */
MAGPIE.KEY.CELESTIAL.GREENHOUSE = MAGPIE.KEY.STATS.CM;
/** @type {index} */
MAGPIE.KEY.CELESTIAL.AGE = MAGPIE.KEY.STATS.G_R;
/** @type {index} radius */
MAGPIE.KEY.CELESTIAL.R = MAGPIE.KEY.STATS.COM_Z;
/** @type {index} gravity */
MAGPIE.KEY.CELESTIAL.G = MAGPIE.KEY.STATS.GMAX;
/** @type {index} escape velocity */
MAGPIE.KEY.CELESTIAL.ESCAPE = MAGPIE.KEY.STATS.VMAX;
/** @type {index} surface temperature */
MAGPIE.KEY.CELESTIAL.SURF_TEMP = MAGPIE.KEY.STATS.PWR;
/** @type {index} surface atmospheric pressure */
MAGPIE.KEY.CELESTIAL.ATM = MAGPIE.KEY.STATS.VOLUME;
/** @type {index} surface atmospheric density */
MAGPIE.KEY.CELESTIAL.ATD = MAGPIE.KEY.STATS.DENSITY;
/** @type {index} atmospheric composition */
MAGPIE.KEY.CELESTIAL.COMP = MAGPIE.KEY.STATS.FIT;
//#endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Fitness
//------------------------------------------------------------------------
MAGPIE.KEY.FITNESS = {};
MAGPIE.KEY.FITNESS.meta = {};
MAGPIE.KEY.FITNESS.E_ID = 0;
MAGPIE.KEY.FITNESS.DECKSIZE = MAGPIE.KEY.FITNESS.E_ID + 1;
MAGPIE.KEY.FITNESS.TRAITS = MAGPIE.KEY.DECKSIZE + 1;
MAGPIE.KEY.FITNESS.STATES = 2;
MAGPIE.KEY.FITNESS.EQUIPS = 3;
MAGPIE.KEY.FITNESS.WASTE = 4;
MAGPIE.KEY.FITNESS.INJURY = 5;
MAGPIE.KEY.FITNESS.STAMINA = 6;
MAGPIE.KEY.FITNESS.ZONES = MAGPIE.KEY.FITNESS.INJURY;
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > Status
//------------------------------------------------------------------------
MAGPIE.KEY.STATUS = {};
MAGPIE.KEY.STATUS.meta = {};
MAGPIE.KEY.STATUS.NULL = 0;
MAGPIE.KEY.STATUS.DESTROYED = MAGPIE.KEY.STATUS.NULL + 1;
MAGPIE.KEY.STATUS.DISABLED = MAGPIE.KEY.STATUS.DESTROYED + 1;
MAGPIE.KEY.STATUS.DAMAGED = 10;
//#endregion
//------------------------------------------------------------------------
/**
 * @name Traits
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > traits
//------------------------------------------------------------------------
MAGPIE.KEY.TRAIT = {};
MAGPIE.KEY.TRAIT.meta = {};
MAGPIE.KEY.TRAIT.ARRAY = 0;
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > Comp
//------------------------------------------------------------------------
MAGPIE.KEY.COMPONENT = {};
MAGPIE.KEY.COMPONENT.STATE = {};
/** @type {Enumerator<Number>} @desc {@link MAGPIE.KEY.STATUS.meta} */
MAGPIE.KEY.COMPONENT.STATE.STATUS = 0;
/** @type {Enumerator<Number>} @desc current value Number */
MAGPIE.KEY.COMPONENT.STATE.VALUE = MAGPIE.KEY.COMPONENT.STATE.STATUS + 1;
/** @type {Enumerator<Number>} @desc last STATUS */
MAGPIE.KEY.COMPONENT.STATE.LAST_STATE = MAGPIE.KEY.COMPONENT.STATE.VALUE + 1;
/** @type {Enumerator<Number>} @desc timestamp of last state change */
MAGPIE.KEY.COMPONENT.STATE.LAST_CHANGE = MAGPIE.KEY.COMPONENT.STATE.LAST_STATE + 1;
/** @type {Enumerator<Number>} @desc dynamic number value for the trigger */
MAGPIE.KEY.COMPONENT.STATE.TARGET_VALUE = MAGPIE.KEY.COMPONENT.STATE.LAST_CHANGE + 1;
/** @type {Enumerator<Number>} @desc timestamp of trigger */
MAGPIE.KEY.COMPONENT.STATE.TARGET_TRIGGER = MAGPIE.KEY.COMPONENT.STATE.TARGET_VALUE + 1;
/** @type {Enumerator<Number>} @desc total size of array*/
MAGPIE.KEY.COMPONENT.STATE.ARRAY = MAGPIE.KEY.COMPONENT.STATE.TARGET_TRIGGER + 1;
//#endregion 
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Symbol
//------------------------------------------------------------------------
MAGPIE.KEY.SYMBOL = {};
/**
 * @typedef {Enumerator<Number>} symbol_type
 */
MAGPIE.KEY.SYMBOL.meta = "";
MAGPIE.KEY.SYMBOL.TYPE = {};
MAGPIE.KEY.SYMBOL.TYPE.meta = "";
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.AXIOM = 0;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.SEMANTIC = 1;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.RESOURCE = 2;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.MATERIAL = 3;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.PRODUCT = 4;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.COMPONENT = 5;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.UNIT = 6;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.SERVICE = 7;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.INTERACTION = 8;
/** @type {symbol_type} */
MAGPIE.KEY.SYMBOL.TYPE.CONCEPT = 9;
MAGPIE.KEY.SYMBOL.INDEX = {};
// #endregion
//------------------------------------------------------------------------
/**
 * @desc {@link MAGPIE_STATE}
 * 
 */
//------------------------------------------------------------------------
//#region > State
//------------------------------------------------------------------------
MAGPIE.KEY.STATE = {};
MAGPIE.KEY.STATE.meta = {};
/** {@link MAGPIE_STATE.setup} */
MAGPIE.KEY.STATE.meta.schema = [
		"ID",
		"type",
		"name",
		"description",
		"stack",
		"onApply",
		"onUpdate",
		"onRemove",
		"onExpire"
	]
MAGPIE.KEY.STATE.TYPE = {};
//#endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Emote
//------------------------------------------------------------------------
MAGPIE.KEY.EMOTE = {};
MAGPIE.KEY.EMOTE.meta = {};
MAGPIE.KEY.EMOTE.TYPE = {};
MAGPIE.KEY.EMOTE.TYPE.DEFAULT = 0;
MAGPIE.KEY.EMOTE.TYPE.FSM = MAGPIE.KEY.EMOTE.TYPE.DEFAULT + 1;
MAGPIE.KEY.EMOTE.TYPE.TRIGGER = MAGPIE.KEY.EMOTE.TYPE.FSM + 1;
MAGPIE.KEY.EMOTE.TYPE.ARRAY = MAGPIE.KEY.EMOTE.TYPE.TRIGGER + 1;
MAGPIE.KEY.EMOTE.INDEX = {};
MAGPIE.KEY.EMOTE.INDEX.meta = "index of all emotes",
MAGPIE.KEY.EMOTE.INDEX.SEEK_TARGET = 302;
MAGPIE.KEY.EMOTE.INDEX.SCHEDULE = 310;
// #endregion
//------------------------------------------------------------------------
/**
 * @name switches
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > SWITCH
//------------------------------------------------------------------------
MAGPIE.KEY.SWITCHES = {};
/**
 * @name date
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > date
//------------------------------------------------------------------------
MAGPIE.KEY.SWITCHES.SUPER_TICK = 131;
MAGPIE.KEY.SWITCHES.MEGA_TICK = MAGPIE.KEY.SWITCHES.SUPER_TICK + 1;
MAGPIE.KEY.SWITCHES.ULTRA_TICK = MAGPIE.KEY.SWITCHES.MEGA_TICK + 1;
MAGPIE.KEY.SWITCHES.NEW_DAY = MAGPIE.KEY.SWITCHES.ULTRA_TICK + 1;
MAGPIE.KEY.SWITCHES.NEW_MONTH = MAGPIE.KEY.SWITCHES.NEW_DAY + 1;
MAGPIE.KEY.SWITCHES.NEW_YEAR = MAGPIE.KEY.SWITCHES.NEW_MONTH + 1;
MAGPIE.KEY.SWITCHES.LEAP_DAY = MAGPIE.KEY.SWITCHES.NEW_YEAR + 1;
MAGPIE.KEY.SWITCHES.LEAP_MONTH = MAGPIE.KEY.SWITCHES.LEAP_DAY + 1;
MAGPIE.KEY.SWITCHES.LEAP_YEAR = MAGPIE.KEY.SWITCHES.LEAP_MONTH + 1;
// #endregion
//------------------------------------------------------------------------
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > WMedia
//------------------------------------------------------------------------
MAGPIE.KEY.WMEDIA = {};
MAGPIE.KEY.WMEDIA.DEFAULT_PATH = 'C:\\Windows\\Media\\'; 
MAGPIE.KEY.WMEDIA.CHORD = `${MAGPIE.KEY.WMEDIA.DEFAULT_PATH}chord.wav`;
//#endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = { MAGPIE };
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================