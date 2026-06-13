/**
 * @name MAGPIE_Server
 * @desc
 * @author Matheraptor
 * @version 0.39.0
 * @typedef {MAGPIE_SERVER} MAGPIE_SERVER
 */
class MAGPIE_SERVER
{
	//
}
/**
 * @name INDEX
 * @desc init & dependencies
 */
//========================================================================
// #region - INDEX
//========================================================================
/**
 * @name
 * @desc
 * 
 */
//------------------------------------------------------------------------
// #region > require
//------------------------------------------------------------------------

MAGPIE_SERVER.config = require("./config/server_config")
const { timeEnd } = require("node:console")
const express = require("express")
const ratelimit = require("express-rate-limit")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
const cliSpinner = require("cli-spinner")
const cliProgress = require("cli-progress")
const fs = require("fs")
const path = require("path")
const vm = require("node:vm")
const readline = require("readline")
/**
 * @typedef {import("jsonwebtoken")} jwt
 * @type {jwt}
 */
const jwt = require("jsonwebtoken")
MAGPIE_SERVER.MAIL = require("./src/services/mailer")
MAGPIE_SERVER.FS = fs
MAGPIE_SERVER.PATH = path
MAGPIE_SERVER.VM = vm
MAGPIE_SERVER.JWT = jwt
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Internal
//------------------------------------------------------------------------
const { MAGPIE } = require("./src/index")
const SYSTEM = require("./src/system")
const { MAGPIE_PHYSICS } = require("./src/physics")
const COMPONENT = require("./src/component")
const { MAGPIE_ENTITY } = require("./src/entity")
const { MAGPIE_PLAYER } = require("./src/player")
const { MAGPIE_DATABASE } = require("./src/database")
const STATES = require("./data/states")
const COMPONENTS = require("./data/components")
const EMOTES = require("./data/emotes")
// MAGPIE.KEY.STATE.TYPE = STATE?.TYPE || {}
// MAGPIE.KEY.STATE.INDEX = STATE?.INDEX || {}
const {
	MAGPIE_SYSTEM,
	MAGPIE_LOG,
	MAGPIE_IO,
	MAGPIE_HIVE,
	MAGPIE_RUNTIME,
	MAGPIE_METASTATE,
	MAGPIE_DATE,
	MAGPIE_CALENDAR,
	MAGPIE_LOADBAR
} = SYSTEM
const {
	MAGPIE_COMPONENT,
	MAGPIE_STATE,
	MAGPIE_EMOTE,
	MAGPIE_EXP,
	MAGPIE_KEY,
	MAGPIE_CONTEXT,
	MAGPIE_TICKET,
	MAGPIE_SYMBOL,
	MAGPIE_ENGINE,
	MAGPIE_PROPULSOR,
	MAGPIE_POWERTRAIN,
	MAGPIE_CONTAINER
} = COMPONENT
MAGPIE_SERVER.registry = {
	MAGPIE,
	MAGPIE_SYSTEM,
	MAGPIE_LOG,
	MAGPIE_IO,
	MAGPIE_RUNTIME,
	MAGPIE_HIVE,
	MAGPIE_METASTATE,
	MAGPIE_DATE,
	MAGPIE_CALENDAR,
	MAGPIE_PHYSICS,
	MAGPIE_COMPONENT,
	MAGPIE_EXP,
	MAGPIE_KEY,
	MAGPIE_EMOTE,
	MAGPIE_ENTITY,
	MAGPIE_PLAYER,
	MAGPIE_DATABASE,
	MAGPIE_SYMBOL,
	MAGPIE_CONTEXT,
	MAGPIE_TICKET,
	MAGPIE_STATE,
	MAGPIE_ENGINE,
	MAGPIE_PROPULSOR,
	MAGPIE_POWERTRAIN,
	MAGPIE_CONTAINER,
	MAGPIE_LOADBAR
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Index
//------------------------------------------------------------------------
MAGPIE_SERVER.meta = MAGPIE.meta
MAGPIE_SERVER.meta.name += " Server"
MAGPIE_SERVER.perf = {
	start: performance.now(),
	/** @type {Number} */
	end: NaN
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link }
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
// #region - SERVER
//========================================================================
/**
 * @desc {@link MAGPIE_SERVER.SOCKET.meta}
 */
MAGPIE_SERVER.SOCKET = {}
/**
 * @desc {@link MAGPIE_SERVER.SESSION.meta}
 */
MAGPIE_SERVER.SESSION = {}
/**
 * @name
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Logging
//------------------------------------------------------------------------
// MAGPIE_SERVER.LOG = MAGPIE_LOG
/**
 *
 * @param {String} message
 * @param {String} prefix
 * @param {Boolean} logToConsole
 */
MAGPIE_SERVER.log = function serverLog(message, prefix, logToConsole)
{
	MAGPIE_SYSTEM.log.call(this, message, prefix, logToConsole)
	r.displayPrompt(true)
}
/**
 * 
 * @param {String} message 
 * @param {Error} error 
 */
MAGPIE_SERVER.error = function serverError(message, error)
{
	MAGPIE_SYSTEM.error.call(this, message, error)
}
/**
 *
 * @param {String} message
 * @returns
 */
MAGPIE_SYSTEM._logging_debug = function server_debug(message)
{
	if(r.cursor > 0)
		return
	console.clear();
	console.error(new Error(message + "\n"));
	r.displayPrompt();
	// lastMessage = message;
}
/**
 *
 * @param {String} message
 */
MAGPIE_SERVER._debug = function serverDebug(message)
{
	MAGPIE_SYSTEM._logging_debug.call(this, message)
}
/**
 *
 * @param {String} message
 */
MAGPIE_SERVER.log_exp = function serverLogExp(message)
{
	MAGPIE_SYSTEM.logging.log_exp.call(this, message)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > System
//------------------------------------------------------------------------
MAGPIE_SERVER.SYSTEM = {}
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
MAGPIE_SERVER.handlers = {};
MAGPIE_SERVER.SYSTEM._handlersPath = path.join(__dirname, "handlers")
fs.readdirSync(MAGPIE_SERVER.SYSTEM._handlersPath)
	.forEach(file => {
		const handler = require(path.join(MAGPIE_SERVER.SYSTEM._handlersPath, file))
		const handlerName = path.parse(file)
		MAGPIE_SERVER.handlers[handlerName] = handler
	})
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > App
//------------------------------------------------------------------------
const app = express()
const server = createServer(app)
MAGPIE_SERVER.SOCKET.io = "Server"
const io = new Server(server, {
	//@audit-ok cors configs
	cors: {
		origin: [MAGPIE.KEY.SERVER.DOMAIN],
		methods: ["GET", "POST"],
		credentials: true
	},
	transports: ["websocket", "polling"],
	allowUpgrades: true
})
instrument(io, {
	auth: false,
	mode: "development"
})
app.use((req, res, next) => {
	// @audit-ok [HTTP REQUEST] debug logging
	MAGPIE_SERVER.log(`[HTTP REQUEST] ${req.method} ${req.url}`)
	next()
})
const static = MAGPIE_SERVER.PATH.join(process.cwd(), "public")
app.use(express.static(static))
console.log(static)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
/**
 *
 *
 */
MAGPIE_SERVER.PUBLIC = {}
MAGPIE_SERVER.PUBLIC.loginLimiter = ratelimit.rateLimit({
	windowMs: MAGPIE.KEY.SERVER.LOGIN_COOLDOWN * 60 * 1000,
	max: MAGPIE.KEY.SERVER.LOGIN_COOLDOWN * 60 * 1000,
	handler: (req, res, next, options) => {
		const code = MAGPIE.KEY.HTTP.STATUS_429.code
		const resetTime = req.rateLimit.resetTime
		const remainingMs = resetTime - Date.now()
		const minutes = Math.ceil(remainingMs / (60 * 1000))
		res.status(code).json({
			status: code,
			error: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
			message: `Please, wait ${minutes} minute(s) before trying again.`,
			retryAfter: minutes
		})
	},
	standardHeaders: true,
	legacyHeaders: false
})
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * @typedef {import("socket.io").Socket} socket
 * @typedef {String} jwt_token
 * @typedef {import("./src/player").playerID} playerID
 * @typedef {import("./src/player").username} username
 * @typedef {import("./src/player").email_encrypted} email_encrypted
 * @typedef {import("./src/entity").entityID} entityID
 * @typedef {{
 * token: jwt_token,
 * playerID: playerID,
 * username: username,
 * entityID: entityID
 * }} auth
 */
//------------------------------------------------------------------------
// #region > Socket
//------------------------------------------------------------------------
MAGPIE_SERVER.SOCKET.meta = {
	//
}
io.use((socket, next) => {
	/**
	 *
	 * @type {auth}
	 * */
	const auth = socket.handshake.auth
	const token = auth?.token
	const config = MAGPIE.config
	const isDev = config.devMode
	const ePrefix = `[SOCKET-${socket?.id}] `
	const code = MAGPIE.KEY.HTTP.STATUS_401.code
	if(!token)
	{
		if(isDev)
		{
			socket.data.playerID = 999
			return next()
		}
		socket.data.playerID = 0
		return next(new Error(`[${code}]: missing token`))
	}
	try
	{
		// @todo JWT login security
		const decoded = MAGPIE_SERVER.JWT.verify(token, config.jwtSecret)
		socket.data.playerID = decoded.id
		next()
	}
	catch(e)
	{
		socket.data.playerID = 0
		MAGPIE_SERVER.SOCKET.auth_failed(socket.id, e.message)
		next(new Error(`[${code}]: invalid token`))
	}
})
io.on("connection", (socket) => {
	const playerID = String(socket.data.playerID)
	const ePrefix = `[SOCKET-${socket?.id}] `
	const ePlayer = `[PLAYER-${playerID}] `
	MAGPIE_SERVER.log(ePrefix + "connected")
	socket.use(([event, ...args], next) => {
		MAGPIE_SERVER.log(`${ePrefix}${ePlayer}${event} — ${JSON.stringify(args)}`, "console", false)
		if(socket.data.isFrozen && event !== "chat message")
		{
			socket.emit("error_message", "You are frozen!")
			return MAGPIE_SERVER.log(`${ePrefix}${ePlayer} is frozen`)
		}
		next()
	})
	Object.values(MAGPIE_SERVER.handlers).forEach(handler => {
		if(typeof handler === "function")
			handler(io, socket, MAGPIE_SERVER)
	})
	socket.on("disconnect", (reason) => {
		if(playerID !== 0)
			MAGPIE_SERVER.log(`${ePrefix}${ePlayer} disconnected: ${reason}`, "concole", false)
	})
	socket.on("error", (err) => {
		socket.emit("error_message", err.message)
	})
})
MAGPIE_SERVER.status = {}
/**
 *
 * @param {String} socketID
 * @param {String} errorMessage
 * @returns
 */
MAGPIE_SERVER.SOCKET.auth_failed = function(socketID, errorMessage)
{
	const err = new Error(errorMessage)
	return MAGPIE_SERVER.error(`[AUTH] [FAIL] [SOCKET-${socketID}] `
		+ `invalid: ${err.message}`, err
	)
}
/**
 * 
 * @param {String} socketID
 */
MAGPIE_SERVER.SOCKET.auth_dev = function auth_dev (socketID)
{
	MAGPIE_SERVER.log("[AUTH] [DEV] Dev-mode active. bypassing JWT for "
		+ `[SOCKET-${socketID}]`
	)
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
// #region - CLI
//========================================================================
MAGPIE_SERVER.CLI = {}
/**
 * @name 
 * @desc
 * 
 */
//------------------------------------------------------------------------
// #region > Spinner
//------------------------------------------------------------------------
/**
 * @typedef {import("cli-spinner").Spinner} Spinner
 */
MAGPIE_SERVER.CLI.SPINNER = cliSpinner.Spinner
MAGPIE_SERVER.CLI.spinners = {}
/**
 *
 * @param {{
 * name: "spinner1",
 * string: "|/-",
 * message: ""
 * }} options
 * @returns {new Spinner}
 */
MAGPIE_SERVER.CLI._createSpinner = function(options = {})
{
	if(!options?.name)
		options.name = "spinner1"
	if(!options?.string)
		options.message = ""
	const Spinner = MAGPIE_SERVER.CLI.SPINNER
	MAGPIE_SERVER.CLI.spinners[options.name] = new Spinner(options.message + "%s")
	const spinner = MAGPIE_SERVER.CLI.spinners[options.name]
	if(options?.string)
		spinner.setSpinnerString(options.string)
	spinner.start()
	return spinner
}
MAGPIE_SERVER.CLI._changeSpinnerChars = function(index, spinnerName = "spinner1")
{
	const spinner = MAGPIE_SERVER.CLI.spinners[spinnerName]
	spinner.chars = MAGPIE_SERVER.CLI.SPINNER.spinners[index]
}
MAGPIE_SERVER.CLI._stopSpinner = function (spinnerName = "spinner1")
{
	const SpinnerClass = MAGPIE_SERVER.CLI.SPINNER
	const spinner = MAGPIE_SERVER.CLI.spinners[spinnerName]
	spinner.stop(true)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * @typedef {import("./src/system").MAGPIE_LOADBAR} MAGPIE_LOADBAR
 * @typedef {import("./src/system").loadbar_options} loadbar_options
 */
//------------------------------------------------------------------------
// #region > loadbar
//------------------------------------------------------------------------
MAGPIE_SERVER.CLI.loadbar = {
	isInit: true,
	isActive: false
}
/**
 * Safely clears the current line or previous lines in the REPL
 * @param {number} linesUp - Number of lines to move up before clearing (default: 0)
 */
MAGPIE_SERVER.CLI.clearREPLline = function clearREPLline(linesUp = 0)
{
	const stream = r.output
	const right = 0
	const left = -1
	const full_line = 1
	// 1. Move cursor vertically if targeting a previous line
	if(linesUp > 0)
		readline.moveCursor(stream, right, -linesUp)
	// 2. Clear the target line completely (0 = right, -1 = left, 1 = entire line)
	readline.clearLine(stream, right)
	// 3. Snap the cursor back to the far left column
	readline.cursorTo(stream, right)

}
MAGPIE_SERVER.CLI.log = function logOnLoadbar(message, barName = "bar1")
{
	//@todo logOnLoadbar
	// const ansi = MAGPIE.KEY.ANSI
	// const stream = r.output
	// void stream.write(`${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(3))
	// void stream.write(`${message}\n`)
	// void stream.write("\n")
	const bar = MAGPIE_SERVER.CLI[barName]
	if(bar instanceof MAGPIE_LOADBAR && bar.isActive)
		bar.render({log: message})
}
/**
 * 
 * @param {loadbar_data} options
 */
MAGPIE_SERVER.CLI._createLoadBar = function(options)
{
	if(!options)
		options = {}
	if(!options?.name)
		options.name = "bar1"
	// MAGPIE_SERVER.CLI.loadbar = new cliProgress.MultiBar({
	// 	clearOnComplete: options?.clearOnComplete || true,
	// 	hideCursor: options?.hideCursor || true
	// }, cliProgress.Presets.shades_classic)
	// MAGPIE_SERVER.CLI[options.name] = MAGPIE_SERVER.CLI.loadbar.create(100,0)
	MAGPIE_SERVER.CLI.loadbar.isActive = true
	return MAGPIE_SERVER.CLI[options.name] = new MAGPIE_LOADBAR(options)
}
/**
 * 
 * @param {Number} value
 * @param {String} name
 */
MAGPIE_SERVER.CLI._updateLoadBar = function updateLoadBar(progress, name)
{
	// MAGPIE_SERVER.CLI[name].update(value)
	if(!name || typeof name !== "string")
		name = "bar1"
	/** @type {MAGPIE_LOADBAR} */
	const bar = MAGPIE_SERVER.CLI[name]
	bar.update({amount: progress})
}
/**
 *
 * @param {Number} value
 * @param {String} name
 */
MAGPIE_SERVER.CLI._incrementLoadBar = function incrementLoadBar(value = 1, name)
{
	if(!name || typeof name !== "string")
		name = "bar1"
	/** @type {MAGPIE_LOADBAR} */
	const bar = MAGPIE_SERVER.CLI[name]
	bar.increment({amount: value})
}
/**
 *
 * @param {String} name
 */
MAGPIE_SERVER.CLI._stop = function stopLoadbar(name = "bar1")
{
	/** @type {MAGPIE_LOADBAR} */
	const bar = MAGPIE_SERVER.CLI[name]
	bar.isActive = false
	bar.clear()
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
MAGPIE_SERVER.PAD = {};
MAGPIE_SERVER.PAD.file = `${process.cwd() + "\\plugins\\scratchpad.js"}`;
MAGPIE_SERVER.PAD.load = async function load(fileName)
{
	const filePath = path.join(__dirname, "plugins", fileName);
	const prefix = "[SCRATCHPAD].load: ";
	try
	{
		const { content, startMarker, startIndex, endIndex } = MAGPIE_SERVER.PAD.read();
		if(startIndex === -1 || endIndex === -1)
			return console.log(prefix + "regions not found. Skipping execution");
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
MAGPIE_SERVER.PAD.read = function read()
{
	const filePath = path.join(__dirname, "plugins", "scratchpad.js");
	const content = fs.readFileSync(filePath, "utf-8");
	const startMarker = "// #region - Scratchpad";
	const endMarker = "// #endregion";
	const startIndex = content.indexOf(startMarker);
	const endIndex = content.indexOf(endMarker);
	return { content, startMarker, endMarker, startIndex, endIndex }
}
MAGPIE_SERVER.PAD.log = function log(input)
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
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - SESSION
//========================================================================
MAGPIE_SERVER.SESSION.meta = {
	//
}
/**
 * @typedef {Map<socketID, {
 * playerID: playerID,
 * username: String,
 * joined: epoch_real
 * }} session_data
 * @type {session_data}
 */
MAGPIE_SERVER.SESSION.active = new Map()
/**
 *
 * @desc back to {@link MAGPIE_SERVER.meta}
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
// #region - REPL
//========================================================================
MAGPIE_SERVER.context = {}
// MAGPIE_SERVER.prototype.constructor = MAGPIE_SERVER
/**
 *
 * @returns {Number}
 */
MAGPIE_SERVER._REPL_boot = function bootREPLconsole()
{
	Object.keys(MAGPIE_SERVER.registry).forEach(k => {
		MAGPIE_SERVER.context[k] = MAGPIE_SERVER.registry[k]
	})
	const keys = Object.keys(MAGPIE_SERVER.context)
	keys.forEach(k => {
		r.context[k] = MAGPIE_SERVER.context[k]
		MAGPIE_SERVER.CLI._incrementLoadBar()
	})
	return keys.length
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
 * @typedef {import("node:http").Server} node_server
 */
//========================================================================
// #region - BOOT
//========================================================================
MAGPIE_SERVER.BOOT = {}
/** @type {node_server} */
MAGPIE_SERVER.NODE_HTTP = {};
/**
 * @name
 * @desc
 *
 */
//------------------------------------------------------------------------
// #region > Connect
//------------------------------------------------------------------------
MAGPIE_SERVER.BOOT.connect = async function serverConnect()
{
	const S = MAGPIE.KEY.SERVER
	MAGPIE_SERVER.NODE_HTTP = server.listen(S.PORT, "0.0.0.0", () => {
		const port = MAGPIE_SERVER.config.domain.includes("localhost")
			? `:${MAGPIE.KEY.SERVER.PORT}`
			: ""
		const domain = `${MAGPIE_SERVER.config.domain}${port}`
		const message = `${S.MESSAGE.BOOTED}${domain}...`
	MAGPIE_SERVER.log(message)
	})
	// MAGPIE_SERVER.CLI._incrementLoadBar(20);
	return true
}
MAGPIE_SERVER.BOOT.logBootTime = function serverLogBootTime()
{
	const bootTime = `[BOOT time: ${MAGPIE_SERVER.perf.end = performance.now()}]`
	MAGPIE_SERVER.log(MAGPIE_SERVER.BOOT.splash_message(bootTime))
}
/**
 * 
 * @returns {String}
 */
MAGPIE_SERVER.BOOT.splash_message = function serverSplashMessage(text)
{
	const version = MAGPIE_SYSTEM.Utility.version(MAGPIE.meta.version)
	return `${MAGPIE.meta.name} v${version} ${MAGPIE.meta.firmwareDate} ${text}`
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc
 * 
 */
//------------------------------------------------------------------------
// #region > Repl
//------------------------------------------------------------------------
const REPL = require("repl")
console.clear()
const r = REPL.start({
	prompt: "MAGPIE:> ",
	preview: true,
	ignoreUndefined: false,
	writer: function(output)
	{
		if(output === undefined)
			return ""
		return require("util").inspect(output, { colors: true })
	}
})
/**
 * 
 * @param {String} text
 * @returns
 */
function print(text)
{
	return void r.output.write(`${text}`)
}
r.context.print = print
/**
 * 
 * @param {Number} count
 * @returns
 */
r.context.clearLines = (count = 1) => {
	const ansi = MAGPIE.KEY.ANSI
	const sequence = `${ansi.MOVE_UP}${ansi.CLEAR_LINE}`.repeat(count)
	return print(sequence)
}
r.context.printAt = (linesUp, text) => {
	const ansi = MAGPIE.KEY.ANSI
	const sequence = `${ansi.SAVE_CURSOR}${ansi.moveUpCustom(linesUp)}${ansi.CLEAR_LINE}${ansi.CARRIAGE_RETURN}${text}${ansi.RESTORE_CURSOR}`
	return print(sequence)
}
r.context.r = r
// #endregion
//------------------------------------------------------------------------
/**
 * @name
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > bootstrap
//------------------------------------------------------------------------
const main = async function main()
{
	await MAGPIE_SYSTEM.Utility.wait(100)
	MAGPIE_SERVER.CLI._createLoadBar({ percentage: true })
	/** @type {MAGPIE_LOADBAR} */
	const bar = MAGPIE_SERVER.CLI.bar1
	MAGPIE_SERVER.CLI._createSpinner({string: MAGPIE_SERVER.CLI.SPINNER.spinners[18]})
	/** @type {Spinner} */
	const spinner = MAGPIE_SERVER.CLI.spinners.spinner1
	spinner.setSpinnerTitle("loading data...")
	await MAGPIE_SYSTEM.Utility.wait(100)
	const repl_contexts = MAGPIE_SERVER._REPL_boot()
	spinner.setSpinnerTitle(`${repl_contexts}x REPL contexts loaded`)
	await MAGPIE_SYSTEM.Utility.wait(100)
	//
	spinner.setSpinnerTitle("Loading MAGPIE_RUNTIME...")
	await MAGPIE_SYSTEM.Utility.wait(100)
	MAGPIE_SERVER.RUNTIME = MAGPIE_RUNTIME
	bar.increment()
	//
	spinner.setSpinnerTitle("Loading MAGPIE_DATABASE...")
	await MAGPIE_SYSTEM.Utility.wait(100)
	MAGPIE_SERVER.DATABASE = MAGPIE_DATABASE
	bar.increment()
	//
	spinner.setSpinnerTitle("Loading MAGPIE_EMOTE...")
	await MAGPIE_SYSTEM.Utility.wait(100)
	await MAGPIE_EMOTE.setup()
	bar.increment()
	spinner.setSpinnerTitle(`${MAGPIE_EMOTE.INDEX.size}x emotes loaded.`)
	await MAGPIE_SYSTEM.Utility.wait(100)
	//
	spinner.setSpinnerTitle("Loading MAGPIE_STATE...")
	MAGPIE_STATE.setup()
	spinner.setSpinnerTitle(`${MAGPIE_STATE.INDEX.size}x states loaded.`)
	await MAGPIE_SYSTEM.Utility.wait(100)
	bar.increment()
	spinner.setSpinnerTitle(`${MAGPIE_STATE.TYPE.size}x state types loaded.`)
	//
	spinner.setSpinnerTitle("Loading MAGPIE_COMPONENT...")
	MAGPIE_COMPONENT.setup()
	await MAGPIE_SYSTEM.Utility.wait(100)
	bar.increment()
	spinner.setSpinnerTitle("MAGPIE_COMPONENT setup is placeholder.")
	//
	spinner.setSpinnerTitle("Loading MAGPIE_KEY...")
	await MAGPIE_KEY.setup()
	bar.increment()
	spinner.setSpinnerTitle("MAGPIE_KEY setup is placeholder.")
	await MAGPIE_SYSTEM.Utility.wait(100)
	//
	spinner.setSpinnerTitle("Loading MAGPIE_HIVE...")
	MAGPIE_SERVER.HIVE = MAGPIE_HIVE
	MAGPIE_HIVE.setup()
	bar.increment()
	spinner.setSpinnerTitle("MAGPIE_KEY setup is placeholder.")
	await MAGPIE_SYSTEM.Utility.wait(100)
	//
	/** @type {new MAGPIE_METASTATE} */
	MAGPIE_SERVER.METASTATE = null
	spinner.setSpinnerTitle("Setting REPL contexts...")
	r.context.MAGPIE = MAGPIE
	r.context.SERVER = MAGPIE_SERVER
	r.context.RUNTIME = MAGPIE_RUNTIME
	r.context.SYSTEM = MAGPIE_SYSTEM
	r.context.HIVE = MAGPIE_HIVE
	r.context.DATABASE = MAGPIE_DATABASE
	r.context.STATE = MAGPIE_STATE
	r.context.EMOTE = MAGPIE_EMOTE
	r.context.LOADBAR = MAGPIE_LOADBAR
	r.context.io = io
	await MAGPIE_SYSTEM.Utility.wait(100)
	bar.increment()
	spinner.setSpinnerTitle("Loading METASTATE...")
	MAGPIE_SERVER.RUNTIME.loadMetastate()
	await MAGPIE_SYSTEM.Utility.wait(100)
	bar.increment()
	spinner.setSpinnerTitle("Hosting HIVE...")
	MAGPIE_SERVER.RUNTIME.host("HIVE", 0)
	await MAGPIE_SYSTEM.Utility.wait(100)
	bar.increment()
	spinner.setSpinnerTitle("Awaking RUNTIME...")
	MAGPIE_SERVER.RUNTIME.awake()
	await MAGPIE_SYSTEM.Utility.wait(100)
	bar.increment()
	spinner.setSpinnerTitle("Awaking HIVE...")
	MAGPIE_SERVER.HIVE.awake()
	await MAGPIE_SYSTEM.Utility.wait(100)
	bar.update({ amount: 100, log: "MAGPIE_Server ready." })
	MAGPIE_SERVER.CLI._stop()
	spinner.setSpinnerTitle("Serving NODE_HTTP...")
	MAGPIE_SERVER.BOOT.connect()
	await MAGPIE_SYSTEM.Utility.wait(100)
	setTimeout(() => {
		MAGPIE_SERVER.BOOT.logBootTime()
		r.displayPrompt()
	}, 100)
	MAGPIE_SERVER.CLI._stopSpinner()
}
main()
fs.watchFile(MAGPIE_SERVER.PAD.file, { interval: 1000 }, (curr, prev) => {
	if(curr.mtime > prev.mtime)
	{
		console.log("--- Executing VScode scratchpad ---")
		MAGPIE_SERVER.PAD.load("scratchpad.js")
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
// #region > Shutdown
//------------------------------------------------------------------------
/**
 * @typedef {Number} exit_signal
 * @param {exit_signal} signal
 */
MAGPIE_SERVER.BOOT.shutdown = async function shutdown(signal = 0)
{
	const ePrefix = "[BOOT | SHUTDOWN] ";
	MAGPIE_SERVER.CLI._createSpinner({string: MAGPIE_SERVER.CLI.SPINNER.spinners[18]})
	/** @type {Spinner} */
	const spinner = MAGPIE_SERVER.CLI.spinners.spinner1
	spinner.setSpinnerTitle(`[SIGNAL-${signal}] received: initiating shutdown sequence...`)
	if(io)
	{
		const fallbackTimeout = setTimeout(() => {
			const error = new Error(`${ePrefix}Shutdown timeout: forcing shutdown...
				-------------------------------\n\n`);
			spinner.stop(true);
			MAGPIE_SERVER.error(error.message, error);
			process.exit(signal)
		}, 10000)
		try
		{
			// @todo await MAGPIE_HIVE.save();
			MAGPIE_SERVER.log(ePrefix + "save complete.")
			spinner.setSpinnerTitle("terminating database worker...")
			await MAGPIE_SYSTEM.Utility.wait(100)
			MAGPIE_DATABASE.worker.postMessage({method: "close"})
			await new Promise((resolve) => {
				MAGPIE_DATABASE.worker.once('exit', () => {
					spinner.setSpinnerTitle("")
					MAGPIE_SERVER.log(ePrefix + "database_worker closed.", null, true)
					resolve()
				})
			})
			spinner.setSpinnerTitle("closing socket.io server...")
			await new Promise((resolve) => {
				io.close((err) => {
					if(err) MAGPIE_SERVER.error(ePrefix + "[io] " + err.message, err);
					spinner.setSpinnerTitle("")
					MAGPIE_SERVER.log(ePrefix + "Socket.io server closed.", null, true)
					resolve();
				})
			})
			spinner.start()
			await MAGPIE_SYSTEM.Utility.wait(1000)
			// await new Promise((resolve) => {
			// 	MAGPIE_SERVER.NODE_HTTP.close((err) => {
			// 		if(err) MAGPIE_SERVER.error(ePrefix + err.message, err);
			// 		spinner.stop(true)
			// 		process.stdout.write("\n")
			// 		MAGPIE_SERVER.log(ePrefix + "HTTP server closed.", null, true)
			// 		resolve();
			// 	})
			// })
			MAGPIE_SERVER.log(ePrefix + "sequence complete.", "console", true)
			spinner.setSpinnerTitle("Exiting...")
			spinner.start()
			await MAGPIE_SYSTEM.Utility.wait(100)
			// if(typeof r !== 'undefined' && typeof r.displayPrompt === 'function')
			// 	r.displayPrompt();
			spinner.stop(true);
			clearTimeout(fallbackTimeout);
			return process.exit(signal)
		}
		catch(e)
		{
			spinner.stop(true);
			MAGPIE_SERVER.error(ePrefix + e.message, e);
			clearTimeout(fallbackTimeout);
			return process.exit(1);
		}
	}
}
MAGPIE_SERVER.restart = function restart()
{
	MAGPIE_SERVER.BOOT.shutdown(2);
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
 * 
 * @desc back to {@link MAGPIE_SERVER.meta}
 *
 */
//========================================================================
// END OF FILE
//========================================================================