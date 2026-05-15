/**
 * @name 
 * @desc 
 * 
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
function MAGPIE_RUNTIME()
{
    this.initialize(...arguments);
}
/**
 * @desc {@link MAGPIE_HIVE.meta}
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
		MAGPIE_IO.append(`logs/${prefix}${date}.txt`, logTime + log + "\n");
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
	const logged = MAGPIE_IO.append(`logs/error${date}.txt`, 
		full + log + "\n" + error?.stack + "\n\n");
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
MAGPIE_METASTATE.prototype.refresh = async function refresh(layerID, switchID)
{
	const ePrefix = "[METASTATE].refresh: ";
	try
	{
		this.TICK_base(layerID, switchID);
		this.meta.updated = Date.now();
		
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
	this._base = 0;
	this._game = 0;
	this._standard = 0;
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
	if(!this.isActive) return
	const dt = Date.now() - this._now;
	this._now += dt;
	this._base += dt;
	this._game += dt;
	this._standard += dt;
	if(this._base > 100) this._base = 100;
	while(this._base > 1)
	{
		this.TICK_base();
		this._base--;
	}
	if(this._game >= 16.67)
	{
		this.TICK_game();
		this._game -= 16.67;
	}
	if(this._standard > 1000)
	{
		this.TICK_standard();
		this._standard -= 1000;
	}
}
MAGPIE_RUNTIME.prototype.TICK_base = function TICK_base()
{
	const layerBase = 0;
	const switchBase = 0;
	this.tick_layer(layerBase, switchBase);
}
MAGPIE_RUNTIME.prototype.TICK_game = function TICK_game()
{
	const layerBase = 0;
	const layerGame = 1;
	const switchGame = 1;
	this.tick_layer(layerBase, switchGame);
	this.tick_layer(layerGame, switchGame);
}
MAGPIE_RUNTIME.prototype.TICK_standard = function TICK_standard()
{
	this._now = Date.now();
	const secondsInMinute = 60;
	if(this._TICK >= secondsInMinute - 1) 
		return this.TICK_super();
	this._TICK++;
	const layerStandard = 2;
	const switchStandard = 2;
	const layerBase = 0;
	const layerGame = 1;
	this.tick_layer(layerBase, switchStandard);
	this.tick_layer(layerGame, switchStandard);
	this.tick_layer(layerStandard, switchStandard);
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
	this.tick_layer(layerBase, switchSuper);
	this.tick_layer(layerGame, switchSuper)
	this.tick_layer(layerStandard, switchSuper);
	this.tick_layer(layerSuper, switchSuper);
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
	this.tick_layer(layerBase, switchMega);
	this.tick_layer(layerGame, switchMega);
	this.tick_layer(layerStandard, switchMega);
	this.tick_layer(layerSuper, switchMega);
	this.tick_layer(layerMega, switchMega);
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
	this.tick_layer(layerBase, switchUltra);
	this.tick_layer(layerGame, switchUltra);
	this.tick_layer(layerStandard, switchUltra);
	this.tick_layer(layerSuper, switchUltra);
	this.tick_layer(layerMega, switchUltra);
	this.tick_layer(layerUltra, switchUltra);
}
/**
 * 
 * @param {Number} layerID 
 * @param {Number} switchID
 */
MAGPIE_RUNTIME.prototype.tick_layer = function tick_layer(layerID, switchID)
{
	const ePrefix = "[RUNTIME].tick_layer: ";
	try
	{
		const layer = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).name;
		if(!this[layer]) 
			throw new Error(`${layerID} is invalid layer index`)
		for(const guest of this[layer])
		{
			this.guestRefresh(guest, layerID, switchID);
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
 * @param {*} guest 
 * @param {*} layer 
 */
MAGPIE_RUNTIME.prototype.guestRefresh = function guestRefresh(guest, layerID, switchID)
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
 * retrain: Boolean
 * }} hive_entry
 * @typedef {Map<Number, hive_entry>} hive_registry
 * @typedef {import("../SERVER").hive_buffer} hive_buffer
 * @typedef {Float64Array<entityID>} hive_layer
 * @typedef {import("./entity").entityID} entityID
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
MAGPIE_HIVE.meta.name = MAGPIE_HIVE.meta.name;
MAGPIE_HIVE.meta.desc = MAGPIE_HIVE.meta.desc;
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
MAGPIE_HIVE._expBuffer = [];
MAGPIE_HIVE._keyBuffer = [];
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
MAGPIE_HIVE.tick_buffer = function tick_buffer(layerName, layerID, switchID, dt)
{
	//
}
MAGPIE_HIVE.tick_remote = function tick_remote(layerName, layerID, switchID, dt)
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
 */
MAGPIE_HIVE.host = function host(entity, layerID, targetLayerID)
{
	//
}
MAGPIE_HIVE.nextSlot = function nextSlot(layerID)
{
	// const K = MAGPIE.KEY.RUNTIME.LAYER;
	// const layerName = K.get(layerID)?.name;
	// this[layerName]
	return this._registry.get(layerID).nextSlot;
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
 * @param {entityID} celestialID
 * @returns {MAGPIE_ENTITY} 
 */
MAGPIE_HIVE._get_celestial = function __get_celestial(celestialID)
{
	const slot = MAGPIE_HIVE._registry.get(celestialID)?.slot
	const layerStandard = 2
	return MAGPIE_HIVE.getSlot(slot, layerStandard)
}
MAGPIE_HIVE.kick = function kick(entityID)
{
	//
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
MAGPIE_IO.append = function append(filename, content)
{
    try
    {
        return fs.appendFileSync(filename, content); 
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
	MAGPIE_HIVE,
    MAGPIE_METASTATE: MAGPIE_METASTATE,
	MAGPIE_CALENDAR: MAGPIE_CALENDAR,
	MAGPIE_DATE: MAGPIE_DATE
}