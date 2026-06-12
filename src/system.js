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
 * @typedef {Enumerator<Number>} layerID
 */
class MAGPIE_RUNTIME
{
	//
}

/**
 * @static
 * @desc entities host
 */
class MAGPIE_HIVE
{
	//
}
/**
 * @name MAGPIE_LOG
 *
 * @param {log_data} data
 * @returns {new MAGPIE_LOG}
 */
function MAGPIE_LOG(data = {})
{
	this.initialize(data)
}
/**
 * @name MAGPIE_METASTATE
 * 
 * @param {metastate_data} data
 * @returns {new MAGPIE_METASTATE} 
 */
function MAGPIE_METASTATE(data = {})
{
	this.initialize(data)
}
/**
 * 
 * @param {calendar_data} data 
 * @returns {new MAGPIE_CALENDAR}
 */
function MAGPIE_CALENDAR(data)
{
	this.initialize(data)
}
/**
 * 
 * @param {date_data} data 
 */
function MAGPIE_DATE(data)
{
	this.initialize(data)
}
/**
 * 
 * @param {loadbar_data} data
 * @returns {new MAGPIE_LOADBAR} 
 */
function MAGPIE_LOADBAR(data)
{
	this.initialize(data)
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
 * @name LOG
 * @desc 
 * @typedef {import("./index").urgency} urgency
 * @typedef {import("./index").gravity} gravity
 * @typedef {{
 * contents: String,
 * urgency: urgency,
 * gravity: gravity
 * }} log_data
 */
//========================================================================
// #region - LOG
//========================================================================
MAGPIE_LOG.meta = {
	name: MAGPIE.meta.name + " Log",
	firmwareName: "MAGPIE_LOG"
}
MAGPIE_LOG.errors = []
/**
 * 
 * @param {log_data} data
 * @returns {new MAGPIE_LOG} 
 */
MAGPIE_LOG.prototype.initialize = function initializeLog(data)
{
	this.ID = Date.now()
	this.contents = String(data?.contents)
	this.urgency = Number(data?.urgency)
	this.gravity = Number(data?.gravity)
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
		if(global?.SERVER?.CLI?.loadbar?.isActive)
			global.SERVER.CLI.log(consoleTime + log)
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
	const date = MAGPIE_SYSTEM.Utility.CTZD();
	const full = `[${MAGPIE_SYSTEM.Utility.CTZF()}]`;
	// MAGPIE_LOG.errors.push(log);
	const level = "ERROR"
	console.error(`[${level}] ${log} | `, error);
	const timestamp = full;
	const filename = `logs/error${date}.log`;
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
MAGPIE_SYSTEM.Utility.wait = async function(delay)
{
	return new Promise(res => setTimeout(res, delay));
}
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
/**
 * 
 * @param {[MAJOR: Number, MINOR: Number, PATCH: Number]} version 
 * @returns {`${MAJOR}.${MINOR}.${PATCH}`}
 */
MAGPIE_SYSTEM.Utility.version = function version(version)
{
	if(!version || version.length < 2 || version.some(n => isNaN(n)))
		version = [0,1,0];
	const [MAJOR, MINOR, PATCH] = version
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
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Loadbar
//------------------------------------------------------------------------
MAGPIE_LOADBAR.meta = {}
/**
 * @typedef {{
 * name: String,
 * type: Number,
 * symbol_unloaded: String,
 * symbol_loaded: String,
 * width: Number,
 * percentage: Boolean,
 * ETC: Boolean,
 * rate: Boolean
 * }} loadbar_data
 * @param {loadbar_data} data 
 * @returns {new MAGPIE_LOADBAR}
 */
MAGPIE_LOADBAR.prototype.initialize = function initializeLoadbar(data)
{
	this.name = String(data?.name)
	this.type = Number(data?.type) || 0
	this.arguments = {
		percentage: Boolean(data?.percentage),
		ETC: Boolean(data?.ETC),
		rate: Boolean(data?.rate)
	}
	this.progress = 0
	this.contents = ""
	this.symbol_unloaded = data?.symbol_unloaded || "▒"
	this.symbol_loaded = data?.symbol_loaded || "█"
	this.width = Number(data?.width) || 50
}
/**
 * 
 * @param {{
 * ETC: String,
 * rate: String,
 * log: String,
 * style: String
 * }} options 
 */
MAGPIE_LOADBAR.prototype.render = function renderLoadbar(options)
{
	const percentage = this.arguments.percentage 
		? ` | ${this.progress.toString().padStart(3, " ")}%` 
		: ""
	const ETC = this.arguments.ETC 
		? ` | ${options?.ETC}` 
		: ""
	const rate = this.arguments.rate 
		? ` | ${options?.rate}` 
		: ""
	const progress = Math.round(this.width * (this.progress / 100))
	const current = this.symbol_loaded.repeat(progress)
	const remaining = this.symbol_unloaded.repeat(this.width - progress)
	const style = options?.style ? options.style : ""
	const ansi = MAGPIE.KEY.ANSI
	const reset = ansi.STYLE_RESET
	const log = options?.log || ""
	this.contents = `${style}${current}${remaining}${percentage}${rate}${ETC}${reset}`
	// void process.stdout.write(`${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(2))
	void process.stdout.write(`${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(3) + `${log}\n${this.contents}\n`) 
}
/**
 * @typedef {{
 * amount: Number,
 * ETC: String,
 * rate: String
 * }} loadbar_options
 * @param {loadbar_options} options 
 */
MAGPIE_LOADBAR.prototype.increment = function incrementLoadbar(options)
{
	const amount = Number(options?.amount) || 1
	const percentage = this.progress + amount
	this.progress = Math.min(percentage, this.width)
	const render = {
		ETC: options?.ETC, 
		rate: options?.rate,
		log: options?.log || "",
		style: options?.style
	}
	this.render(render)
}
/**
 * 
 * @param {loadbar_options} options 
 */
MAGPIE_LOADBAR.prototype.update = function updateLoadbar(options)
{
	if(Number(options?.amount))
		this.progress = options.amount
	const render = {
		ETC: options?.ETC, 
		rate: options?.rate,
		log: options?.log || "",
		style: options?.style
	}
	this.render(render)
}
/**
 * 
 */
MAGPIE_LOADBAR.prototype.complete = function completeLoadbar()
{
	this.progress = 100
	const render = {
		percentage: this.progress, 
		ETC: options?.ETC, 
		rate: options?.rate,
		log: options?.log || "",
		style: MAGPIE.KEY.ANSI.STYLE_GREEN
	}
	this.render(render)
}
/**
 * 
 */
MAGPIE_LOADBAR.prototype.clear = function clearLoadbar()
{
	const ansi = MAGPIE.KEY.ANSI
	void process.stdout.write(ansi.moveUpCustom(2) + ansi.CLEAR_LINE)
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
// #region - RUNTIME
//========================================================================
MAGPIE_RUNTIME.meta = {
	//@todo RUNTIME
}
MAGPIE_RUNTIME.awake = function awakeRuntime()
{
	//@todo awakeRuntime
}
MAGPIE_RUNTIME.host = function hostOnRuntime()
{
	//@todo hostOnRuntime
}
MAGPIE_RUNTIME.loadMetastate = function loadMetastateInRuntime()
{
	//@todo runtime_loadMetastate
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
// #region - HIVE
//========================================================================
MAGPIE_HIVE.meta = {
	//@todo HIVE
}
/**
 * 
 * 
 */
MAGPIE_HIVE.setup = function setupHive()
{
	//@todo setupHive
}
MAGPIE_HIVE.awake = function awakeHive()
{
	//@todo awakeRuntime
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
 * @typedef {{
 * calendarID: Number,
 * days: Number,
 * months: {
 * monthName: days<Number>
 * },
 * leapMonth: Number,
 * leapYear: Number,
 * dayLength: hours<Number>
 * epochYear: Number
 * }} calendar_data
 */
//========================================================================
// #region - CALENDAR
//========================================================================
MAGPIE_CALENDAR.meta = {}
/**
 * 
 * @param {calendar_data} data 
 * @returns {new MAGPIE_CALENDAR}
 */
MAGPIE_CALENDAR.prototype.initialize = function initializeCalendar(data)
{
	//@todo MAGPIE_CALENDAR.initialize
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
//========================================================================
// #region - DATE
//========================================================================
MAGPIE_DATE.meta = {
	name: MAGPIE.meta.name + " Date",
	desc: "Date/Time system and component template",
	firmwareName: "MAGPIE_DATE"
}
/**
 * 
 * @param {date_data} data 
 */
MAGPIE_DATE.prototype.initialize = function initializeDate(data)
{
	this._firmware = MAGPIE_DATE.meta.firmwareName
	this.calendar = Number(data?.calendar) || MAGPIE.KEY.CALENDAR.GREGORIAN.ID
	this.epoch = Number(date?.epoch)
	this.year = Number(date?.year)
	this.month = Number(date?.month)
	this.day = Number(date?.day)
	this.weekDay = Number(date?.weekDay)
	this.hour = Number(date?.hour)
	this.minute = Number(date?.minute)
	this.second = Number(date?.second)
	this.millisecond = Number(date?.millisecond)
	this.setup()
}
/**
 * 
 */
MAGPIE_DATE.prototype.setup = async function setupDate()
{
	if(!this.epoch) this.getEpoch();
	if(!this.epoch) this.setReal();
	this.setupFromEpoch()
}
/**
 * 
 * @param {epoch_game} epoch
 */
MAGPIE_DATE.prototype.setupFromEpoch = function setupDateFromEpoch(epoch)
{
	if(!epoch) epoch = this.epoch
	if(!this.epoch) return
	this.epoch = epoch;
	const calendar = MAGPIE_CALENDAR.INDEX.get(this.calendar)
	if(!calendar) return
	const msPerDay = calendar.dayLength * 60**2 * 1000;
	const msPerYear = calendar.days * msPerDay;
	const yearRaw = epoch / msPerYear;
	this.year = Math.floor(yearRaw) + calendar.epochYear;
	const dayRaw = (epoch % msPerYear) / msPerDay;
	this._yearday = Math.floor(dayRaw) + 1;
	let accumulatedDays = 0;
	let monthIndex = 1;
	for (const [mName, mDays] of Object.entries(calendar.months))
	{
		if(dayRaw < accumulatedDays + mDays)
		{
			this.month = monthIndex;
			this.day = Math.floor(dayRaw - accumulatedDays) + 1
			break
		}
		accumulatedDays += mDays;
		monthIndex++
	}
	const dayRemainderMs = (epoch % msPerYear) % msPerDay;
	this.hour = Math.floor(dayRemainderMs / (60**2 * 1000))
	this.minute = Math.floor((dayRemainderMs % (60**2 * 1000)) / (60 * 1000))
	this.second = Math.floor((dayRemainderMs % (60 * 1000)) / 1000)
	this.millisecond = Math.floor(dayRemainderMs % 1000)
	const totalDaysPassed = Math.floor(epoch / msPerDay)
	const totalWeekDays = Object.keys(calendar.weekDays).length || 7;
	this.weekDay = totalDaysPassed % totalWeekDays
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
 * @name MAGPIE_METASTATE
 * @desc 
 * @typedef {{
 * date: date_data
 * }} metastate_data
 * 
 */
//========================================================================
// #region - METASTATE
//========================================================================
MAGPIE_METASTATE.meta = {
	name: MAGPIE.meta.name + " Metastate",
	firmwareName: "MAGPIE_METASTATE"
}
/**
 * 
 * @param {metastate_data} data 
 */
MAGPIE_METASTATE.prototype.initialize = function initializeMetastate(data)
{
	this._firmware = MAGPIE_METASTATE.meta.firmwareName
	const stamp = MAGPIE_SYSTEM.Utility.epoch()
	this.meta = {
		isSystem: true,
		isMetastate: true,
		name: MAGPIE_METASTATE.meta.name,
		desc: "Metadata of the 'game-verse' (game universe)",
		version: MAGPIE.meta.version,
		firmwareName: MAGPIE_METASTATE.meta.firmwareName,
		created: stamp,
		updated: stamp
	}
	this.date = new MAGPIE_DATE(data?.date)
	this.hive = new Map()
	if(!data?.contents)
		data.contents = {}
	/** @type {metastate_contents} */
	this.contents = data.contents
	this.setup()
}
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
	MAGPIE_IO,
	MAGPIE_LOG,
	MAGPIE_RUNTIME,
	MAGPIE_HIVE,
	MAGPIE_METASTATE,
	MAGPIE_CALENDAR,
	MAGPIE_DATE,
	MAGPIE_LOADBAR
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE 
//========================================================================