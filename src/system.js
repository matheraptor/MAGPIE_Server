/**
 * @name system
 * @desc systems repository
 * @author Matheraptor
 * @version 0.39.0 {@link MAGPIE_SYSTEM.meta.version}
 */
//========================================================================
// #region - INDEX
//========================================================================
class MAGPIE_SYSTEM
{
    //
}
const { MAGPIE } = require("./index")
const fs = require("fs")
const path = require("path")
const { Worker } = require("worker_threads")
const { performance } = require("node:perf_hooks")
const { exec } = require("child_process")
/**
 * @static
 * @desc Input/Output and Filesystem
 */
class MAGPIE_IO
{
    //
}
/**
 * @static 
 * 
 */
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
MAGPIE_IO.meta = {
    name: MAGPIE.meta.name + "I.O.",
    desc: "Input/Output and filesystem",
    firmwareName: "MAGPIE_IO"
}
MAGPIE_IO.WORKER = new Worker("./src/services/fsio.js")
/**
 * 
 * @param {String} filename 
 * @returns {*}
 */
MAGPIE_IO.read = function systemRead(filename)
{
    try
    {
        return fs.readFileSync(filename, "utf-8")
    }
    catch(e)
    {
        console.error(e)
    }
}
/**
 * 
 * @param {String} filename 
 * @param {*} content 
 */
MAGPIE_IO.write = function systemWrite(filename, content)
{
    try
    {
        fs.writeFileSync(filename, content)
    }
    catch(e)
    {
        console.error(e)
    }
}
/**
 * 
 * @param {String} filename 
 * @param {*} content 
 */
MAGPIE_IO.append = function systemAppend(filename, content)
{
    try
    {
        fs.appendFileSync(filename, content)
    }
    catch(e)
    {
        console.error(e)
    }
}
/**
 * 
 * @param {String} filename 
 * @param {String} timestamp 
 * @param {String} level 
 * @param {String} message 
 */
MAGPIE_IO.workerAppend = function workerAppend(filename, timestamp, level = "INFO", message = "")
{
    try
    {
        const requestID = Date.now()
        const payload = {
            method: "appendLog",
            requestID,
            args: {
                timestamp: timestamp,
                level: level,
                message: message,
                filename: filename
            }
        }
        MAGPIE_IO.WORKER.postMessage(payload)
        return true
    }
    catch(e)
    {
        console.error(e)
        return e
    }
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
// #region - SYSTEM
//========================================================================
MAGPIE_SYSTEM.meta = {
    name: MAGPIE.meta.name + " system",
    desc: "",
    version: [0,39,0],
    firmwareName: "MAGPIE_SYSTEM",
    firmwareDate: MAGPIE.meta.firmwareDate
}
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Logging
//------------------------------------------------------------------------
MAGPIE_SYSTEM.logging = {};
/**
 * 
 * @param {String} level 
 * @param {String} message 
 * @param {String} filename 
 */
MAGPIE_SYSTEM.logging.logToWorker = function systemLogToWorker(level, message, filename)
{
    return MAGPIE_IO.workerAppend(filename, timestamp, level, message)
}
/**
 * 
 * @param {String} message 
 * @param {String} prefix 
 * @param {Boolean} logToConsole 
 */
MAGPIE_SYSTEM.log = function systemLog(message, prefix = "console", logToConsole = true)
{
    const date = MAGPIE_SYSTEM.Utility.CTZD()
    const logTime = MAGPIE_SYSTEM.logging.logTime()
    const consoleTime = MAGPIE_SYSTEM.logging.consoleTime()
    const log = (typeof message === "object"
        ? JSON.stringify(message, null, 2)
        : message
    )
    if(logToConsole)
    {
        if(this.CLI?.loadbar?.isActive)
            this.CLI.loadbar.log("\x1b[1A\x1b[2K\r" + consoleTime + log + "\n")
        else console.log(consoleTime + log)
        global.r?.displayPrompt(true)
    }
    if(typeof prefix === "string")
    {
        const filename = `logs/${prefix}${date}.log`
        const timestamp = logTime
        const level = prefix.toUpperCase()
        MAGPIE_IO.workerAppend(filename, timestamp, level, log)
    }
}
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
    const level = "ERROR"
	console.error(`[${level}] ${log} | `, error);
	const timestamp = full;
	const filename = `.logs/error${date}.txt`;
    const message = log + "\n" + error?.stack + "\n---\n"
	const logged = MAGPIE_IO.workerAppend(filename, 
		timestamp, level, message);
	// r.displayPrompt();
}
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
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
MAGPIE_SYSTEM.Utility = {}
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
/**
 * @typedef {Number} epoch_real Date.now() - ms since true epoch
 * 
 * @returns {epoch_real} 
 */
MAGPIE_SYSTEM.Utility.epoch = function epoch()
{
	return Date.now()
}
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
/**
 * 
 * @param {duration} seconds 
 * @returns {time_interval}
 */
MAGPIE_SYSTEM.Utility._makeInterval = function makeInterval(seconds)
{
	const interval = {};
	interval.seconds = Math.round(seconds % 60);
	if(seconds < 60)
		return interval
	const minute = (60**2)
	interval.minutes = Math.floor(seconds % minute);
	if(seconds < minute)
		return interval
	const hour = 60**2 * 24
	interval.hours = Math.floor(seconds % hour);
	if(seconds < hour)
		return interval
	const month = (60**2 * 24 * 30.25)
	interval.days = Math.floor(seconds % month)
	if(seconds < month)
		return interval
	const year = (60**2 * 24 * 30.25 * 365)
	interval.months = Math.floor(seconds % year)
	if(seconds < year)
		return interval
	interval.years = Math.floor(seconds / year)
	return interval
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
                const ETA_sec = Math.floor(ETA_s % 60);
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
/**
 * 
 * @param {MAGPIE_DATE} now
 * @param {duration} ETA
 * @param {{
 * date: Boolean,
 * seconds: Boolean
 * }} options
 * @param {variableCTZ} 
 */
MAGPIE_SYSTEM.Utility._printETZ = function _printETZ(now, ETA = 0, options)
{
	if(!(now instanceof MAGPIE_DATE)) return "n/a"
	const targetEpoch = now.epoch + (ETA * 1000)
	const targetDate = new MAGPIE_DATE({
		calendar: now.calendar,
		epoch: targetEpoch
	})
	return targetDate._printSTZ(options)
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
/**
 * 
 * @param {Number} num 
 * @param {Number} toFixed 
 * @param {Boolean} sign 
 */
MAGPIE_SYSTEM.Utility._format_num = function formatNumber(num, toFixed, sign)
{
	const formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: Number(toFixed) || 0,
	maximumFractionDigits: Number(toFixed) || 0,
	signDisplay: sign ? 'always' : 'never' // Forces +0.00000, -0.00000, +0.00005
	});
	return formatter.format(num)
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
    MAGPIE_SYSTEM
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE 
//========================================================================