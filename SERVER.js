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
const { 
	MAGPIE_SYSTEM,
	MAGPIE_IO,
	MAGPIE_RUNTIME,
	MAGPIE_METASTATE,
	MAGPIE_PHYSICS
} = require("./core/system");
const { MAGPIE_DATABASE } = require("./core/database");
MAGPIE_SERVER.meta = {}
MAGPIE_SERVER.perf = {};
MAGPIE_SERVER.perf.start = performance.now();
MAGPIE_SERVER.perf.end = NaN;
MAGPIE_SERVER.config = require("./core/config");
// #endregion
//------------------------------------------------------------------------
/**
 * @name Key
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Key
//------------------------------------------------------------------------
MAGPIE.KEY.SERVER = {};
MAGPIE.KEY.SERVER.DOMAIN = MAGPIE_SERVER.config.domain;
MAGPIE.KEY.SERVER.PORT = MAGPIE_SERVER.config.port;
MAGPIE.KEY.SERVER.JWT_SECRET = MAGPIE_SERVER.config.jwtSecret;
MAGPIE.KEY.SERVER.LOGIN_COOLDOWN = 15;
MAGPIE.KEY.SERVER.LOGIN_MAX = 5;
MAGPIE.KEY.SERVER.MESSAGE = {};
MAGPIE.KEY.SERVER.MESSAGE.BOOT = "BOOT SEQUENCE";
MAGPIE.KEY.SERVER.MESSAGE.BOOTED = "SERVER ONLINE listening on: ";
MAGPIE.KEY.SERVER.MESSAGE.STATUS_403 = "Too many requests!";
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
MAGPIE_SERVER.LOG = {};
MAGPIE_SERVER.LOG.errors = [];
/**
 * 
 * @param {String} contents 
 * @returns {new MAGPIE_LOG}
 */
function MAGPIE_LOG(contents = "")
{
	this.initialize(contents)
}
MAGPIE_LOG.prototype.initialize = function initialize(contents)
{
	this.ID = Date.now();
	this.contents = contents;
}
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
	return MAGPIE_SYSTEM._debug(message);
}
MAGPIE_SERVER.log_exp = function logExpActivity(message)
{
	return MAGPIE_SYSTEM.log_exp(message);
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
/**
 * 
 * @param {Number[]} version 
 * @returns {String} MAJOR.MINOR.PATCH
 */
MAGPIE_SERVER.version = function version(version)
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
MAGPIE_SERVER._CTZD = function CTZD()
{
	return MAGPIE_SYSTEM.Utility.CTZD()
}
/**
 * @typedef {import("./core/system").CTZ} CTZ
 * @returns {CTZ} YYYYMMDDHHMM
 */
MAGPIE_SERVER._CTZ = function CTZ()
{
	return MAGPIE_SYSTEM.Utility.CTZ();
}
/**
 * @typedef {import("./core/system").CTZT} CTZT
 * @returns {CTZT} HHMM
 */
MAGPIE_SERVER._CTZT = function CTZT()
{
	return MAGPIE_SYSTEM.Utility.CTZT();
}
/**
 * @typedef {import("./core/system").CTZTS} CTZTS
 * @returns {CTZTS} HHMMSS
 */
MAGPIE_SERVER._CTZTS = function CTZTS()
{
	return MAGPIE_SYSTEM.Utility.CTZTS()
}
/**
 * @typedef {import("./core/system").CTZF} CTZF
 * @returns {CTZF} YYYYMMDDHHMMSSmmm
 */
MAGPIE_SERVER._CTZF = function CTZF()
{
	return MAGPIE_SYSTEM.Utility.CTZF()
}
/**
 * @typedef {import("./core/system").epoch_real} epoch_real
 * @returns {epoch_real}
 */
MAGPIE_SERVER._epoch = function epoch()
{
	return Date.now();
}
/**
 * 
 * @returns {CTZ} [YYYYMMDDHHMM]
 */
MAGPIE_SERVER._consoleTime = function consoleTime()
{
	return `[${this._CTZ()}Z] `
}
/**
 * 
 * @returns {CTZF} [YYYYMMDDHHMMSSmmm]
 */
MAGPIE_SERVER._logTime = function logTime()
{
	return `[${this._CTZF()}Z] `
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name REPL
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > REPL
//------------------------------------------------------------------------
MAGPIE_SERVER.context = {};
MAGPIE_SERVER.registry = require("./core/database");
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
 * @name BOOT
 * @desc 
 * 
 */
//========================================================================
// #region - BOOT
//========================================================================
const REPL = require("repl");
const r = REPL.start({
    prompt: "MAGPIE_SERVER > ",
    terminal: true
});
console.clear();
MAGPIE_SERVER.CLI._createLoadBar();
MAGPIE_SERVER.CLI._updateLoadBar();
MAGPIE_SERVER._REPL_boot();
r.context.SERVER = MAGPIE_SERVER;
r.context.RUNTIME = new MAGPIE_RUNTIME();
// r.context.HIVE = new MAGPIE_HIVE();
r.context.DATABASE = MAGPIE_DATABASE;
MAGPIE_SERVER.CLI._updateLoadBar(20);
r.context.io = io;
MAGPIE_SERVER.BOOT.connect()
	.then(() => {
		// MAGPIE_EMOTE.setup();
		// MAGPIE_DATABASE.sitrep();
		// MAGPIE_SERVER.RUNTIME.awake();
		setTimeout(() => {
			MAGPIE_SERVER.CLI._updateLoadBar(100);
			MAGPIE_SERVER.CLI._stop();
			r.displayPrompt();
		}, 2000);
		const bootTime = `[BOOT time: ${MAGPIE_SERVER.perf.end = performance.now()}]`;
		const version = MAGPIE_SERVER.version(MAGPIE.meta.version);
		const splash = `${MAGPIE.meta.name} v${version} ${MAGPIE.meta.firmwareDate}`
		MAGPIE_SERVER.log(`${splash} ${bootTime}`)
	});
	// fs.watchFile(MAGPIE_SERVER.scratchpad.file, { interval: 1000 }, (curr, prev) => {
// 	if(curr.mtime > prev.mtime) {
// 		console.log("--- Executing VS code scratchpad --- ")
// 		MAGPIE_SERVER.scratchpad.load("scratchpad.js");
// 	}
// })
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