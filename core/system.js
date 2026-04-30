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
function MAGPIE_SYSTEM()
{
    this.initialize();
}
/**
 * @name LOG
 * @param {String} contents 
 * @returns {new MAGPIE_LOG}
 */
function MAGPIE_LOG(contents = "")
{
	this.initialize(contents)
}
function MAGPIE_IO()
{
    this.initialize(...arguments);
}
function MAGPIE_RUNTIME()
{
    this.initialize(...arguments);
}
function MAGPIE_HIVE()
{
	this.initialize(...arguments);
}
/** @param {metastate_data} data @returns {new MAGPIE_METASTATE} */
function MAGPIE_METASTATE(data = {})
{
    this.initialize(data);
}
class MAGPIE_DATABASE
{
    static {
        //
    }
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
 * "@": "MAGPIE_DATE"
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
 * 
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
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
/**
 * 
 * @param {String} message 
 * @returns {log} [timestamp] message
*/
MAGPIE_SYSTEM.error = function error(message)
{
	/** @type {log}  */
	const log = this.log(message, null, {millisecond: true});
	return log
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
 */
MAGPIE_SYSTEM.error = function error(errorMessage)
{
	const log = errorMessage;
	const date = this.Utility.CTZD();
	const full = `[${this.Utility.CTZF()}]`;
	MAGPIE_LOG.errors.push(log);
	console.error(`[ERROR] ${errorMessage} | `, error);
	const logged = MAGPIE_IO.append(`logs/error${date}.txt`, 
		full + log + "\n" + error?.stack + "\n\n");
	console.log(logged);
	// r.displayPrompt();
}
MAGPIE_SYSTEM.prototype.error = MAGPIE_SYSTEM.error;
/**
 * 
 * @param {String} message 
 * @returns 
 */
MAGPIE_SYSTEM.logging.debug = function debug(message)
{
	if(r.cursor > 0)
		return
	console.clear();
	console.log(message);
	// global?.r.displayPrompt();
	// lastMessage = message;
}
MAGPIE_SYSTEM.prototype._debug = MAGPIE_SYSTEM.logging.debug;
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
 * @param {String} contents
 * @returns {new MAGPIE_LOG} 
 */
//========================================================================
// #region - LOG
//========================================================================
MAGPIE_LOG.prototype.initialize = function initialize(contents)
{
	this.ID = Date.now();
	this.contents = contents;
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
MAGPIE_METASTATE.prototype.initialize = function initialize(data)
{
    //
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
	this["@"] = "MAGPIE_DATE";
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
/**
 * 
 * @returns {day}
 */
MAGPIE_DATE.prototype.yearday = function yearday()
{
	if(this?._yearday) return this._yearday;
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
	const K = MAGPIE.KEY.SWITCHES.SUPER_TICK;
	if(this.second > 10) MAGPIE_SYSTEM.switches.setValue(K, false);
	this.second++;
}
MAGPIE_DATE.prototype.superTICK = function superTICK()
{
	this.second = 0;
	const K = MAGPIE.KEY.SWITCHES;
	MAGPIE_SYSTEM.switches.setValue(K.SUPER_TICK, true);
	if(this.minute >= 59) return this.megaTICK();
	if(this.minute > 0) MAGPIE_SYSTEM.switches.setValue(K.MEGA_TICK, false);
	this.minute++;
}
MAGPIE_DATE.prototype.megaTICK = function megaTICK()
{
	this.minute = 0;
	const K = MAGPIE.KEY.SWITCHES;
	MAGPIE_SYSTEM.switches.setValue(K.MEGA_TICK, true);
	const day = this.getCalendar().dayLength || 24;
	if(this.hour >= day - 1) return this.ultraTICK();
	if(this.hour > 0) MAGPIE_SYSTEM.switches.setValue(K.ULTRA_TICK, false);
	this.hour++;
}
MAGPIE_DATE.prototype.ultraTICK = function ultraTICK()
{
	this.hour = 0;
	const K = MAGPIE.KEY.SWITCHES;
	MAGPIE_SYSTEM.switches.setValue(K.ULTRA_TICK, true);
	const months = this.getCalendar().months;
	const days = Object.values(months)[this.month - 1];
	const leap = this.leapDay();
	if(this.day >= days + leap) return this.newMonth();
	if(this.day > 1) MAGPIE_SYSTEM.switches.setValue(K.NEW_MONTH, false);
	this.day++;
}
MAGPIE_DATE.prototype.newMonth = function newMonth()
{
	this.day = 1;
	const months = Object.keys(this.getCalendar().months).length;
	const K = MAGPIE.KEY.SWITCHES;
	MAGPIE_SYSTEM.switches.setValue(K.NEW_MONTH, true);
	if(this.month >= months) return this.newYear();
	if(this.month > 1) MAGPIE_SYSTEM.switches.setValue(K.NEW_YEAR, false);
	this.month++;
}
MAGPIE_DATE.prototype.newYear = function newYear()
{
	this.month = 1;
	const K = MAGPIE.KEY.SWITCHES;
	MAGPIE_SYSTEM.switches.setValue(K.NEW_YEAR, true);
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
    this._TICK = 0;
    this._TICKsuper = 0;
    this._TICKmega = 0;
    this._TICKultra = 0;
    this._now = 0;
    this._busy = false;
    this._loop = null;
	this._GuestsBase = [];
	this._GuestsGame = [];
	this._GuestsStandard = [];
	this._GuestsSuper = [];
	this._GuestsMega = [];
	this._GuestsUltra = [];
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
			this.refresh();
		}, 1);
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
	const now = Date.now() - this._now;
	const layer = MAGPIE.KEY.RUNTIME.LAYER;
	const layerBase = 0;
	const layerGame = 1;
	const gameDelta = layer.get(layerGame).delta * 1000;
	const standardDelta = 1000;
	if(Math.floor(performance.now()) % 16) this.TICK_game();
	if(now >= standardDelta) return this.TICK_standard();
	this._GuestsBase.forEach(guest => this.guestRefresh(guest, layerBase));
}
MAGPIE_RUNTIME.prototype.TICK_game = function TICK_game()
{
	// console.log("TICK_game");
	const layerGame = 1;
	this._GuestsGame.forEach(guest => this.guestRefresh(guest, layerGame));
}
MAGPIE_RUNTIME.prototype.TICK_standard = function TICK_standard()
{
	// console.log("TICK_standard");
	this._now = Date.now();
	const secondsInMinute = 60;
	if(this._TICK >= secondsInMinute - 1) 
		return this.TICK_super();
	this._TICK++;
	const layerStandard = 2;
	this._GuestsStandard.forEach(guest => this.guestRefresh(guest, layerStandard));
}
MAGPIE_RUNTIME.prototype.TICK_super = function TICK_super()
{
	// console.log("TICK_super");
	this._TICK = 0;
	const minutesInHour = 60;
	if(this._TICKsuper >= minutesInHour - 1)
		return this.TICK_mega();
	this._TICKsuper++;
	const layerSuper = 3;
	this._GuestsSuper.forEach(guest => this.guestRefresh(guest, layerSuper))
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
	this._GuestsMega.forEach(guest => this.guestRefresh(guest, layerMega));
}
MAGPIE_RUNTIME.prototype.TICK_ultra = function TICK_ultra()
{
	// console.log("TICK_ultra");
	this._TICKmega = 0;
	this._TICKultra++
	const layerUltra = 5;
	this._GuestsUltra.forEach(guest => this.guestRefresh(guest, layerUltra));
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
MAGPIE_RUNTIME.prototype.host = function host(guestFirmwareName, layerIDs)
{	
	const ePrefix = "[RUNTIME].host: ";
	try
	{
		layerIDs.forEach(ID => {
			const layerName = this.getLayer(ID);
			if(layerName) 
			{
				const layer = this[`_Guests${layerName}`];
				const index = layer.push(guestFirmwareName) - 1;
				const entry = this._registry.get(guestFirmwareName) || {};
				entry[ID] = index
				this._registry.set(guestFirmwareName, entry);
			}
		})
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
		if(!layer) 
			throw new Error(`${layer} is invalid layer`);
		const index = this._registry.get(guestFirmwareName)[layerID];
		if(!index) 
			throw new Error(`${index} is invalid layer index`)
		const lastGuest = this[layer][layer.length - 1];
		this[layer][index] = lastGuest;
		this._registry.set(lastGuest, {layerID: layerID, index: index});
		this._registry.delete(guestFirmwareName);
		this[layer].pop();
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
MAGPIE_RUNTIME.prototype.guestRefresh = async function guestRefresh(guest, layer)
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
// #endregion - RUNTIME
//========================================================================
/**
 * @name HIVE
 * @desc 
 * 
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
 * @typedef {Map<Number, hive_entry>} hive_registry
 * @typedef {import("../SERVER").hive_buffer} hive_buffer
 * @typedef {Float64Array<entityID>} hive_layer
 * @typedef {import("./entity").entityID} entityID
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_HIVE.prototype.initialize = function initialize()
{
	MAGPIE_SYSTEM.prototype.initialize.call(this);
	this.meta.name = MAGPIE_HIVE.meta.name;
	this.meta.desc = MAGPIE_HIVE.meta.desc;
	/** @type {hive_buffer} */
	this._GuestsBase = [];
	/** @type {hive_buffer} */
	this._GuestsGame = [];
	/** @type {hive_layer} default size: 5,000 */
	this._GuestsStandard = new Float64Array(5000).fill(0);
	/** @type {hive_layer} default size: 10,000 */
	this._GuestsSuper = new Float64Array(10000).fill(0);
	/** @type {hive_layer} default size: 50,000 */
	this._GuestsMega = new Float64Array(50000).fill(0);
	/** @type {hive_layer} default size: 100,000 */
	this._GuestsUltra = new Float64Array(100000).fill(0);
	/** @type {hive_registry} */
	this._registry = new Map();
	this._dt = 0;
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
    MAGPIE_SYSTEM: MAGPIE_SYSTEM,
    MAGPIE_IO: MAGPIE_IO,
	MAGPIE_LOG: MAGPIE_LOG,
    MAGPIE_RUNTIME: MAGPIE_RUNTIME,
	MAGPIE_HIVE: MAGPIE_HIVE,
    MAGPIE_METASTATE: MAGPIE_METASTATE,
	MAGPIE_CALENDAR: MAGPIE_CALENDAR,
	MAGPIE_DATE: MAGPIE_DATE
}