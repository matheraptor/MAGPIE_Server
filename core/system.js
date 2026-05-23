/**
 * @name 
 * @desc 
 * @version 0.22.27
 */
//========================================================================
// #region - INDEX
//========================================================================
const { MAGPIE } = require("./index");
const fs = require("fs");
const path = require("path");
const { performance } = require("node:perf_hooks");
const { exec } = require("child_process");
const { Worker } = require("worker_threads");
const data = require("../data/emotes");
function MAGPIE_SYSTEM()
{
    this.initialize();
}
/**
 * @name LOG
 * @typedef {Enumerator<Number>} urgency
 * @typedef {Enumerator<Number>} gravity
 * @typedef {{
 * contents: String,
 * urgency: urgency,
 * gravity: gravity
 * }} log_data
 * @param {String} data 
 * @returns {new MAGPIE_LOG}
 */
function MAGPIE_LOG(data = {})
{
	this.initialize(data)
}
function MAGPIE_IO()
{
    this.initialize(...arguments);
}
/**
 * @returns {new MAGPIE_RUNTIME}
 */
function MAGPIE_RUNTIME()
{
    this.initialize(...arguments);
}
/**
 * @desc {@link MAGPIE_HIVE.meta.name}
 */
class MAGPIE_HIVE
{
	//
}
/** @param {metastate_data} data @returns {new MAGPIE_METASTATE} */
function MAGPIE_METASTATE(data = {})
{
    this.initialize(data);
}
/** 
 * @param {calendar_data} data 
 * @returns {new {
 * calendarID: Number,
 * days: Number,
 * months: {
 * monthName: days<Number>
 * },
 * leapMonth: Number,
 * leapYear: Number,
 * dayLength: hours<Number>
 * epochYear: Number
 * }} 
 * */
function MAGPIE_CALENDAR(data)
{
	this.initialize(data);
}
/** 
 * @param {date_data} data 
 * @param {date_options} options 
 * @returns {new {
 * calendar: Number,
 * year: Number,
 * month: Number,
 * day: Number,
 * weekDay: Number,
 * hour: Number,
 * minute: Number,
 * second: Number,
 * millisecond: Number,
 * epoch: Number,
 * _firmware: "MAGPIE_DATE"
 * }}
 * 
 * @property {number} calendar - description
 * */
