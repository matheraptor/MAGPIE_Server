/**
 * @namespace MAGPIE
 * @author Matheraptor
 * @licence CC
 * 
 * @version 0.20.0
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
 * - ADDED: Google Cloud server compute instance {@link MAGPIE_SERVER.config.instance}
 * 		and connected it to project MAGPIE {@link MAGPIE_SERVER.config.projectID}
 * - ADDED: configuration to run DuckDNS subdomain {@link MAGPIE_SERVER.config.domain}
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
//#region - CLASS
//========================================================================
class MAGPIE {
    static {
        this.meta = {
            name: "M.A.G.P.I.E",
            desc: "(M)odular (A)lgorithmic (G)eneral-(P)urpose (I)ntelligence (E)ngine",
            version: [0, 20, 0],
            firmwareName: "MAGPIE",
            firmwareDate: "20260425"
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
MAGPIE.KEY.TYPE.KEY = MAGPIE.KEY.TYPE.AXIOM + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METAKEY = MAGPIE.KEY.TYPE.KEY + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.SEMANTIC = MAGPIE.KEY.TYPE.METAKEY + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.CONTEXT = MAGPIE.KEY.TYPE.SEMANTIC + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METACONTEXT = MAGPIE.KEY.TYPE.CONTEXT + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.EXP = MAGPIE.KEY.TYPE.METACONTEXT + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METAEXP = MAGPIE.KEY.TYPE.EXP + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.TICKET = MAGPIE.KEY.TYPE.METAEXP + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.METATICKET = MAGPIE.KEY.TYPE.TICKET + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTERKEY = MAGPIE.KEY.TYPE.METATICKET + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTERCONTEXT = MAGPIE.KEY.TYPE.MASTERKEY + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTEREXP = MAGPIE.KEY.TYPE.MASTERCONTEXT + 1;
/** @type {key_type} */
MAGPIE.KEY.TYPE.MASTERTICKET = MAGPIE.KEY.TYPE.MASTEREXP + 1;
/** @typedef {Enumerator<Number>} key_index */
MAGPIE.KEY.INDEX = {};
MAGPIE.KEY.INDEX.meta = "";
/** @type {key_index} */
MAGPIE.KEY.INDEX.TEMPLATE = 0;
/** @type {key_index} */
MAGPIE.KEY.INDEX.SUBJECT = 10;
/** @type {key_index} */
MAGPIE.KEY.INDEX.OBJECT = MAGPIE.KEY.INDEX.SUBJECT + 1;
/** @type {key_index} */
MAGPIE.KEY.INDEX.TARGET = MAGPIE.KEY.INDEX.OBJECT + 1;
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
MAGPIE.KEY.RUNTIME.LAYER = new Map();
MAGPIE.KEY.RUNTIME.LAYER.set(0, { name: "Base", delta: 0.001 });
MAGPIE.KEY.RUNTIME.LAYER.set(1, { name: "Game", delta: 0.016 });
MAGPIE.KEY.RUNTIME.LAYER.set(2, { name: "Standard", delta: 1 });
MAGPIE.KEY.RUNTIME.LAYER.set(3, { name: "Super", delta: 60 });
MAGPIE.KEY.RUNTIME.LAYER.set(4, { name: "Mega", delta: 60 ** 2 });
MAGPIE.KEY.RUNTIME.LAYER.set(5, { name: "ultra", delta: 60 ** 2 * 24 });
//
MAGPIE.KEY.HIVE = {};
MAGPIE.KEY.HIVE.LAYER = new Map();
Array.from(MAGPIE.KEY.RUNTIME.LAYER.entries()).forEach((entry, index) => {
    if(index > 0)
        MAGPIE.KEY.HIVE.LAYER.set(entry[0], entry[1]);
})
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
/** @type {calendar_data} */
MAGPIE.KEY.CALENDAR.GREGORIAN = {
    calendarID: 0,
    days: 365.25,
    months: {
        January: 31,
        February: 28,
        March: 31,
        April: 30,
        May: 30,
        June: 30,
        July: 31,
        August: 31,
        September: 30,
        October: 31,
        November: 30,
        December: 31
    },
    leapMonth: 2,
    leapYear: 4,
    dayLength: 24,
    epochYear: 0
}
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
// const REPL = require("repl");
// const r = REPL.start({
//     prompt: "MAGPIE_SERVER > ",
//     terminal: true
// });
module.exports = { MAGPIE };