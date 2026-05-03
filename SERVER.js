/**
 * 
 * @namespace MAGPIE_Server
 * @author Matheraptor
 * @desc server frontend
 * {@link MAGPIE}
 */
class MAGPIE_SERVER
{
	//
}
/**
 * @name IMPORT
 * @desc dependencies
 * 
 */
//========================================================================
// #region - IMPORT
//========================================================================
/**
 * @name internal
 * @desc MAGPIE dependencies
 * 
 */
//------------------------------------------------------------------------
// #region > internal
//------------------------------------------------------------------------
const { MAGPIE } = require("./core/index");
MAGPIE_SERVER.meta = MAGPIE.meta;
MAGPIE_SERVER.meta.name += " server";
const SYSTEM = require("./core/system");
const { 
	MAGPIE_SYSTEM,
	MAGPIE_LOG,
	MAGPIE_IO,
	MAGPIE_HIVE,
	MAGPIE_RUNTIME,
	MAGPIE_METASTATE,
	MAGPIE_DATE
} = SYSTEM;
// const { MAGPIE_SYSTEM } = SYSTEM;
// const { MAGPIE_RUNTIME } = SYSTEM;
// const { MAGPIE_HIVE } = SYSTEM;
const { MAGPIE_PHYSICS } = require("./core/physics");
const { MAGPIE_COMPONENT } = require("./core/component");
const { MAGPIE_ENTITY } = require("./core/entity");
const { MAGPIE_PLAYER } = require("./core/player");
const MAGPIE_DATABASE = require("./core/database");
MAGPIE_SERVER.registry = {
	MAGPIE,
	MAGPIE_SYSTEM,
	MAGPIE_LOG,
	MAGPIE_IO,
	MAGPIE_RUNTIME,
	MAGPIE_HIVE,
	MAGPIE_METASTATE,
	MAGPIE_PHYSICS,
	MAGPIE_COMPONENT,
	MAGPIE_ENTITY,
	MAGPIE_PLAYER,
	MAGPIE_DATABASE
};
MAGPIE_SERVER.meta = {}
MAGPIE_SERVER.perf = {};
MAGPIE_SERVER.perf.start = performance.now();
MAGPIE_SERVER.perf.end = NaN;
MAGPIE_SERVER.config = require("./core/config");
const STATE = require("./data/states");
// #endregion
//------------------------------------------------------------------------
/**
 * @name Input/Output
 * @desc FS I/O external dependencies from node itself
 * 
 */
//------------------------------------------------------------------------
// #region > I/O
//------------------------------------------------------------------------
const fs = require("fs");
const path = require("path");
const { timeEnd } = require("node:console");
const vm = require("node:vm");
// #endregion
//------------------------------------------------------------------------
/**
 * @name server
 * @desc dependencies for running the server
 * 
 */
//------------------------------------------------------------------------
// #region > server
//------------------------------------------------------------------------
//
const express = require("express");
const ratelimit = require("express-rate-limit");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
// #endregion
//------------------------------------------------------------------------
/**
 * @name security
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > security
//------------------------------------------------------------------------
MAGPIE_SERVER.JWT = require("jsonwebtoken");

// #endregion
//------------------------------------------------------------------------
/**
 * @name utility
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > utility
//------------------------------------------------------------------------
const cliSpinner = require("cli-spinner");
const cliProgress = require("cli-progress");
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link MAGPIE_SERVER.meta}
 *
 */
//========================================================================
// #endregion - IMPORT
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - KEY
//========================================================================
MAGPIE.KEY.STATE.TYPE = STATE.TYPE;
MAGPIE.KEY.STATE.INDEX = STATE.INDEX;
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name MAGPIE_SERVER
 * @desc 
 * 
 */
//========================================================================
// #region - SERVER
//========================================================================
MAGPIE_SERVER.SYS = {};
/**
 * @name I/O
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > I/O
//------------------------------------------------------------------------
MAGPIE_SERVER.IO = MAGPIE_IO;
// #endregion
//------------------------------------------------------------------------
/**
 * @name System
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > System
//------------------------------------------------------------------------
MAGPIE_SERVER.SYS = MAGPIE_SYSTEM;
MAGPIE_SERVER.IO = MAGPIE_IO;
MAGPIE_SERVER.SYS._log = MAGPIE_SYSTEM.log;
MAGPIE_SYSTEM.log = function log(message, prefix, logToConsole)
{
	MAGPIE_SERVER.SYS._log.call(this, message, prefix, logToConsole);
	r.displayPrompt();
}
MAGPIE_SERVER.SYS._error = MAGPIE_SYSTEM.error;
/**
 * 
 * @param {String} message 
 * @param {Error} error 
 */