function MAGPIE_DATE(data, options = {})
{
	this.initialize(data, options)
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - INDEX
//========================================================================
/**
 * @name System
 * @desc system
 */
//========================================================================
// #region - SYSTEM
//========================================================================
MAGPIE_SYSTEM.meta = {};
/**
 * @name prototype
 * @desc 
 * @typedef {import("./index").index} index
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
/**
 * 
 */
MAGPIE_SYSTEM.prototype.initialize = function initialize()
{
	this.meta = {
		name: "",
		version: MAGPIE.meta.version,
		firmwareName: "",
		firmwareDate: MAGPIE.meta.firmwareDate,
		desc: "",
		isSystem: true
	};
	this.isInit = true;
	this.isActive = false;
}
MAGPIE_SYSTEM.refresh = function refresh()
{
	//
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > Math
//------------------------------------------------------------------------
MAGPIE_SYSTEM.Math = {};
/**
 * 
 * @author Matheraptor
 * @param {Number} number
 * @param {Number} min default: 0 
 * @param {Number} max default: 1
 * @returns {Number}
 */
MAGPIE_SYSTEM.Math.clampRange = function clampRange(number, min = 0, max = 1)
{
	return Math.min(Math.max(number, min), max)
}
/**
 * 
 * @author Matheraptor
 * @param {Number} n1
 * @param {Number} n2 modulo (%) divisor 
 * @returns {new Number} positive value
 */
MAGPIE_SYSTEM.Math.modAbs = function modAbs(n1, n2 = 0)
{
	return Math.abs(n1 % n2)
}
MAGPIE_SYSTEM.Math.pad0 = function pad0(number, length = 0)
{
	const n = String(number);
	if(!length) length = n.length;
	return n.padStart(length, 0)
}
MAGPIE_SYSTEM.Math.randomRange = function randomRange(range = 1)
{
	return Math.floor(range * Math.random())
}
MAGPIE_SYSTEM.Math.convertRadToDeg = function convertRadToDeg(radians)
{
	return radians * (180 / Math.PI)
}
MAGPIE_SYSTEM.Math.convertDegToRad = function convertDegToRad(degrees)
{
	return degrees * (Math.PI / 180)
}
//#endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > String
//------------------------------------------------------------------------
MAGPIE_SYSTEM.String = {};
/**
 * @desc addon for {@link MAGPIE_SYSTEM} 
 * @param {String} string
 * @author Matheraptor
 * @returns {new String} original string with the first character uppercase
 */
MAGPIE_SYSTEM.String.firstCharUpperCase = function firstCharUpperCase(string)
{
	return string.charAt(0).toUpperCase() + string.slice(1);
}
MAGPIE_SYSTEM.String.insert = function insert(string1, index = 0, string2 = "")
{
	return `${string1.slice(0, index + 1)}${string2}${string1.slice(index + 1)}`
}
//#endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > Array
//------------------------------------------------------------------------
MAGPIE_SYSTEM.Array = {};
/**
 * @addon for {@link MAGPIE_SYSTEM}
 * @author Matheraptor
 * @param {Array} array
 * @param {predicate} predicate to evaluate
 * @returns {Number} the last index by given predicate
 */
MAGPIE_SYSTEM.Array.findIndexLast = function findIndexLast(array, predicate)
{
	for(let i = array.length - 1; i > -1; i--) 
		if(predicate(array[i])) return i
}
/**
 * @addon for {@link MAGPIE_SYSTEM}
 * @author Matheraptor
 * @param {Array} array
 * @param {Number} index to slice in 'item' (default: 0) 
 * @param {*} item to push at index (default: null) 
 * @returns {new Array} [...sliceToIndex, item, ...sliceFromIndex]
 */
MAGPIE_SYSTEM.Array.insert = function insert(array, index = 0, item = null)
{
	let newArray = [
		...array.valueOf().slice(0, index),
		item,
		...array.valueOf().slice(index)
	];
	return newArray
}
/**
 * @addon for {@link MAGPIE_SYSTEM}
 * @author Matheraptor
 * @param {Array} array
 * @param {Number} chunkSize to split array by (default: 1)
 * @returns {new Array} [...chunks]
 */
MAGPIE_SYSTEM.Array.chunkSplit = function chunkSplit(array, chunkSize = 1)
{
	let chunks = [];
	if(isNaN(chunkSize) || chunkSize < 1 || chunkSize > array.length)
		return
	const n = Math.ceil(array.length / chunkSize);
	for(let i = 0; i < n; i += chunkSize) 
		chunks.push(array.slice(i, i + chunkSize))
	return chunks
}
MAGPIE_SYSTEM.Array.pluck = function pluck(array, index = 0)
{
	if(index < 2) return array
	array[index] = array[array.length - 1];
	array.pop();
	return array
}
//#endregion
//------------------------------------------------------------------------
/**
 * @name Powershell
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Powershell
//------------------------------------------------------------------------
MAGPIE_SYSTEM.PS = {};
/**
 * 
 * @param {String} soundfile 
 * @param {{}} options 
 * @returns 
 */
MAGPIE_SYSTEM.PS.playSound = function playSound(soundfile = "", options = {})
{
	return exec(`powershell -c "(New-Object Media.SoundPlayer ${soundfile}).PlaySync()"`)
}
// #endregion 
//------------------------------------------------------------------------
/**
 * @name logging
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Logging
//------------------------------------------------------------------------
MAGPIE_SYSTEM.logging = {};
MAGPIE_SYSTEM.logging.worker = new Worker(path.resolve("./core/workers/fsio.js"));
MAGPIE_SYSTEM.logToWorker = function logToWorker(level, message, filename)
{
	const logEntry = JSON.stringify({
		timestamp: MAGPIE_SYSTEM.Utility.CTZ(),
		level,
		message,
		filename
	})
	MAGPIE_SYSTEM.logging.worker.postMessage(logEntry)
}
/**
 * 
 * @param {String} message 
 * @param {String} prefix 
 * @param {Boolean} logToConsole 
 */
MAGPIE_SYSTEM.log = function log(message, prefix = "console", logToConsole = true)
{
	const date = MAGPIE_SYSTEM.Utility.CTZD();
	const logTime = this.logging.logTime();
	const consoleTime = this.logging.consoleTime();
	const log = (typeof message === "object" 
		? JSON.stringify(message, null, 2)
		: message
	);
	if(logToConsole)
	{
		if(this.CLI?.loadbar?.isActive)
			this.CLI.loadbar.log('\x1b[1A\x1b[2K\r' + consoleTime + log + '\n')
		else console.log(consoleTime + log);
		global.r?.displayPrompt(true);
	}
	
	if(typeof prefix === 'string')
	{
		const filename = `.logs/${prefix}${date}.txt`;
		const timestamp = logTime;
		const level = prefix.toUpperCase();
		MAGPIE_IO.append(filename, timestamp, level, log);
	}
}
MAGPIE_SYSTEM.prototype.log = MAGPIE_SYSTEM.log;
/**
 * 
 * @param {String} errorMessage 
 * @param {Error} error
 */
MAGPIE_SYSTEM.error = function error(errorMessage, error)
{
	const log = errorMessage;
	const date = this.Utility.CTZD();
	const full = `[${this.Utility.CTZF()}]`;
	MAGPIE_LOG.errors.push(log);
	console.error(`[ERROR] ${errorMessage} | `, error);
	const timestamp = full;
	const filename = `.logs/error${date}.txt`;
	const logged = MAGPIE_IO.append(filename, 
		full, "ERROR",log + "\n" + error?.stack + "\n---\n");
	// r.displayPrompt();
}
MAGPIE_SYSTEM.prototype.error = MAGPIE_SYSTEM.error;
/**
 * 
 * @param {String} message 
 * @returns 
 */
MAGPIE_SYSTEM._logging_debug = function _logging_debug(message)
{
	//
}
/**
 * 
 * @param {String} message 
 * @returns 
 */
MAGPIE_SYSTEM.logging.log_exp = function logExpActivity(message)
{
	return MAGPIE_SYSTEM.log(message, "exp", false)
}
MAGPIE_SYSTEM.prototype.log_exp = MAGPIE_SYSTEM.log_exp;
/**
 * 
 * @returns {CTZ} [YYYYMMDDHHMM]
 */
MAGPIE_SYSTEM.logging.consoleTime = function consoleTime()
{
	return `[${MAGPIE_SYSTEM.Utility.CTZ()}Z] `
}
/**
 * 
 * @returns {CTZF} [YYYYMMDDHHMMSSmmm]
 */
MAGPIE_SYSTEM.logging.logTime = function logTime()
{
	return `[${MAGPIE_SYSTEM.Utility.CTZF()}Z] `
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
MAGPIE_SYSTEM.Utility = {};
/**
 * @typedef {{millisecond: Boolean, second: Boolean, date: Boolean}} date_options {second: boolean, millisecond: boolean, date: boolean}
 * @typedef {String} CTZ YYYYMMDDHHMM
 * 
 * @option {second: true} to include seconds
 * @option {millisecond: true} to include both seconds and milliseconds
 * @option {date: true} to only include the date and not the time 
 * @param {Date} date 
 * @param {date_options} options 
 * @returns {String} 
 */
MAGPIE_SYSTEM.Utility.CTZ = function CTZ(date, options = {})
{
	if(!(date instanceof Date)) 
	{
		if(Object.prototype.toString.call(date) === "[object Object]")
		{
			options = date;
		}
		date = new Date();
	}
	const now = date;
	let year = now.getUTCFullYear().toString().padStart(4, 0);
	let month = (now.getUTCMonth() + 1).toString().padStart(2, 0);
	let day = now.getUTCDate().toString().padStart(2, 0);
	let hour = now.getUTCHours().toString().padStart(2, 0);
	let minute = now.getUTCMinutes().toString().padStart(2, 0);
	let second = "";
	let millisecond = "";
	if(options?.millisecond) 
	{
		millisecond = now.getUTCMilliseconds().toString().padStart(3,0);
		options.second = true;
	}
	if(options?.second) second = now.getUTCSeconds().toString().padStart(2,0);
	if(options?.date) 
	{
		hour = ""; minute = "", second = ""; millisecond = "";
	}
	if(options?.time)
	{
		year = ""; month = ""; day = "";
	}
	const stamp = year + month + day + hour + minute + second + millisecond;
	return stamp
}
/**
 * @typedef {String} CTZD YYYYMMDD
 * @returns {CTZD} YYYYMMDD
 */
MAGPIE_SYSTEM.Utility.CTZD = function CTZD()
{
	return this.CTZ({date: true})
}
/**
 * @typedef {String} CTZT HHMM
 * @returns {CTZT} HHMM
 */
MAGPIE_SYSTEM.Utility._CTZT = function CTZT()
{
	return this.CTZ({time: true});
}
/**
 * @typedef {String} CTZTS HHMMSS
 * @returns {CTZTS} HHMMSS
 */
MAGPIE_SYSTEM.Utility.CTZTS = function CTZTS()
{
	return MAGPIE_SYSTEM.Utility.CTZ({time: true, second: true})
}
/**
 * @typedef {String} CTZF YYYYMMDDHHMMSSmmm
 * @returns {CTZF} YYYYMMDDHHMMSSmmm
 */
MAGPIE_SYSTEM.Utility.CTZF = function CTZF()
{
	return this.CTZ({millisecond: true})
}
MAGPIE_SYSTEM.prototype.CTZ = MAGPIE_SYSTEM.Utility.CTZ;
/**
 * @typedef {Number} epoch_real Date.now() - ms since true epoch
 * 
 * @returns {epoch_real} 
 */
MAGPIE_SYSTEM.Utility.epoch = function epoch()
{
	return Date.now()
}
MAGPIE_SYSTEM.prototype.epoch = MAGPIE_SYSTEM.Utility.epoch;
/**
 * @typedef {Number} epoch_real_s Date.now() in seconds 
 * 
 * @returns {epoch_real_s} 
 */
MAGPIE_SYSTEM.Utility.now = function now()
{
	const now = Math.floor(Date.now() / 1000);
	return now
}
MAGPIE_SYSTEM.prototype.now = MAGPIE_SYSTEM.Utility.now;

MAGPIE_SYSTEM.Utility.aggregator = function aggregator(list = [])
{
	if(list.length < 1) return [];
	list.sort((a, b) => a - b);
	const stack = Object.entries(list.reduce((acc, id) => {
		acc[id] = (acc[id] || 0) + 1;
		return acc;
	}))
	return stack
}
/**
 * @typedef {{
 * years: Number,
 * months: Number,
 * days: Number,
 * hours: Number,
 * minutes: Number,
 * seconds: Number}} time_interval n year(s), n month(s), n day(s), n hour(s), 
 * n minute(s) n second(s)
 * 
 * @typedef {String} interval_text time interval printed in En
 * 
 * @param {time_interval} interval 
 * @returns {interval_text} 
 */
MAGPIE_SYSTEM.Utility._printInterval = function _printInterval(interval)
{
	const ePrefix = `[SYSTEM].printInterval: `;
	try
	{
		let message = "";
		const years = interval?.years;
		const months = interval?.months;
		const days = interval?.days;
		const hours = interval?.hours;
		const minutes = interval?.minutes;
		const seconds = interval?.seconds;
		if(years) 
			message += `${years} year${years > 1 ? "s" : ""}, `;
		if(months)
			message += `${months} month${months > 1 ? "s" : ""}, `;
		if(days) 
			message += `${days} day${days > 1 ? "s" : ""}, `;
		if(hours)
			message += `${hours} hour${hours > 1 ? "s" : ""}, `;
		if(minutes)
			message += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
		if(seconds)
			message += `${seconds} second${seconds > 1 ? "s" : ""}`;
		message = message.trimEnd();
		if(message.endsWith(",", message.length - 1))
			message = message.slice(0, message.at(-1));
		return message
	}	
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
MAGPIE_SYSTEM.prototype._printInterval = MAGPIE_SYSTEM.Utility._printInterval;
/**
 * 
 * @param {duration} seconds 
 * @returns {String} Estimated Time of Arrival, printed in En
 */
MAGPIE_SYSTEM.Utility.printETA = function printETA(seconds)
{
	const ePrefix = `[SYSTEM].printETA: `;
	try
	{
		const ETA_s = seconds;
                let ETA = "";
                const ETA_sec = ETA_s % 60;
                const ETA_min = Math.floor(ETA_s / 60) % 60;
                const ETA_hour = Math.floor(ETA_s / 3600 ) % 24;
                const ETA_days = Math.floor(ETA_s / (3600 * 24));
                if(ETA_days) ETA += `${ETA_days}d `;
                if(ETA_hour) ETA += `${ETA_hour}h `;
                if(ETA_min) ETA += `${ETA_min}m `;
                ETA += `${ETA_sec}s`;
		return ETA
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
MAGPIE_SYSTEM.prototype.printETA = MAGPIE_SYSTEM.Utility.printETA;
/**
 * 
 * @param {Number} ID 
 * @returns {Boolean}
 */
MAGPIE_SYSTEM.Utility.isValidID = function isValidID(ID)
{
	const ePrefix = `[SYSTEM].isValidID: ${ID} `;
	const now = Date.now();
	try
	{
		if(!ID || isNaN(ID))
			throw new Error(`is not a number`);
		if(ID > now)
			throw new Error(`is more recent than ${now} (now)`);
		const epoch = MAGPIE.KEY.PHYSICS.EARTH.ORBIT_DATA.epoch;
		if(ID < epoch)
			throw new Error(`is older than ${epoch} (J2000)`);
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
		return e
	}
}
MAGPIE_SYSTEM.prototype.isValidID = MAGPIE_SYSTEM.Utility.isValidID;
MAGPIE_SYSTEM.Utility.version = function version(version)
{
	if(!version || version.length < 2 || version.some(n => isNaN(n)))
		version = [0,1,0];
	const MAJOR = version[0];
	const MINOR = version[1];
	const PATCH = version[2];
	return `${MAJOR}.${MINOR}.${PATCH}`
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link MAGPIE_SYSTEM.meta}
 *
 */
//========================================================================
// #endregion - SYSTEM
//========================================================================
/**
 * 
 * @param {log_data} data
 * @returns {new MAGPIE_LOG} 
 */
//========================================================================
// #region - LOG
//========================================================================
MAGPIE_LOG.prototype.initialize = function initialize(data)
{
	this.ID = Date.now();
	this.contents = String(data?.contents);
	this.urgency = Number(data?.urgency);
	this.gravity = Number(data?.gravity);
}
MAGPIE_LOG.errors = [];
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name METASTATE
 * @desc 
 * @typedef {{}} metastate_data
 */
//========================================================================
// #region - METAST.
//========================================================================
MAGPIE_METASTATE.meta = {};
/**
 * @name 
 * @desc 
 * @returns {new MAGPIE_METASTATE}
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------

MAGPIE_METASTATE.prototype.initialize = function initialize(data)
{
    const stamp = MAGPIE_SYSTEM.Utility.epoch();
	this.meta = {
		isSystem: true,
		isGamestate: true,
		name: "M.A.G.P.I.E. game metastate",
		desc: "Metadata of the game-verse",
		version: MAGPIE.meta.version,
		firmwareName: "MAGPIE_METASTATE",
		firmwareDate: MAGPIE.meta.firmwareDate,
		created: stamp,
		updated: stamp
	}
	this.date = new MAGPIE_DATE(data?.date);
	this.hive = new Map();
	this.contents = {};
	this._firmware = this.constructor.name;
	this.setup();
}
MAGPIE_METASTATE.prototype.setup = async function setup()
{
	const ePrefix = "[METASTATE].setup: ";
	try
	{
		const version = MAGPIE_SYSTEM.Utility.version(this.meta.version);
		const firmwareDate = this.meta.firmwareDate;
		const date = this.date.printDate();
		const stamp = `[v${version} ${firmwareDate}] `
			+ `[metadate: ${date}]`;
		MAGPIE_SYSTEM.log(ePrefix + stamp)
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > refresh
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} layerID
 * @returns {Promise<Boolean>} 
 */
MAGPIE_METASTATE.prototype.refresh = function refresh(layerID, switchID)
{
	const ePrefix = "[METASTATE].refresh: ";
	try
	{
		if(switchID === 2)
		{
			this.date.TICK()
			this._socketEmit();
		}
		this.meta.updated = Date.now();
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return false
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > TICK
//------------------------------------------------------------------------
MAGPIE_METASTATE.prototype.TICK_base = async function TICK_base(layerID, switchID)
{
	//
}
MAGPIE_METASTATE._TICK_base = MAGPIE_METASTATE.prototype.TICK_base;
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
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
MAGPIE_METASTATE.prototype.save = function save()
{
	//
}
MAGPIE_METASTATE.prototype.load = function load()
{
	//
}
MAGPIE_METASTATE.prototype.syncDate = function syncDate()
{
	const now = new Date();
	const date = this.date;
	date.year = now.getUTCFullYear();
	date.month = now.getUTCMonth() + 1;
	date.day = now.getUTCDate();
	date.hour = now.getUTCHours();
	date.minute = now.getUTCMinutes();
	date.second = now.getUTCSeconds();
	date.weekDay = now.getUTCDay();
	date._yearday = NaN;
	date._yearday = date.yearday();
	return date.printDate();
}
MAGPIE_METASTATE.prototype._socketEmit = function _socketEmit()
{
	//
}
MAGPIE_METASTATE._socketEmit = {};
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
 * @name CALENDAR
 * @desc 
 * @typedef {import("./index").calendar_data} calendar_data
 */
//========================================================================
// #region - CALENDAR
//========================================================================
MAGPIE_CALENDAR.meta = {};
MAGPIE_CALENDAR.INDEX = require("../data/calendar");
/**
 * @name MAGPIE_CALENDAR
 * @desc 
 * @param {calendar_data} data
 * @returns {new MAGPIE_CALENDAR}
 */
MAGPIE_CALENDAR.prototype.initialize = function initialize(data)
{
	this.calendarID = Number(data?.ID);
	this.days = Number(data?.days);
	/** @type {{monthName: days<Number>}} */
	this.months = data?.months;
	this.leapMonth = Number(data?.leapMonth);
	this.leapYear = Number(data?.leapYear);
	this.dayLength = Number(data?.dayLength);
	this.epochYear = Number(data?.epoch);
}
//========================================================================
// #endregion MAGPIE_CALENDAR
//========================================================================
/**
 * @name DATE
 * @desc 
 * @typedef {Number} millisecond time in milliseconds (ms)
 * @typedef {Number} second time in seconds (s)
 * @typedef {Number} minute time in minutes (m)
 * @typedef {Number} hour time in hours (h)
 * @typedef {Number} day time in days (D)
 * @typedef {Number} month time in months (M)
 * @typedef {Number} year time in years (Y)
 * @typedef {Number} weekDay index of the day within the week array
 * @typedef {CTZ} gamedate CTZ of current METASTATE date
 * @typedef {Number} epoch_game ms since metadate epoch
 * @typedef {Number} calendarID MAGPIE_CALENDAR.INDEX.get(calendarID)
 * 
 * 
 */
//========================================================================
// #region - DATE
//========================================================================
/**
 * 
 * @param {date_data} date 
 * @param {date_options} options 
 * @returns {new MAGPIE_DATE}
 * 
 * @typedef {{
 * 	calendar: calendarID,
 * 	year: year,
 * 	month: month,
 * 	day: day,
 *  weekDay: weekDay,
 * 	hour: hour,
 * 	minute: minute,
 * 	second: second,
 * 	millisecond: millisecond,
 * 	epoch: epoch_game
 * }} date_data
 */

//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------

MAGPIE_DATE.prototype.initialize = function initialize(date, options)
{
	const real = new Date();
	const C = MAGPIE.KEY.CALENDAR.GREGORIAN;
	this.calendar = Number(date?.calendar) || C;
	this.year = date?.year || real.getUTCFullYear();
	this.month = date?.month || real.getUTCMonth() + 1;
	this.day = date?.day || real.getUTCDate();
	this.weekDay = date?.weekDay || real.getUTCDay();
	this.hour = date?.hour || real.getUTCHours();
	this.minute = date?.minute || real.getUTCMinutes();
	this.second = date?.second || real.getUTCSeconds();
	this.millisecond = date?.millisecond || real.getUTCMilliseconds();
	this.epoch = Number(date?.epoch) || this.getEpoch();
	this._yearday = Number(this.yearday())
	this._firmware = "MAGPIE_DATE";
}
/**
 * 
 * @returns {calendar_data}
 */
MAGPIE_DATE.prototype.getCalendar = function getCalendar()
{
	return MAGPIE_CALENDAR.INDEX.get(this.calendar);
}
/**
 * @returns {millisecond}
 */
MAGPIE_DATE.prototype.getEpoch = function getEpoch()
{
	const ePrefix = "[DATE].getEpoch: ";
	try
	{
		let seconds = 0;
		seconds += this.second;
		seconds += this.minute * 60;
		seconds += this.hour * (60**2);
		const calendar = this.getCalendar();
		const daySeconds = calendar.dayLength * (60**2);
		const epochYear = calendar.epochYear;
		const elapsedYears = this.year - epochYear;
		const days = (this.yearday() - 1) + (calendar.days * elapsedYears);
		seconds += days * daySeconds;
		return (seconds * 1000) + this.millisecond;
	} 
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
MAGPIE_DATE.prototype.getWeekDayName = function getWeekDayName()
{
	const calendar = this.getCalendar();
	const weekDay = this.weekDay;
	const day = calendar.weekDays[weekDay];
	return day
}
/**
 * 
 * @returns {day}
 */
MAGPIE_DATE.prototype.yearday = function yearday()
{
	let yearday = 0;
	yearday += this.day;
	const monthdays = Object.values(this.getCalendar().months)
		.filter((m, i) => i < this.month - 1)
		.forEach(n => yearday += n)
	if(this.isLeapYear() && this.month > this.getCalendar().leapMonth)
		yearday++;
	return yearday
}
/**
 * 
 * @returns {Boolean}
 */
MAGPIE_DATE.prototype.isLeapYear = function isLeapYear()
{
	const leapYear = this.calendar.leapYear || 4;
	const epoch = this.calendar.epochYear || 0;
	const leap = (this.year - epoch) % leapYear;
	return leap >= leapYear
}
/**
 * @typedef {Number} binaryBoolean 0 (for false) or 1 (for true)
 * @returns {binaryBoolean}
 */
MAGPIE_DATE.prototype.leapDay = function leapDay()
{
	const leapMonth = this.calendar.leapMonth || 2;
	if(this.isLeapYear() && this.month === leapMonth) return 1
	return 0
}
/**
 * @typedef {String} variableCTZ 
 * @param {{
 * date: Boolean,
 * time: Boolean,
 * second: Boolean,
 * millisecond: Boolean
 * }} options 
 * @returns {variableCTZ} (YYYYMMDD)(HHMM)(SS)(mmm)
 */
MAGPIE_DATE.prototype.printDate = function printDate(options)
{
	let string = "";
	const year = this.pad0(this.year, 4);
	const month = this.pad0(this.month, 2);
	const day = this.pad0(this.day, 2);
	const hour = this.pad0(this.hour, 2);
	const minute = this.pad0(this.minute, 2);
	const second = this.pad0(this.second, 2);
	const millisecond = this.pad0(this.millisecond, 3);
	let date = true;
	let time = true;
	if(options?.date)
	{
		options.time = false;
		time = false
	}
	if(options?.time)
	{
		options.date = false;
		date = false
	}
	if(date)
	{
		string += year;
		string += month;
		string += day;
	}
	if(time)
	{
		string += hour;
		string += minute;
		if(options?.second || options?.millisecond)
		{
			string += second;
			if(options?.millisecond) string += millisecond;
		}
	}
	return string
}
/**
 * 
 * @param {Number} number 
 * @param {Number} length 
 * @returns {String}
 */
MAGPIE_DATE.prototype.pad0 = function pad0(number, length = 0)
{
	return MAGPIE_SYSTEM.Math.pad0(number, length);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name TICK
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > TICK
//------------------------------------------------------------------------

MAGPIE_DATE.prototype.TICK = function TICK()
{
	if(this.second >= 59) return this.superTICK();
	this.millisecond = 0;
	// const K = MAGPIE.KEY.SWITCHES.SUPER_TICK;
	// if(this.second > 10) MAGPIE_SYSTEM.switches.setValue(K, false);
	this.second++;
}
MAGPIE_DATE.prototype.superTICK = function superTICK()
{
	this.second = 0;
	// const K = MAGPIE.KEY.SWITCHES;
	// MAGPIE_SYSTEM.switches.setValue(K.SUPER_TICK, true);
	if(this.minute >= 59) return this.megaTICK();
	// if(this.minute > 0) MAGPIE_SYSTEM.switches.setValue(K.MEGA_TICK, false);
	this.minute++;
}
MAGPIE_DATE.prototype.megaTICK = function megaTICK()
{
	this.minute = 0;
	// const K = MAGPIE.KEY.SWITCHES;
	// MAGPIE_SYSTEM.switches.setValue(K.MEGA_TICK, true);
	const day = this.getCalendar().dayLength || 24;
	if(this.hour >= day - 1) return this.ultraTICK();
	// if(this.hour > 0) MAGPIE_SYSTEM.switches.setValue(K.ULTRA_TICK, false);
	this.hour++;
}
MAGPIE_DATE.prototype.ultraTICK = function ultraTICK()
{
	this.hour = 0;
	this.weekDay >= Object.keys(this.getCalendar().weekDays).length - 1
		? this.weekDay = 0 
		: this.weekDay++
	// const K = MAGPIE.KEY.SWITCHES;
	// MAGPIE_SYSTEM.switches.setValue(K.ULTRA_TICK, true);
	const months = this.getCalendar().months;
	const days = Object.values(months)[this.month - 1];
	const leap = this.leapDay();
	if(this.day >= days + leap) return this.newMonth();
	// if(this.day > 1) MAGPIE_SYSTEM.switches.setValue(K.NEW_MONTH, false);
	this.day++;
}
MAGPIE_DATE.prototype.newMonth = function newMonth()
{
	this.day = 1;
	const months = Object.keys(this.getCalendar().months).length;
	// const K = MAGPIE.KEY.SWITCHES;
	// MAGPIE_SYSTEM.switches.setValue(K.NEW_MONTH, true);
	if(this.month >= months) return this.newYear();
	// if(this.month > 1) MAGPIE_SYSTEM.switches.setValue(K.NEW_YEAR, false);
	this.month++;
}
MAGPIE_DATE.prototype.newYear = function newYear()
{
	this.month = 1;
	// const K = MAGPIE.KEY.SWITCHES;
	// MAGPIE_SYSTEM.switches.setValue(K.NEW_YEAR, true);
	this.year++;
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
 * @name RUNTIME
 * @desc 
 * 
 */
//========================================================================
// #region - RUNTIME
//========================================================================
MAGPIE_RUNTIME.meta = {};
/**
 * @name proto
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_RUNTIME.prototype = Object.create(MAGPIE_SYSTEM.prototype);
MAGPIE_RUNTIME.prototype.constructor = MAGPIE_RUNTIME;
MAGPIE_RUNTIME.prototype.initialize = function initialize()
{
    MAGPIE_SYSTEM.prototype.initialize.call(this);
    this.meta.name = "M.A.G.P.I.E. Runtime System";
    this.meta.desc = "Provides a 'heartbeat' to the process" +
		" and orchestrates the systems."
    this.meta.firmwareName = "MAGPIE_RUNTIME";
	this._lag = 0;
	this._base = 0;
	this._baseFrame = 0;
	this._gameFrame = 0;
	this._game = 0;
    this._TICK = 0;
    this._TICKsuper = 0;
    this._TICKmega = 0;
    this._TICKultra = 0;
    this._now = Date.now();
    this._busy = false;
    this._loop = null;
	this._GuestsBase = [];
	this._GuestsGame = [];
	this._GuestsStandard = [];
	this._GuestsSuper = [];
	this._GuestsMega = [];
	this._GuestsUltra = [];
	/** @type {Map<String, {layerID: Number, index: Number}} */
	this._registry = new Map();
    /** @type {MAGPIE_METASTATE} */
    this.metastate = {};
}
/**
 * 
 * @returns {time_interval}
 */
MAGPIE_RUNTIME.prototype._uptime = function uptime()
{
	const ePrefix = `[RUNTIME].uptime: `;
	try
	{
		const seconds = this._TICK;
		const minutes = this._TICKsuper;
		const hours = this._TICKmega;
		const days = this._TICKultra;
		const interval = {
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds
		};
		return this._printInterval(interval);
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
MAGPIE_RUNTIME.prototype.awake = function awake()
{
	const ePrefix = "[RUNTIME].awake: ";
	try
	{
		this._loop = setInterval(() => {
			this.refresh()
		}, 1)
		MAGPIE_SYSTEM.log(ePrefix + `awakened with ${this._registry.size} guests`);
		this.isActive = true;
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
		this.isActive = false;
	}
}
MAGPIE_RUNTIME.prototype.pause = function pause()
{
	clearInterval(this._loop);
	return this.isActive = false;
}
MAGPIE_RUNTIME.prototype._memoryUsage = function memoryUsage(logToFile = false)
{
	const usage = process.memoryUsage();
	const message = `\n[Memory Report] Heap Used: `
    + `${Math.round(usage.heapUsed / 1024 / 1024)}MB / `
    + `Total: ${Math.round(usage.heapTotal / 1024 / 1024)}MB`;
	return MAGPIE_SYSTEM.log(message, logToFile ? "console" : false, true)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > TICK
//------------------------------------------------------------------------
MAGPIE_RUNTIME.tick = {};
MAGPIE_RUNTIME.prototype.refresh = function refresh()
{
	MAGPIE_SYSTEM.refresh.call(this)
	if(!this.isActive) return
	const FIXED_DELTA = MAGPIE.KEY.RUNTIME.LAYER.get(1).delta * 1000;
	const delta = Date.now() - this._now;
	this._now = Date.now();
	this._lag += delta;
	this._base += delta;
	this._game += delta;
	if(this._base >= 1000)
		return this.TICK_standard();
	if(this._game >= FIXED_DELTA || this._lag > FIXED_DELTA)
		this.TICK_game(FIXED_DELTA)
}
MAGPIE_RUNTIME.prototype.TICK_base = function TICK_base(delta)
{
	this._lag -= delta;
	const deltaBase = MAGPIE.KEY.RUNTIME.LAYER.get(0).delta * 1000;
	const deltaGame = MAGPIE.KEY.RUNTIME.LAYER.get(1).delta * 1000
	if(this._lag > deltaGame)
	{
		this._lag -= deltaGame;
		return this.TICK_game();
	}
	this._game += delta;
	this._baseFrame++;
	if(this._game >= deltaGame)
		return this.TICK_game();
	const layerBase = 0;
	const switchBase = 0;
	this.tick_layer(layerBase, switchBase, this._baseFrame);
	this._now = Date.now();
}
MAGPIE_RUNTIME.prototype.TICK_game = function TICK_game(delta)
{
	if(this._lag > 1000 || this._base > 1000)
	{
		this._lag -= 1000
		return this.TICK_standard()
	}
	this._lag -= delta
	this._game = 0;
	const layerBase = 0;
	const layerGame = 1;
	const switchGame = 1;
	this._gameFrame++;
	this.tick_layer(layerBase, switchGame, this._gameFrame);
	this.tick_layer(layerGame, switchGame, this._gameFrame);
	// MAGPIE_SYSTEM._logging_debug(this._lag)
}
MAGPIE_RUNTIME.prototype.TICK_standard = function TICK_standard()
{
	this._base = 0;
	this._baseFrame = 0;
	this._gameFrame = 0;
	const secondsInMinute = 60;
	if(this._TICK >= secondsInMinute - 1) 
		return this.TICK_super();
	this._TICK++;
	const layerStandard = 2;
	const switchStandard = 2;
	const layerBase = 0;
	const layerGame = 1;
	const standardFrame = this._TICK;
	this.tick_layer(layerBase, switchStandard, standardFrame);
	this.tick_layer(layerGame, switchStandard, standardFrame);
	this.tick_layer(layerStandard, switchStandard, standardFrame);
}
MAGPIE_RUNTIME.prototype.TICK_super = function TICK_super()
{
	this._TICK = 0;
	const minutesInHour = 60;
	if(this._TICKsuper >= minutesInHour - 1)
		return this.TICK_mega();
	this._TICKsuper++;
	const layerSuper = 3;
	const switchSuper = 3;
	const layerBase = 0;
	const layerGame = 1;
	const layerStandard = 2;
	const superFrame = this._TICKsuper;
	this.tick_layer(layerBase, switchSuper, superFrame);
	this.tick_layer(layerGame, switchSuper, superFrame)
	this.tick_layer(layerStandard, switchSuper, superFrame);
	this.tick_layer(layerSuper, switchSuper, superFrame);
}
MAGPIE_RUNTIME.prototype.TICK_mega = function TICK_mega()
{
	// console.log("TICK_mega");
	this._TICKsuper = 0;
	const hoursInDay = 24;
	if(this._TICKmega >= hoursInDay - 1)
		return this.TICK_ultra();
	this._TICKmega++;
	const layerMega = 4;
	const switchMega = 4;
	const layerBase = 0;
	const layerGame = 1;
	const layerStandard = 2;
	const layerSuper = 3;
	const megaFrame = this._TICKmega;
	this.tick_layer(layerBase, switchMega, megaFrame);
	this.tick_layer(layerGame, switchMega, megaFrame);
	this.tick_layer(layerStandard, switchMega, megaFrame);
	this.tick_layer(layerSuper, switchMega, megaFrame);
	this.tick_layer(layerMega, switchMega, megaFrame);
}
MAGPIE_RUNTIME.prototype.TICK_ultra = function TICK_ultra()
{
	// console.log("TICK_ultra");
	this._TICKmega = 0;
	this._TICKultra++
	const layerUltra = 5;
	const switchUltra = 5;
	const layerBase = 0;
	const layerGame = 1;
	const layerStandard = 2;
	const layerSuper = 3;
	const layerMega = 4;
	const ultraFrame = this._TICKultra;
	this.tick_layer(layerBase, switchUltra, ultraFrame);
	this.tick_layer(layerGame, switchUltra, ultraFrame);
	this.tick_layer(layerStandard, switchUltra, ultraFrame);
	this.tick_layer(layerSuper, switchUltra, ultraFrame);
	this.tick_layer(layerMega, switchUltra, ultraFrame);
	this.tick_layer(layerUltra, switchUltra, ultraFrame);
}
/**
 * 
 * @param {Number} layerID 
 * @param {Number} switchID
 * @param {Number} index_frame
 */
MAGPIE_RUNTIME.prototype.tick_layer = function tick_layer(layerID, switchID, index_frame)
{
	const ePrefix = "[RUNTIME].tick_layer: ";
	try
	{
		const layerName = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).name;
		/** @type {String[]} */
		const layer = this[layerName];
		if(!Array.isArray(layer)) 
			throw new Error(`${layerID} is invalid layer index`)
		for(const guest of layer)
		{
			try
			{
				this.guestRefresh(guest, layerID, switchID, index_frame);
			}
			catch(e)
			{
				MAGPIE_SYSTEM.error(ePrefix + e.message, e)
			}
		}
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name host
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Host
//------------------------------------------------------------------------
/**
 * 
 * @param {String} guestFirmwareName 
 * @param {Number} layerID
 */
MAGPIE_RUNTIME.prototype.host = function host(guestFirmwareName, layerID)
{	
	const ePrefix = "[RUNTIME].host: ";
	try
	{
		const layerName = this.getLayer(layerID);
		const layer = this[layerName];
		const index = layer.push(guestFirmwareName) - 1;
		this._registry.set(guestFirmwareName, {layerID: layerID, index: index});
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
/**
 * 
 * @param {Number} layerID 
 * @returns {String}
 */
MAGPIE_RUNTIME.prototype.getLayer = function getLayer(layerID)
{
	return MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name;
}
MAGPIE_RUNTIME.prototype.kick = function kick(guestFirmwareName, layerID)
{
	const ePrefix = "[RUNTIME].kick: "; 
	try
	{
		const layer = this.getLayer(layerID);
		console.log(guestFirmwareName);
		if(!layer) 
			throw new Error(`${layer} is invalid layer`);
		const index = this._registry.get(guestFirmwareName)?.index;
		const lastGuest = this[layer][layer.length - 1];
		this[layer][index] = lastGuest;
		if(!lastGuest)
			throw new Error(`${lastGuest} is invalid guest`)
		this._registry.set(lastGuest, {layerID: layerID, index: index});
		this._registry.delete(guestFirmwareName);
		this[layer].pop();
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
/**
 * 
 * @param {String} guest 
 * @param {Number} layerID
 * @param {Number} switchID
 * @param {Number} index_frame
 */
MAGPIE_RUNTIME.prototype.guestRefresh = function guestRefresh(guest, layerID, switchID, index_frame)
{
	//
}
MAGPIE_RUNTIME.__guestRefresh = MAGPIE_RUNTIME.prototype.guestRefresh;
// #endregion
//------------------------------------------------------------------------
/**
 * @name metastate
 * @desc {@link MAGPIE_SERVER.SYS._runtime_loadMetastate}
 * 
 */
//------------------------------------------------------------------------
// #region > Metastate
//------------------------------------------------------------------------
MAGPIE_RUNTIME.prototype.loadMetastate = function loadMetastate()
{
	//
}
MAGPIE_RUNTIME._loadMetastate = MAGPIE_RUNTIME.prototype.loadMetastate;
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - RUNTIME
//========================================================================
/**
 * @name HIVE
 * @desc 
 * @typedef {import("./entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 */
//========================================================================
// #region - HIVE
//========================================================================
MAGPIE_HIVE.meta = {};
MAGPIE_HIVE.meta.name = "M.A.G.P.I.E. Entities Hive";
MAGPIE_HIVE.meta.desc = "";
/**
 * @name proto
 * @desc 
 * @typedef {{
 * layerID: Number,
 * slot: Number,
 * target: Number,
 * retain: Boolean,
 * contexts: contextID[]
 * }} hive_entry
 * @typedef {Map<Number, hive_entry>} hive_registry
 * @typedef {import("../SERVER").hive_buffer} hive_buffer
 * @typedef {Number} buffer_size
 * @typedef {Float64Array<entityID>} hive_layer
 * @typedef {import("./entity").entityID} entityID
 * @typedef {import("./component").MAGPIE_EXP} MAGPIE_EXP
 * @typedef {import("./component").MAGPIE_KEY} MAGPIE_KEY
 * @typedef {import("./component").MAGPIE_SYMBOL} MAGPIE_SYMBOL
 * @typedef {import("./component").MAGPIE_CONTEXT} MAGPIE_CONTEXT
 * @typedef {import("./entity").expID} expID
 * @typedef {import("./index").keyID} keyID
 * @typedef {import("./component").symbolID} symbolID
 * @typedef {Number} contextID
 * @typedef {{
 * registry: hive_registry,
 * exps: expID[],
 * keys: keyID[],
 * symbols: symbolID[],
 * contexts: contextID[]
 * }} hive_vault
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
const layers = MAGPIE.KEY.RUNTIME.LAYER;
const layerBase = layers.get(0);
const layerGame = layers.get(1);
const layerStandard = layers.get(2);
const layerSuper = layers.get(3);
const layerMega = layers.get(4);
const layerUltra = layers.get(5);
/** @type {hive_buffer} */
MAGPIE_HIVE[layerBase.name] = [];
/** @type {hive_buffer} */
MAGPIE_HIVE[layerGame.name] = [];
/** @type {hive_layer} default size: 5,000 */
MAGPIE_HIVE[layerStandard.name] = [];
/** @type {hive_layer} default size: 10,000 */
MAGPIE_HIVE[layerSuper.name] = new Float64Array(layerSuper.slots).fill(0);
/** @type {hive_layer} default size: 50,000 */
MAGPIE_HIVE[layerMega.name] = new Float64Array(layerMega.slots).fill(0);
/** @type {hive_layer} default size: 100,000 */
MAGPIE_HIVE[layerUltra.name] = new Float64Array(layerUltra.slots).fill(0);
/** @type {Map<expID, {data: MAGPIE_EXP, owners: contextID[]}>}  */
MAGPIE_HIVE._expBuffer = new Map();
/** @type {Map<keyID, {data: MAGPIE_KEY, owners: contextID[]}>} */
MAGPIE_HIVE._keyBuffer = new Map();
/** @type {Map<symbolID, {data: MAGPIE_SYMBOL, owners: contextID[]}>} */
MAGPIE_HIVE._symbolBuffer = new Map();
/** @type {Map<contextID, MAGPIE_CONTEXT>} */
MAGPIE_HIVE._contextBuffer = new Map();
/** 
 * @type {hive_registry}
 * @desc Map<entityID, hive_entry: {
 * layerID: Number,
 * slot: Number,
 * target: Number,
 * retrain: Boolean
 * }>
 * */
MAGPIE_HIVE._registry = new Map();
MAGPIE_HIVE.awake = async function awake()
{
	//
}
MAGPIE_HIVE.pause = function pause()
{
	const ePrefix = `[HIVE].method: `;
	try
	{
		this.isActive = false;
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
MAGPIE_HIVE.setup = function setup()
{
	const K = MAGPIE.KEY.RUNTIME.LAYER;
	const layerBase = K.get(0).name;
	const layerGame = K.get(1).name;
	const layerStandard = K.get(2).name;
	const layerSuper = K.get(3).name;
	const layerMega = K.get(4).name;
	const layerUltra = K.get(5).name;
	MAGPIE_HIVE[layerBase] = new Array(K.get(0).slots).fill(MAGPIE_HIVE._get_entity_new());
	MAGPIE_HIVE[layerGame] = new Array(K.get(1).slots).fill(MAGPIE_HIVE._get_entity_new());
	MAGPIE_HIVE[layerStandard] = new Array(K.get(2).slots).fill(MAGPIE_HIVE._get_entity_new());
	MAGPIE_HIVE._registry.set(0, {name: layerBase, 	nextSlot: 0});
	MAGPIE_HIVE._registry.set(1, {name: layerGame, 	nextSlot: 0});
	MAGPIE_HIVE._registry.set(2, {name: layerStandard, nextSlot: 0});
	MAGPIE_HIVE._registry.set(3, {name: layerSuper, 	nextSlot: 0});
	MAGPIE_HIVE._registry.set(4, {name: layerMega, 	nextSlot: 0});
	MAGPIE_HIVE._registry.set(5, {name: layerUltra, 	nextSlot: 1});
	const universe = MAGPIE_HIVE._get_databaseSync("loadEntitySync", [MAGPIE.KEY.ENTITY.UNIVERSE]);
	/** @type {hive_entry} */
	const universe_entry = {layerID: 5, slot: 0, target: 5, retain: true, contexts: []};
	MAGPIE_HIVE[layerUltra][0] = universe.ID;
	MAGPIE_HIVE._registry.set(universe.ID, universe_entry)
	const record = MAGPIE_HIVE._registry.get(universe_entry.layerID);
	record.nextSlot++;
	MAGPIE_HIVE._registry.set(universe_entry.layerID, record)
	return true
}
/**
 * @typedef {import("./entity").entity_data} entity_data
 * @param {entity_data} data 
 */
MAGPIE_HIVE._get_entity_new = function newEntity(data)
{
	return MAGPIE_HIVE.__get_serverSync("_hive_new_entity", [data])
}
/**
 * 
 * @param {String} method 
 * @param {[]} args
 * @returns {*}
 */
MAGPIE_HIVE.__get_serverSync = function __get_serverSync(method, args)
{
	//
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name database
 * @desc 
 * @typedef {import("./database_worker").database_result} database_result
 */
//------------------------------------------------------------------------
// #region > Database
//------------------------------------------------------------------------
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {Promise<*>} 
 */
MAGPIE_HIVE._get_database = async function _get_database(method, arguments)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {*} 
 */
MAGPIE_HIVE._get_databaseSync = function _get_databaseSync(method, arguments)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {Promise<database_result>} 
 */
MAGPIE_HIVE._set_database = async function _set_database(method, arguments)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {database_result} 
 */
MAGPIE_HIVE._set_databaseSync = function _set_databaseSync(method, arguments)
{
	//
}
/**
 * 
 * @param {entityID[]} entityIDarray 
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_HIVE.loadEntities = function loadEntities(entityIDarray)
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
// #region > refresh
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} layerID
 * @param {Number} switchID
 * @returns {Promise<Boolean>} 
 */
MAGPIE_HIVE.refresh = function refresh(layerID, switchID)
{
	//
}
/**
 * 
 * @param {String} layerName 
 * @param {Number} layerID 
 * @param {Number} switchID 
 * @param {Number} dt
 * @param {Number} layer_frame 
 */
MAGPIE_HIVE.tick_buffer = function tick_buffer(layerName, layerID, switchID, dt, layer_frame)
{
	//
}
/**
 * 
 * @param {String} layerName 
 * @param {Number} layerID 
 * @param {Number} switchID 
 * @param {Number} dt
 * @param {Number} layer_frame 
 */
MAGPIE_HIVE.tick_remote = function tick_remote(layerName, layerID, switchID, dt, layer_frame)
{
	//
}
MAGPIE_HIVE.save = async function save()
{
	//
}
/**
 * @returns {Promise<Number>}
 */
MAGPIE_HIVE.saveEntities = async function saveEntities()
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
// #region > Host
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_ENTITY} entity 
 * @param {Number} layerID 
 * @param {Number} targetLayerID 
 * @param {contextID} contextID
 * @returns {entityID} 
 */
MAGPIE_HIVE.host = function host(entity, layerID, targetLayerID, contextID)
{
	const ePrefix = "[HIVE].host: ";
	let errorCode = -1;
	try
	{
		if(!entity?.ID)
			throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
		if(isNaN(targetLayerID))
			targetLayerID = layerID
		const exists = MAGPIE_HIVE._registry.get(entity.ID);
		if(exists)
		{
			if(exists.layerID < layerID)
			{
				MAGPIE_HIVE.move(entity.ID, layerID, targetLayerID)
				MAGPIE_HIVE._entity_addContext(exists, contextID);
			}	
			const message_exists = `[ENTITY-${entity.ID}] is already at [LAYER-${exists.layerID}][${exists.slot}]`;
			return MAGPIE_SYSTEM.log(message_exists, "console", true)
		}
		const celestialID = entity.STATS[MAGPIE.KEY.POVART.P_C] || NaN;
		if(isNaN(celestialID))
			throw new Error(`[ENTITY-${entity.ID}] has invalid P_C`)
		const celestial_in_registry = MAGPIE_HIVE._registry.get(celestialID);
		const hostID = entity.STATS[MAGPIE.KEY.STATS.HOST];
		const host = MAGPIE_HIVE._registry.get(hostID);
		errorCode = !celestial_in_registry ? -2 : -3
		if(!celestial_in_registry)
			throw new Error(`missing [CELESTIAL-${celestialID}] in registry`)
		if(!host)
			throw new Error(`missing [HOST-${hostID}] in registry`)
		const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
		const layerName = K?.name;
		const slot = MAGPIE_HIVE.nextSlot(layerID);
		if(isNaN(slot))
			throw new Error(`[LAYER-${layerID}] is full`);
		MAGPIE_HIVE[layerName][slot] = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE ? entity : entity.ID;
		MAGPIE_HIVE._registry.set(entity.ID, {
			layerID: layerID,
			slot: slot,  
			target: targetLayerID, 
			retain: true,
			contexts: [contextID]
		});
		const now = Date.now();
		const stale = entity.updated > now + MAGPIE.KEY.ENTITY.STALE 
			? ` [STALE-${entity.updated}]`
			: "";
		entity.updated = now;
		const layerRecord = MAGPIE_HIVE._registry.get(layerID);
		layerRecord.nextSlot = (slot + 1) <= K.slots ? slot + 1 : -1
		MAGPIE_HIVE._registry.set(layerID, layerRecord);
		if(!MAGPIE_HIVE._registry.get(entity.ID))
			throw new Error(`unable to host [ENTITY-${entity.ID}]`)
		const message = `[HIVE].hosting [ENTITY-${entity.ID}] on `
			+ `[${layerName}][${slot}] with target [LAYER-${targetLayerID}]`
		MAGPIE_SYSTEM.log(ePrefix + message + stale, "console", true)
		return entity.ID 
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return errorCode
	}
}
/**
 * 
 * @param {hive_entry} entry 
 * @param {contextID} contextID 
 * @returns {Number}
 */
MAGPIE_HIVE._entity_addContext = function _entity_addContext(entry, contextID)
{
	if(entry.contexts.find(contextID))
		return
	entry.contexts.push(contextID);
	return entry.contexts.length
}
/**
 * 
 * @param {hive_entry} entry 
 * @param {contextID} contextID 
 * @returns {Number}
 */
MAGPIE_HIVE._entity_removeContext = function _entity_removeContext(entry, contextID)
{
	const index = entry.contexts.indexOf(contextID);
	if(!index)
		return
	entry.context[index] = entry.context[entry.context.length - 1]
	entry.context.pop();
	return entry.context.length
}
/**
 * 
 * @param {Number} layerID 
 * @returns {Number}
 */
MAGPIE_HIVE.nextSlot = function nextSlot(layerID)
{
	// const K = MAGPIE.KEY.RUNTIME.LAYER;
	// const layerName = K.get(layerID)?.name;
	// this[layerName]
	return this._registry.get(layerID)?.nextSlot;
}
/**
 * 
 * @param {index} slot
 * @param {Number} layerID
 * @returns {MAGPIE_ENTITY} 
 */
MAGPIE_HIVE.getSlot = function getSlot(slot, layerID)
{
	//
}
/**
 * 
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY} 
 */
MAGPIE_HIVE._get_entity = function _get_entity(entityID)
{
	//
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {database_result} 
 */
MAGPIE_HIVE._set_entitySync = function _set_entitySync(entity)
{
	return MAGPIE_HIVE._set_databaseSync("saveEntitySync", [entity])
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<database_result>} 
 */
MAGPIE_HIVE._set_entity = async function _set_entity(entity)
{
	return MAGPIE_HIVE._set_database("saveEntity", [entity])
}
/**
 * 
 * @param {entityID} celestialID
 * @returns {MAGPIE_ENTITY} 
 */
MAGPIE_HIVE._get_celestial = function __get_celestial(celestialID)
{
	const slot = MAGPIE_HIVE._registry.get(celestialID)?.slot
	if(!slot) return MAGPIE_HIVE._get_databaseSync("loadEntitySync", [celestialID])
	const layerStandard = 2
	return MAGPIE_HIVE.getSlot(slot, layerStandard)
}
/**
 * 
 * @param {entityID} entityID 
 * @param {Number} layerB_ID 
 * @param {Number} targetLayerID 
 * @returns {entityID} 
 */
MAGPIE_HIVE.move = function move(entityID, layerB_ID, targetLayerID = NaN)
{
	const ePrefix = "[HIVE].move: ";
	try
	{
		const entry = MAGPIE_HIVE._registry.get(entityID);
		if(!entry)
			throw new Error(`[ENTITY-${entityID}] not in registry`);
		const layerID = entry.layerID;
		const slot = entry.slot;
		const layerA = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
		if(!layerA)
			throw new Error(`${layerA} is invalid HIVE layer`)
		const layerB = MAGPIE.KEY.RUNTIME.LAYER.get(layerB_ID);
		if(!layerB)
			throw new Error(`${layerB} is invalid HIVE layer`)
		const nextSlot = MAGPIE_HIVE.nextSlot(layerB_ID);
		if(isNaN(nextSlot)) 
			throw new Error(`${layerB?.name} is full`)
		const kicked = MAGPIE_HIVE.kick(entityID, "move");
		let entity = null;
		if(kicked?.ID)
			entity = kicked;
		else entity = MAGPIE_HIVE.loadEntitySync(entityID);
		if(isNaN(targetLayerID))
			targetLayerID = layerB_ID
		return MAGPIE_HIVE.host(entity, layerB_ID, targetLayerID)
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} entityID 
 * @param {String} reason
 * @returns {entityID}
 */
MAGPIE_HIVE.kick = function kick(entityID, reason = "dev")
{
	const ePrefix = "[HIVE].kick: ";
	try
	{
		const entry = MAGPIE_HIVE._registry.get(entityID);
		const layerID = entry?.layerID
		const index = entry?.slot;
		const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
		if(!K)
			throw new Error(`[LAYER-${layerID}], for [ENTITY-${entityID}], is invalid layer`)
		const layerName = K.name;
		if(!MAGPIE_HIVE[layerName][index])
		{
			MAGPIE_HIVE._registry.delete(entityID);
			throw new Error(`[ENTITY-${entityID}] not at ${layerName}[${index}]`);
		}
		const layerRecord = MAGPIE_HIVE._registry.get(layerID);
		const lastSlot = K.slots - 1;
		const nextSlot = layerRecord.nextSlot - 1;
		const entity = MAGPIE_HIVE[layerName][index];
		MAGPIE_HIVE[layerName][index] = MAGPIE_HIVE[layerName][lastSlot];
		MAGPIE_HIVE[layerName][lastSlot] = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE ? MAGPIE_HIVE._get_entity_new() : 0;
		layerRecord.nextSlot = nextSlot;
		MAGPIE_HIVE._registry.delete(entityID);
		MAGPIE_HIVE._registry.set(layerID, layerRecord);
		MAGPIE_HIVE[layerRecord.name][layerRecord.nextSlot] = null;
		const message = `[ENTITY-${entityID}] kicked from ${layerName}, reason: `
		let logToConsole = false;
		if(reason === "move")
			logToConsole = true;
		MAGPIE_SYSTEM.log(message + reason, "console", logToConsole);
		return entityID
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @param {contextID} contextID
 * @returns {buffer_size}  
 */
MAGPIE_HIVE._host_exp = function hostExp(exp, contextID)
{
	const buffer = MAGPIE_HIVE._expBuffer.get(exp.ID) || {
		data: exp,
		owners: []
	}
	if(!isNaN(contextID))
		buffer.owners.push(contextID);
	return MAGPIE_HIVE._expBuffer.set(exp.ID, buffer).size
}
/**
 * 
 * @param {MAGPIE_KEY} key 
 * @param {contextID} contextID
 * @returns {buffer_size}  
 */
MAGPIE_HIVE._host_key = function hostKey(key, contextID)
{
	const buffer = MAGPIE_HIVE._keyBuffer.get(key.ID) || {
		data: key,
		owners: []
	}
	if(!isNaN(contextID))
		buffer.owners.push(contextID)
	return MAGPIE_HIVE._keyBuffer.set(key.ID, buffer).size
}
/**
 * 
 * @param {MAGPIE_SYMBOL} symbol 
 * @param {contextID} contextID
 * @returns {buffer_size}  
 */
MAGPIE_HIVE._host_symbol = function hostSymbol(symbol, contextID)
{
	const buffer = MAGPIE_HIVE._symbolBuffer.get(symbol.ID) || {
		data: symbol,
		owners: []
	};
	if(!isNaN(contextID))
		buffer.owners.push(contextID);
	return MAGPIE_HIVE._symbolBuffer.set(symbol.ID, buffer).size
}
/**
 * 
 * @param {MAGPIE_CONTEXT} context
 * @returns {buffer_size}  
 */
MAGPIE_HIVE._host_context = function hostContext(context)
{
	MAGPIE_HIVE._contextBuffer.set(context.ID, context);
	const entities = context.entities;
	const exps = context.exps;
	const keys = context.keys;
	const symbols = context.symbols
	if(entities.length < 1 && exps.length < 1 && keys.length < 1 && symbols.length < 1)
		return
	const layers = MAGPIE.KEY.RUNTIME.LAYER.size;
	const layerID = layers - Math.max(layers, (context.urgency + context.gravity));
	entities.forEach(entityID => {
		MAGPIE_HIVE.host(MAGPIE_HIVE._get_entity(entityID), layerID)
	})
	exps.forEach(expID => {
		MAGPIE_HIVE._host_exp(MAGPIE_HIVE._get_exp(expID), context.ID)
	})
	keys.forEach(keyID => {
		MAGPIE_HIVE._host_key(MAGPIE_HIVE._get_key(keyID), context.ID)
	})
	symbols.forEach(symbolID => {
		MAGPIE_HIVE._host_symbol(MAGPIE_HIVE._get_symbol(symbolID), context.ID)
	})
}
/**
 * 
 * @param {expID} expID 
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_exp = function kickExp(expID)
{
	const exp = MAGPIE_HIVE._get_exp(expID);
	if(!exp) return
	const results = exp.setSync();
	if(!results) 
		throw new Error(`unable to save [EXP-${expID}]`)
	MAGPIE_HIVE._expBuffer.delete(expID);
	return results
}
/**
 * 
 * @param {keyID} keyID 
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_key = function kickKey(keyID)
{
	const key = MAGPIE_HIVE._get_key(keyID);
	if(!key) return
	const result = key.setSync();
	if(!result)
		throw new Error(`unable to save [KEY-${keyID}]`)
	MAGPIE_HIVE._keyBuffer.delete(keyID);
	return result
}
/**
 * 
 * @param {symbolID} symbolID 
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_symbol = function kickSymbol(symbolID)
{
	const symbol = MAGPIE_HIVE._get_symbol(symbolID);
	if(!symbol) return
	const result = symbol.setSync();
	if(!result)
		throw new Error(`unable to save [SYMBOL-${symbolID}]`)
	MAGPIE_HIVE._symbolBuffer.delete(symbolID);
	return result
}
/**
 * 
 * @param {contextID} contextID 
 * @param {String} reason 
 * @returns {database_result}
 */
MAGPIE_HIVE._kick_context = function kickContext(contextID, reason = "dev")
{
	const ePrefix = "[HIVE].kickContext: ";
	try
	{
		const context = MAGPIE_HIVE._get_context(contextID);
		if(!context)
			throw new Error(`unable to find [CONTEXT-${contextID}]`)
		const entities = context.entities;
		entities.forEach(entityID => {
			MAGPIE_HIVE._registry.get(entityID).contexts.some(ID => ID === contextID)
				? false : MAGPIE_HIVE.kick(entityID, "context_sleep")
		})
		const exps = context.exps;
		exps.forEach(expID => {
			MAGPIE_HIVE._expBuffer.get(expID).owners.some(ID => ID === contextID)
				? false : MAGPIE_HIVE._kick_exp(expID)
		})
		const keys = context.keys;
		keys.forEach(keyID => {
			MAGPIE_HIVE._keyBuffer.get(keyID).owners.some(ID => ID === contextID)
				? false : MAGPIE_HIVE._kick_key(keyID)
		})
		const symbols = context.symbols;
		symbols.forEach(symbolID => {
			MAGPIE_HIVE._symbolBuffer.get(symbolID).owners.some(ID => ID === contextID)
				? false : MAGPIE_HIVE._kick_symbol(symbolID)
		})
		const result = context.setSync();
		if(!result)
			throw new Error(`unable to save [CONTEXT-${contextID}]`)
		MAGPIE_HIVE._contextBuffer.delete(contexID)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} entityID 
 * @param {Number} layerID
 * @returns {entityID} 
 */
MAGPIE_HIVE._host_parent = function _host_parent(entityID, layerID)
{
	const entity = MAGPIE_HIVE._get_databaseSync("loadEntitySync", [entityID]);
	if(!entity?.ID)
		throw new Error(`${entity} is invalid MAGPIE_ENTITY`)
	if(isNaN(layerID) || layerID > MAGPIE.KEY.RUNTIME.LAYER.size)
		throw new Error(`${layerID} is invalid HIVE layer`)
	const typeStart = MAGPIE.KEY.ENTITY.TYPE.get("CELESTIAL");
	const typeEnd = MAGPIE.KEY.ENTITY.TYPE.get("MATERIA");
	const buffer = MAGPIE.KEY.HIVE.BUFFER_SIZE;
	const isCelestial = entity.type < typeStart || entity.type >= typeEnd;
	const layer = isCelestial ? (layer < buffer ? buffer : layerID + 1) : layerID + 1;
	// MAGPIE_SYSTEM._logging_debug(layer)
	if(!layer)
		throw new Error(`${layer} is invalid HIVE layer`)
	return MAGPIE_HIVE.host(entity, layer)
}
/**
 * 
 * @param {Boolean} inRegistry 
 * @param {MAGPIE_ENTITY} entityID 
 * @param {Number} layerID 
 */
MAGPIE_HIVE._host_hasParent = function(inRegistry, entityID, layerID)
{
	return MAGPIE_HIVE._host_parent(entityID, layerID);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > getters
//------------------------------------------------------------------------
/**
 * 
 * @param {symbolID} symbolID
 * @returns {MAGPIE_SYMBOL} 
 */
MAGPIE_HIVE._get_symbol = function _get_symbol(symbolID)
{
	const symbol = MAGPIE_HIVE._symbolBuffer.get(symbolID)?.data;
	if(symbol)
		return symbol
	return MAGPIE_HIVE._get_databaseSync("loadSymbolSync", [symbolID])
}
/**
 * 
 * @param {expID} expID 
 * @returns {MAGPIE_EXP}
 */
MAGPIE_HIVE._get_exp = function _get_exp(expID)
{
	const exp = MAGPIE_HIVE._expBuffer.get(expID)?.data;
	if(exp)
		return exp
	return MAGPIE_HIVE._get_databaseSync("loadExpSync", [expID])
}
/**
 * 
 * @param {keyID} keyID 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_HIVE._get_key = function _get_key(keyID)
{
	const key = MAGPIE_HIVE._keyBuffer.get(keyID)?.data;
	if(key)
		return key
	return MAGPIE_HIVE._get_databaseSync("loadKeySync", [keyID])
}
/**
 * 
 * @param {contextID} contextID 
 * @returns {MAGPIE_CONTEXT} 
 */
MAGPIE_HIVE._get_context = function _get_context(contextID)
{
	const context = MAGPIE_HIVE._contextBuffer.get(contextID)
	if(context)
		return context
	return MAGPIE_HIVE._get_databaseSync("loadContextSync", [contextID])
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > setters
//------------------------------------------------------------------------
/**
 * 
 * @param {String} type 
 * @param {*} entry 
 */
MAGPIE_HIVE._verify_buffer_entry = function verifyBufferEntry(type, entry)
{
	const map = MAGPIE_HIVE[`_${type}Buffer`];
	const buffer = map.get(entry.ID)
	if(buffer)
	{
		buffer.data = entry;
		map.set(entry.ID, buffer)
	}
}
/**
 * 
 * @param {MAGPIE_SYMBOL} symbol 
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_symbol = async function setSymbol(symbol)
{
	MAGPIE_HIVE._verify_buffer_entry("symbol", symbol);
	return await MAGPIE_HIVE._set_database("saveSymbol", [symbol])
}
/**
 * 
 * @param {MAGPIE_SYMBOL} symbol 
 * @returns {database_result}
 */
MAGPIE_HIVE._set_symbolSync = function setSymbolSync(symbol)
{
	MAGPIE_HIVE._verify_buffer_entry("symbol", symbol)
	return MAGPIE_HIVE._set_databaseSync("saveSymbolSync", [symbol])
}
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_exp = async function setExp(exp)
{
	MAGPIE_HIVE._verify_buffer_entry("exp", exp)
	return await MAGPIE_HIVE._set_database("saveExp", [exp])
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {database_result} 
 */
MAGPIE_HIVE._set_expSync = function setExpSync(exp)
{
	MAGPIE_HIVE._verify_buffer_entry("exp", exp)
	return MAGPIE_HIVE._set_databaseSync("saveExpSync", [exp])
}
/**
 * 
 * @param {MAGPIE_KEY} key
 * @returns {Promise<database_result>} 
 */
MAGPIE_HIVE._set_key = async function setKey(key)
{
	MAGPIE_HIVE._verify_buffer_entry("key", key)
	return await MAGPIE_HIVE._set_database("saveKey", [key])
}
/**
 * 
 * @param {MAGPIE_KEY} key
 * @returns {database_result} 
 */
MAGPIE_HIVE._set_keySync = function setKeySync(key)
{
	MAGPIE_HIVE._verify_buffer_entry("key", key)
	return MAGPIE_HIVE._set_databaseSync("saveKeySync", [key])
}
/**
 * 
 * @param {MAGPIE_CONTEXT} context
 * @returns {Promise<database_result>} 
 */
MAGPIE_HIVE._set_context = async function setContext(context)
{
	MAGPIE_HIVE._verify_buffer_entry("context", context)
	return await MAGPIE_HIVE._set_database("saveContext", [context])
}
/**
 * 
 * @param {MAGPIE_CONTEXT} context
 * @returns {database_result} 
 */
MAGPIE_HIVE._set_contextSync = function setContextSync(context)
{
	MAGPIE_HIVE._verify_buffer_entry("context", context)
	return MAGPIE_HIVE._set_databaseSync("saveContextSync", [context])
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
// #region - I/O
//========================================================================
MAGPIE_IO.meta = {};
/**
 * @name prototype
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_IO.prototype.initialize = function initialize()
{
    //
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name filesystem
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > FS
//------------------------------------------------------------------------
MAGPIE_IO.WORKER = new Worker("./core/workers/fsio.js");

MAGPIE_IO.read = function read(filename)
{
    try
    {
        return fs.readFileSync(filename, "utf-8")
    }
    catch(e)
    {
        return e
    }
}
MAGPIE_IO.write = function write(filename, content)
{
    try
    {
        return fs.writeFileSync(filename, content)
    }
    catch(e)
    {
        return e
    }
}
/**
 * 
 * @param {String} filename 
 * @param {String} timestamp 
 * @param {String} level 
 * @param {String} message 
 * @returns {Boolean}
 */
MAGPIE_IO.append = function append(filename, timestamp, level = "INFO", message = "")
{
    try
    {
        const payload = {
			timestamp: timestamp,
			level: level,
			message: message,
			filename: filename
		}
		MAGPIE_IO.WORKER.postMessage(JSON.stringify(payload))
		return true
    }
    catch(e)
    {
        return e
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
module.exports = {
    MAGPIE_SYSTEM,
    MAGPIE_IO: MAGPIE_IO,
	MAGPIE_LOG: MAGPIE_LOG,
    MAGPIE_RUNTIME: MAGPIE_RUNTIME,
	MAGPIE_HIVE: MAGPIE_HIVE,
    MAGPIE_METASTATE: MAGPIE_METASTATE,
	MAGPIE_CALENDAR: MAGPIE_CALENDAR,
	MAGPIE_DATE: MAGPIE_DATE
}