MAGPIE_SYSTEM.error = function error(message, error)
{
	MAGPIE_SERVER.SYS._error.call(this, message, error);
	r.displayPrompt();
}
MAGPIE_SYSTEM._logging_debug = function server_debug(message)
{
	if(r.cursor > 0)
		return
	console.clear();
	console.error(new Error(message + "\n"));
	r.displayPrompt();
	// lastMessage = message;
}

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Handlers
//------------------------------------------------------------------------
MAGPIE_SERVER.SYS._handlersPath = path.join(__dirname, "handlers");
MAGPIE_SERVER.HANDLER = fs.readdirSync(MAGPIE_SERVER.SYS._handlersPath)
// #endregion
//------------------------------------------------------------------------
/**
 * @name runtime
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Runtime
//------------------------------------------------------------------------
/**
 * 
 * @param {*} guest 
 * @param {Number} layerID 
 * @param {Number} switchID
 * @returns 
 * 
 * @desc {@link }
 */
MAGPIE_RUNTIME.prototype.guestRefresh = async function guestRefresh(guest, layerID, switchID)
{
	const system = r.context[guest];
	if(!system || isNaN(layerID)) return
	const pass = system.refresh(layerID, switchID)
	if(!pass) this.kick(guest, layerID);
}
MAGPIE_SERVER.SYS._runtime_guestRefresh = MAGPIE_RUNTIME.__guestRefresh;
MAGPIE_SERVER.SYS._runtime_loadMetastate = MAGPIE_RUNTIME._loadMetastate;
MAGPIE_RUNTIME.prototype.loadMetastate = function loadMetastate()
{
	const ePrefix = "[RUNTIME].loadMetastate: ";
	let state = null;
	try
	{
		state = MAGPIE_DATABASE.loadMetastate();
		if(!(state instanceof MAGPIE_METASTATE)) 
			throw new Error(`${state} is invalid MAGPIE_METASTATE`)
		if(!(state.date instanceof MAGPIE_DATE))
			state.date = new MAGPIE_DATE()
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		state = new MAGPIE_METASTATE()
	}
	finally
	{
		this.host("METASTATE", 0);
		r.context["METASTATE"] = state;
	}
}

/**
 * 
 * @returns 
 */
MAGPIE_RUNTIME.prototype.saveMetastate = function saveMetastate()
{
	const state = r.context.METASTATE;
	if(!state) return
	return MAGPIE_DATABASE.saveMetastate(state);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name Hive
 * @desc 
 * @typedef {MAGPIE_ENTITY[]} hive_buffer
 */
//------------------------------------------------------------------------
// #region > Hive
//------------------------------------------------------------------------
MAGPIE_SERVER.SYS._hive_refresh = MAGPIE_HIVE.__refresh;
/**
 * @typedef {import("./core/index").duration} duration 
 * @param {Number} layerID
 * @param {Number} switchID
 * 
 * @returns {Promise<Boolean>} 
 */
MAGPIE_HIVE.prototype.refresh = async function refresh(layerID, switchID)
{
	for(let i = 0; i <= switchID; i++)
	{
		layerID = i;
		const layerStandard = 2;
		const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
		const layerName = K.name;
		const dt = K.delta;
		if(layerID < layerStandard)
			this.tick_buffer(layerName, layerID, switchID, dt);
		if(switchID < layerStandard || layerID < layerStandard) continue
		this.tick_remote(layerName, layerID, switchID, dt);
	}
}
MAGPIE_HIVE.prototype.tick_buffer = async function tick_buffer(layerName, layerID, switchID, dt)
{
	const ePrefix = "[HIVE].tick_buffer: ";
	const layer = this[layerName];
	const slots = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).slots;
	for(let i = 0; i < slots; i++)
	{
		try
		{
			const slot = i;
			const entity = this.getSlot(slot, layerID)
			if(!entity) return
			const pass = await entity.refresh(layerID, switchID, dt)
			if(!pass) this.kick(entity.ID, layerID);
		}
		catch(e)
		{
			MAGPIE_SERVER.error(ePrefix + e.message, e)
		}
	}
}
/**
 * 
 * @param {Number} slot 
 * @param {Number} layerID 
 */
MAGPIE_HIVE.prototype.getSlot = function getSlot(slot, layerID)
{
	const ePrefix = "[HIVE].isValidSlot: ";
	try
	{
		const entity = this[MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name][slot]
		if(!(entity instanceof MAGPIE_ENTITY))
			throw new Error(`[LAYER-${layerID}][${slot}] is invalid entity slot`)
		if(!entity?.type) return
		return entity
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
MAGPIE_HIVE.prototype.tick_remote = async function tick_remote(layerName, layerID, switchID, dt)
{
	const ePrefix = "[HIVE].tick_remote: ";
	for(const entityID of this[layerName])
	{
		try
		{
			if(isNaN(entityID))
				throw new Error(`${entityID} is invalid entityID`)
			if(!entityID) return
			const entity = await this.loadEntity(entityID);
			if(!entity instanceof MAGPIE_ENTITY)
				throw new Error(`[ENTITY-${entityID}] is invalid entity`)
			const pass = await entity.refresh(layerID, switchID, dt);
			if(!pass) 
				throw new Error(`[ENTITY-${entityID}] has failed to refresh`)
		}
		catch(e)
		{
			MAGPIE_SERVER.error(ePrefix + e.message, e)
			this.kick(entityID, layerID);
		}
	}
}
MAGPIE_SERVER.SYS._hive_host = MAGPIE_HIVE.__host;
MAGPIE_HIVE.prototype.host = function host(entity, layerID, targetLayerID)
{
	const ePrefix = "[HIVE].host: ";
	try
	{
		if(!(entity instanceof MAGPIE_ENTITY))
			throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
		return MAGPIE_SERVER.SYS._hive_host.call(this, entity, layerID, targetLayerID);
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
MAGPIE_HIVE.prototype.kick = function kick(entityID)
{
	const ePrefix = "[HIVE].kick: ";
	try
	{
		MAGPIE_HIVE.__kick.call(this, entityID)
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
MAGPIE_SERVER.SYS._hive_setup = MAGPIE_HIVE.__setup;
MAGPIE_HIVE.prototype.setup = function setup2()
{
	const K = MAGPIE.KEY.RUNTIME.LAYER;
	const layerBase = K.get(0).name;
	const layerGame = K.get(1).name;
	this[layerBase] = new Array(K.get(0).slots).fill(new MAGPIE_ENTITY());
	this[layerGame] = new Array(K.get(1).slots).fill(new MAGPIE_ENTITY());
}
/**
 * @typedef {import("./core/entity").entityID} entityID
 * @param {entityID} entityID 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.prototype.loadEntitySync = function loadEntitySync(entityID)
{
	return MAGPIE_DATABASE.loadEntitySync(entityID);
}
/**
 * 
 * @param {entityID} entityID 
 * @returns {Promise<MAGPIE_ENTITY>}
 */
MAGPIE_HIVE.prototype.loadEntity = async function loadEntity(entityID)
{
	return MAGPIE_DATABASE.loadEntity(entityID)
}
/**
 * @typedef {import("./core/database_worker").database_result} database_result
 * @param {MAGPIE_ENTITY} entity 
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE.prototype.saveEntity = async function saveEntity(entity)
{
	return MAGPIE_DATABASE.saveEntity(entity)
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity 
 * @returns {database_result}
 */
MAGPIE_HIVE.prototype.saveEntitySync = function saveEntitySync(entity)
{
	// return MAGPIE_DATABASE.saveEntitySync(entity);
}
/**
 * 
 * @param {entityID[]} entityIDarray
 *  
 */
MAGPIE_HIVE.prototype.loadEntities = async function loadEntities(entityIDarray)
{
	//
}
/**
 * 
 * @param {MAGPIE_ENTITY[]} entityArray 
 */
MAGPIE_HIVE.prototype.saveEntities = async function saveEntities(entityArray)
{
	//
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Metastate
//------------------------------------------------------------------------
MAGPIE_SERVER.SYS._metastate_tick_base = MAGPIE_METASTATE._TICK_base;
MAGPIE_METASTATE.prototype.TICK_base = async function TICK_base(layerID, switchID)
{
	MAGPIE_SERVER.HIVE.refresh(layerID, switchID);
	const now = performance.now();
	this.date.millisecond = Math.floor(now % 1000);
	if(switchID === 2) 
	{
		this._socketEmit();
		return this.date.TICK();
	}
}
MAGPIE_METASTATE.prototype.TICK_game = async function TICK_game()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_standard = async function TICK_standard()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_super = async function TICK_super()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_mega = async function TICK_mega()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_ultra = async function TICK_ultra()
{
	//
}
MAGPIE_METASTATE.prototype.save = function save()
{
	//
}
MAGPIE_METASTATE.prototype.load = function load()
{
	//
}
/**
 * {@link MAGPIE_METASTATE._socketEmit}
 */
MAGPIE_METASTATE.prototype._socketEmit = function _socketEmit()
{
	const metastate = {};
	const calendar = this.date.getCalendar();
	metastate.meta = this.meta;
	metastate.date = this.date;
	metastate.weekDayName = this.date.getWeekDayName(); 
	metastate.calendar = this.date.getCalendar(),
	metastate.hive = this.hive,
	metastate.contents = this.contents
	io.emit("metastate", metastate);
}

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > CLI
//------------------------------------------------------------------------
MAGPIE_SERVER.CLI = {};
MAGPIE_SERVER.CLI.SPINNER = cliSpinner.Spinner;
//
MAGPIE_SERVER.CLI._createLoadBar = function createLoadBar(options = {
	clearOnComplete: true,
	hideCursor: true,
	name: "bar1"
})
{
	MAGPIE_SERVER.CLI.loadbar = new cliProgress.MultiBar({
		clearOnComplete: true,
		hideCursor: true
	}, cliProgress.Presets.shades_classic);
	MAGPIE_SERVER.CLI[options.name] = MAGPIE_SERVER.CLI.loadbar.create(100,0);
}
MAGPIE_SERVER.CLI._updateLoadBar = function updateLoadBar(value = 0, name = "bar1")
{
	MAGPIE_SERVER.CLI[name].update(value);
}
MAGPIE_SERVER.CLI._incrementLoadBar = function incrementLoadBar(value = 1, name = "bar1")
{
	MAGPIE_SERVER.CLI[name].increment(value);
}
MAGPIE_SERVER.CLI._stop = function stopLoadBar()
{
	MAGPIE_SERVER.CLI.loadbar.stop();
	// process.stdout.write('\r\x1b[K'); 
	// process.stdout.write('\x1b[?25h');
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name logging
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > logging
//------------------------------------------------------------------------
MAGPIE_SERVER.LOG = MAGPIE_LOG;
/**
 * 
 * @param {String} message 
 * @param {String} prefix 
 * @param {Boolean} logToConsole 
 * @returns 
 */
MAGPIE_SERVER.log = function log(message, prefix, logToConsole)
{
	return MAGPIE_SYSTEM.log(message, prefix, logToConsole);
}
MAGPIE_SERVER.error = function error(message)
{
	return MAGPIE_SYSTEM.error(message);
}
MAGPIE_SERVER._debug = function debug(message)
{
	return MAGPIE_SYSTEM._logging_debug(message);
}
MAGPIE_SERVER.LOG.exp = function logExpActivity(message)
{
	return MAGPIE_SYSTEM.logging.log_exp(message);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name Utility
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
MAGPIE_SERVER.UTILITY = {};
/**
 * 
 * @param {Number[]} version 
 * @returns {String} MAJOR.MINOR.PATCH
 */
MAGPIE_SERVER.UTILITY.version = function version(version)
{
	if(!version || version.length < 2 || version.some(n => isNaN(n)))
		version = [0,1,0];
	const Vr = version;
	return `${Vr[0]}.${Vr[1]}.${Vr[2]}`; 
}
/**
 * @typedef {import("./core/system").CTZD} CTZD
 * @returns {CTZD} YYYYMMDD
 */
MAGPIE_SERVER.UTILITY.CTZD = function CTZD()
{
	return MAGPIE_SYSTEM.Utility.CTZD()
}
/**
 * @typedef {import("./core/system").CTZ} CTZ
 * @returns {CTZ} YYYYMMDDHHMM
 */
MAGPIE_SERVER.UTILITY.CTZ = function CTZ()
{
	return MAGPIE_SYSTEM.Utility.CTZ();
}
/**
 * @typedef {import("./core/system").CTZT} CTZT
 * @returns {CTZT} HHMM
 */
MAGPIE_SERVER.UTILITY.CTZT = function CTZT()
{
	return MAGPIE_SYSTEM.Utility.CTZT();
}
/**
 * @typedef {import("./core/system").CTZTS} CTZTS
 * @returns {CTZTS} HHMMSS
 */
MAGPIE_SERVER.UTILITY.CTZTS = function CTZTS()
{
	return MAGPIE_SYSTEM.Utility.CTZTS()
}
/**
 * @typedef {import("./core/system").CTZF} CTZF
 * @returns {CTZF} YYYYMMDDHHMMSSmmm
 */
MAGPIE_SERVER.UTILITY.CTZF = function CTZF()
{
	return MAGPIE_SYSTEM.Utility.CTZF()
}
/**
 * @typedef {import("./core/system").epoch_real} epoch_real
 * @returns {epoch_real}
 */
MAGPIE_SERVER.UTILITY.epoch = function epoch()
{
	return Date.now();
}
/**
 * 
 * @returns {CTZ} [YYYYMMDDHHMM]
 */
MAGPIE_SERVER.UTILITY.consoleTime = function consoleTime()
{
	return MAGPIE_SYSTEM.Utility.consoleTime();
}
/**
 * 
 * @returns {CTZF} [YYYYMMDDHHMMSSmmm]
 */
MAGPIE_SERVER.UTILITY.logTime = function logTime()
{
	return MAGPIE_SYSTEM.Utility.logTime();
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name REPL
 * @desc 
 */
//------------------------------------------------------------------------
// #region > REPL
//------------------------------------------------------------------------
MAGPIE_SERVER.context = {};

Object.keys(MAGPIE_SERVER.registry).forEach(k => {
	MAGPIE_SERVER.context[k] = MAGPIE_SERVER.registry[k];
})
MAGPIE_SERVER.prototype.constructor = MAGPIE_SERVER;
MAGPIE_SERVER._REPL_boot = function bootREPLconsole()
{
	Object.keys(MAGPIE_SERVER.context).forEach(k => {
		r.context[k] = MAGPIE_SERVER.context[k];
		MAGPIE_SERVER.CLI._incrementLoadBar();
	})
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name app
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > App
//------------------------------------------------------------------------
const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: MAGPIE.KEY.SERVER.DOMAIN,
		methods: ["GET", "POST"]
	},
	transports: ["websocket"],
	allowUpgrades: false
})
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
MAGPIE_SERVER.public = {};
MAGPIE_SERVER.public.loginLimiter = ratelimit.rateLimit({
	windowMs: MAGPIE.KEY.SERVER.LOGIN_COOLDOWN * 60 * 1000,
	max: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
	handler: (req, res, next, options) => {
		const http = MAGPIE.KEY.SERVER.HTTP.STATUS_429;
		const resetTime = req.rateLimit.resetTime;
		const remainingMs = resetTime - Date.now();
		const minutes = Math.ceil(remainingMs / (60 * 1000));
		res.status(http).json({
			status: http,
			error: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
			message: `Please, wait ${minutes} minute(s) before trying again.`,
			retryAfter: minutes
		})
	},
	standardHeaders: true, //return rate limit info in the 'RateLimit-*' headers
	legacyHeaders: false //disable the 'X-RateLimit-*' headers
})
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Auth
//------------------------------------------------------------------------
MAGPIE_SERVER.AUTH = require("./core/auth")
// #endregion
//------------------------------------------------------------------------
/**
 * @name Post
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Post
//------------------------------------------------------------------------
MAGPIE_SERVER.POST = {};
app.post("/login", MAGPIE_SERVER.public.loginLimiter, async (req, res) => {
	const ePrefix = "[APP POST].login: ";
	const { email, pass } = req.body;
	try
	{
		const badRequest = MAGPIE.KEY.SERVER.HTTP.STATUS_400;
		const unauthorized = MAGPIE.KEY.SERVER.HTTP.STATUS_401;
		const forbidden = MAGPIE.KEY.SERVER.HTTP.STATUS_403;
		const serverError = MAGPIE.KEY.SERVER.HTTP.STATUS_500;
		if(!email || !pass)
			return res.status(badRequest).json({
				error: ePrefix + "Missing credentials"
			})
		const player = await MAGPIE_DATABASE.loginPlayer(email, pass);
		if(!player) return res.status(unauthorized).json({
			error: ePrefix + "Invalid credentials"
		})
		if(player.isFrozen === 1)
			return res.status(forbidden).json({
				error: ePrefix + MAGPIE.KEY.SERVER.HTTP.STATUS_403.message
			})
		const token = MAGPIE_SERVER.AUTH.signToken(player.ID);
		return res.status(successful).json( { token });
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		return res.status(serverError).json({
			error: ePrefix + "Internal Server Error"
		})
	}
})
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Socket
//------------------------------------------------------------------------
MAGPIE_SERVER.SOCKET = {};
MAGPIE_SERVER.SOCKET.auth_failed = function auth_failed(socketID, errorMessage)
{
	const err = new Error(errorMessage);
	return MAGPIE_SERVER.error(`[AUTH FAILED] [SOCKET-${socketID}] `
		+ `invalid: ${err.message}`, err);
}
MAGPIE_SERVER.SOCKET.auth_dev = function auth_dev(socketID)
{
	return MAGPIE_SERVER.log("[AUTH DEV] Dev_mode active: bypassing JWT for "
		+ `[SOCKET-${socketID}]`
	)
}
io.use((socket, next) => {
	const token = socket.handshake.auth?.token;
	const config = MAGPIE.config;
	const isDev = config.devMode;
	if(!token) 
	{
		socket.data.playerID = isDev ? "999" : "0";
		return next();
	}
	try
	{
		const secret = config.jwtSecret || "dev_secret";
		const payload = MAGPIE_SERVER.JWT.verify(token, secret);
		socket.data.playerID = String(payload.playerID || payload.guestID || "0");
		next();
	}
	catch(e)
	{
		socket.data.playerID = "0";
		MAGPIE_SERVER.SOCKET.auth_failed(socket.id, e.message);
		next();
	}
})
io.on("connection", (socket) => {
	const playerID = String(socket.data.playerID);
	const ePrefix = `[SOCKET-${socket.id}] [PLAYER-${playerID}]: `;
	socket.use(([event, ...args], next) => {
		MAGPIE_SERVER.log(`${ePrefix} ${event} — ${JSON.stringify(args)}`, "console", false);
		if(socket.data.isFrozen && event !== "chat message")
		{
			socket.emit("error_message", "You are frozen!");
			return
		}
		next()
	})
	MAGPIE_SERVER.HANDLER.forEach(handler => handler(io, socket));
	socket.on("disconnect", (reason) => {
		if(playerID !== 0)
			MAGPIE_SERVER.log(`${ePrefix} disconnected — ${reason}`, "console", false);
		socket.watchID = null;
	})
	socket.on("error", (err) => {
		socket.emit("error_message", err.message);
	})
})
// #endregion
//------------------------------------------------------------------------
/**
 * @name boot
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Boot
//------------------------------------------------------------------------
MAGPIE_SERVER.BOOT = {}
MAGPIE_SERVER.BOOT.meta = {};
/**
 * @typedef {Number} exit_signal
 * @param {exit_signal} signal 
 */
MAGPIE_SERVER.BOOT.shutdown = async function shutdown(signal = 0)
{
	const message = "[BOOT].shutdown: ";
	MAGPIE_SERVER.CLI._createLoadBar();
	MAGPIE_SERVER.CLI._updateLoadBar();
	MAGPIE_SERVER.log(message + `[SIGNAL-${signal}] received: initiating shutdown sequence...`);
	if(io)
	{
		await io.close((err) => {
			if(err) MAGPIE_SERVER.log(message + "[io] " + err.message);
			MAGPIE_SERVER.log("Socket.io server closed.", false);
			MAGPIE_SERVER.CLI._incrementLoadBar(10);
			MAGPIE_SERVER.SERVER.close((err) => {
				if(err) MAGPIE_SERVER.log(message + "[express] ", err.message);
				MAGPIE_SERVER.log("HTTP server closed.", false);
				MAGPIE_SERVER.CLI._incrementLoadBar(10);
				MAGPIE_SERVER.CLI._updateLoadBar(100);
				MAGPIE_SERVER.log(message + "sequence complete. Exiting...\n" + 
					"----------------------------------\n\n"
				)
				MAGPIE_SERVER.CLI._stop();
				return process.exit(signal);
			})
		});
		setTimeout(() => {
			const error = new Error(`Shutdown timeout: forcing shutdown...
				-------------------------------\n\n`);
			MAGPIE_SERVER.error(error.message, error);
			return process.exit(0);
		}, 10000);
	}
}
MAGPIE_SERVER.restart = function restart()
{
	return MAGPIE_SERVER.BOOT.shutdown(2);
}
MAGPIE_SERVER.BOOT.connect = async function connect()
{
	const S = MAGPIE.KEY.SERVER;
	MAGPIE_SERVER.SERVER = server.listen(S.PORT, "0.0.0.0", () => {
		const message = `${S.MESSAGE.BOOTED}${MAGPIE_SERVER.config.domain}:${S.PORT}...`;
		MAGPIE_SERVER.log(message);
	})
	MAGPIE_SERVER.CLI._incrementLoadBar(20);
	return true
}
MAGPIE_SERVER.BOOT.logBootTime = function logBootTime()
{
	const bootTime = `[BOOT time: ${MAGPIE_SERVER.perf.end = performance.now()}]`;
	const version = MAGPIE_SERVER.UTILITY.version(MAGPIE.meta.version);
	const splash = `${MAGPIE.meta.name} v${version} ${MAGPIE.meta.firmwareDate}`
	MAGPIE_SERVER.log(`${splash} ${bootTime}`)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Setup
//------------------------------------------------------------------------
/**
 * 
 */
MAGPIE_DATABASE.setup = function setup()
{
	const ePrefix = "[DATABASE].setup: ";
	const integer = "INTEGER NOT NULL";
	const integerKey = "INTEGER PRIMARY KEY";
	const blob = "JSON NOT NULL";
	const text = "TEXT NOT NULL";
	const textKey = "TEXT PRIMARY KEY";
	/** @type {Map<String, database_result[]>} */
	const tables = new Map();
	try
	{
		const logs = this.sync.createServerTable("MAGPIE_LOG", {
			ID: integerKey,
			gravity: integer,
			urgency: integer
		});
		tables.set("logs", logs);
		const entities = this.sync.createWorldTable("MAGPIE_ENTITY", {
			ID: integerKey,
			type: integer,
			updated: integer,
			data: blob
		});
		tables.set("entities", entities);
		const events = this.sync.createWorldTable("MAGPIE_EVENT", {
			ID: integerKey,
			type: integer,
			status: integer,
			updated: integer,
			data: blob
		})
		tables.set("events", events);
		const keys = this.sync.createWorldTable("MAGPIE_KEY", {
			ID: integerKey,
			type: integer,
			data: blob
		});
		tables.set("keys", keys);
		const metastate = this.sync.createWorldTable("MAGPIE_METASTATE", {
			key: textKey,
			data: blob
		});
		tables.set("metastate", metastate);
		const players = this.sync.createServerTable("MAGPIE_PLAYER", {
			ID: integerKey,
			username: text,
			email: text,
			PASS: text,
			isFrozen: integer,
			data: blob
		})
		tables.set("players", players);
		const results = Array.from(tables.entries());
		if(results.every((r) => r[1])) return results
			throw new Error(`unable to setup [${results.filter(r => !r[1])}]`);
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
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
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - PAD
//========================================================================
MAGPIE_SERVER.scratchpad = {};
MAGPIE_SERVER.scratchpad.file = path.join(__dirname, "plugins", "scratchpad.js");
MAGPIE_SERVER.scratchpad.load = async function load(fileName)
{
	const filePath = path.join(__dirname, "plugins", fileName);
	const prefix = "[SCRATCHPAD].load: ";
	try
	{
		const { content, startMarker, startIndex, endIndex } = MAGPIE_SERVER.scratchpad.read();
		if(startIndex === -1 || endIndex === -1)
			return console.log(prefix = "regions not found. Skipping execution");
		const codeToRun = content
			.substring(startIndex + startMarker.length, endIndex).trim();
		if(!codeToRun) 
		{
			console.log(prefix + "no code found");
			return r.displayPrompt() 
		}
		const sandbox = {
			MAGPIE_SERVER,
			api: MAGPIE_SERVER.api,
			console,
			require
		};
		vm.createContext(sandbox);
		await new Promise((resolve) => setTimeout(() => {
			try
			{
				eval(codeToRun);
				console.log("ok");
				resolve()
			}
			catch(e)
			{
				console.error(e);
			}
		}, 100));
		MAGPIE_SYSTEM.PS.playSound(MAGPIE.KEY.WMEDIA.CHORD);
		const newContent = content.substring(0, startIndex + startMarker.length)
			+ "\n\n" + content.substring(endIndex);
		fs.writeFileSync(filePath, newContent);
		console.log(prefix + `[PUNCH-IN: ${filePath}] executed and cleared`);
		r.displayPrompt();
	}
	catch(e)
	{
		console.error(prefix + "error: ", e);
	}
}
MAGPIE_SERVER.scratchpad.read = function read()
{
	const filePath = path.join(__dirname, "plugins", "scratchpad.js");
	const content = fs.readFileSync(filePath, "utf-8");
	const startMarker = "// #region - Scratchpad";
	const endMarker = "// #endregion";
	const startIndex = content.indexOf(startMarker);
	const endIndex = content.indexOf(endMarker);
	return { content, startMarker, endMarker, startIndex, endIndex }
}
MAGPIE_SERVER.scratchpad.log = function log(input)
{
	const prefix = "[SCRATCHPAD].load: ";
	const filePath = path.join(__dirname, "plugins", "scratchpad.js");
	fs.appendFileSync(filePath, `\n\n${input}\n`);
	console.log(prefix + `[PUNCH-OUT: ${filePath}] logged`);
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
 * @name BOOT
 * @desc 
 * 
 */
//========================================================================
// #region - BOOT
//========================================================================
const REPL = require("repl");
console.clear();
const r = REPL.start("MAGPIE_SERVER > ")
MAGPIE_SERVER.CLI._createLoadBar();
MAGPIE_SERVER.CLI._updateLoadBar(0);
MAGPIE_SERVER._REPL_boot();
MAGPIE_SERVER.RUNTIME = new MAGPIE_RUNTIME();
MAGPIE_SERVER.DATABASE = MAGPIE_DATABASE;
MAGPIE_SERVER.HIVE = new MAGPIE_HIVE();
MAGPIE_SERVER.HIVE.setup();
MAGPIE_SERVER.CLI._incrementLoadBar(5);
r.context.SERVER = MAGPIE_SERVER;
r.context.RUNTIME = MAGPIE_SERVER.RUNTIME;
r.context.HIVE = MAGPIE_SERVER.HIVE;
r.context.DATABASE = MAGPIE_SERVER.DATABASE;
r.context.PHYSICS = MAGPIE_PHYSICS;
MAGPIE_SERVER.CLI._updateLoadBar(20);
r.context.io = io;
MAGPIE_SERVER.BOOT.connect()
	.then(() => {
		// MAGPIE_EMOTE.setup();
		// MAGPIE_DATABASE.sitrep();
		MAGPIE_SERVER.CLI._incrementLoadBar(5);
		MAGPIE_SERVER.RUNTIME.loadMetastate();
		MAGPIE_SERVER.RUNTIME.host("HIVE", 0);
		MAGPIE_SERVER.RUNTIME.awake();
		MAGPIE_SERVER.HIVE.awake()
		MAGPIE_SERVER.CLI._incrementLoadBar(5);
		MAGPIE_SERVER.CLI._incrementLoadBar(10);
		MAGPIE_SERVER.CLI._updateLoadBar(100);
		MAGPIE_SERVER.CLI._stop();
		setTimeout(() => {
			// console.clear();
			MAGPIE_SERVER.BOOT.logBootTime();
			r.displayPrompt();
			}, 100);
		
	});
	fs.watchFile(MAGPIE_SERVER.scratchpad.file, { interval: 1000 }, (curr, prev) => {
	if(curr.mtime > prev.mtime) {
		console.log("--- Executing VS code scratchpad --- ")
		MAGPIE_SERVER.scratchpad.load("scratchpad.js");
	}
})
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * 
 * @desc back to {@link MAGPIE_SERVER}
 *
 */
//========================================================================
// #END OF FILE
//========================================================================