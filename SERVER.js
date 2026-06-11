/**
 * @name MAGPIE_Server
 * @desc 
 * @author Matheraptor
 * @version 0.39.0
 */
class MAGPIE_SERVER
{
	//
}
/**
 * @name IMPORT
 * @desc dependencies
 */
//========================================================================
// #region - IMPORT
//========================================================================
MAGPIE_SERVER.config = require("./config/server_config")
const { timeEnd } = require("node:console")
const express = require("express")
const ratelimit = require("express-rate-limit")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
const cliSpinner = require("cli-spinner")
const cliProgress = require("cli-progress")
MAGPIE_SERVER.FS = require("fs")
MAGPIE_SERVER.PATH = require("path")
MAGPIE_SERVER.VM = require("node:vm")
MAGPIE_SERVER.JWT = require("jsonwebtoken")
MAGPIE_SERVER.MAIL = require("./src/services/mailer")
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
// const { MAGPIE_PLAYER } = require("./src/player")
// const { MAGPIE_DATABASE } = require("./src/database")
const STATES = require("./data/states")
const COMPONENTS = require("./data/components")
const EMOTES = require("./data/emotes")
// MAGPIE.KEY.STATE.TYPE = STATE?.TYPE || {}
// MAGPIE.KEY.STATE.INDEX = STATE?.INDEX || {}
MAGPIE_SERVER.meta = MAGPIE.meta
MAGPIE_SERVER.meta.name += " server"
const {
	MAGPIE_SYSTEM,
	// MAGPIE_LOG,
	// MAGPIE_IO,
	// MAGPIE_HIVE,
	// MAGPIE_RUNTIME,
	// MAGPIE_METASTATE,
	// MAGPIE_DATE,
	// MAGPIE_CALENDAR
} = SYSTEM
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
// #region > App
//------------------------------------------------------------------------
const app = express()
const server = createServer(app)
const io = new Server(server, {
	cors: {
		origin: "*", //temporarily allow for all debugging
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
	windowMs: MAGPIE.KEY.SERVER.LOGIN_COOLDOWN * 60 * 1000
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
MAGPIE_SERVER.SOCKET = {}
io.use((socket, next) => {
	const token = socket.handshake.auth?.token
	const config = MAGPIE.config
	const isDev = config.devMode
	if(!token)
	{
		socket.data.playerID = isDev ? 999 : 0
		return next()
	}
	try
	{
		// @todo JWT login security
		next()
	}
	catch(e)
	{
		socket.data.playerID = 0
		MAGPIE_SERVER.SOCKET.auth_failed(socket.id, e.message)
		next(new Error(String(MAGPIE.KEY.HTTP.STATUS_403.code)))
	}
})
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
MAGPIE_SERVER.CLI._stopSpinner = function (spinner)
{
	const Spinner = MAGPIE_SERVER.CLI.SPINNER
	if(!(spinner instanceof Spinner))
	return spinner.stop(true)
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
// #region - SESSION
//========================================================================
MAGPIE_SERVER.SESSION = {}
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Playerbase
//------------------------------------------------------------------------
MAGPIE_SERVER.SESSION.activePlayers = new Set()
MAGPIE_SERVER.SESSION.visitorCount = 0

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
// #region - BOOT
//========================================================================
MAGPIE_SERVER.BOOT = {}
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
	MAGPIE_SERVER.log(MAGPIE_SERVER.BOOT.splash_message())
}
/**
 * 
 * @returns {String}
 */
MAGPIE_SERVER.BOOT.splash_message = function serverSplashMessage()
{
	const version = MAGPIE_SERVER.UTILITY.version(MAGPIE.meta.version)
	return `${MAGPIE.meta.name} v${version} ${MAGPIE.meta.firmwareDate}`
}
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
const REPL = require("repl")
// console.clear()
const r = REPL.start("MAGPIE:> ")
r.context.r = r
// MAGPIE_SERVER.CLI._createLoadBar()
MAGPIE_SERVER.BOOT.connect().then(() => main())
const main = async function main()
{
	// MAGPIE_SERVER.RUNTIME = MAGPIE_RUNTIME @todo RUNTIME
	// MAGPIE_SERVER.DATABASE = MAGPIE_DATABASE @todo DATABASE
	MAGPIE_SERVER.log("loading data...", null, true)
	// await MAGPIE_EMOTE.setup()
	// MAGPIE_SERVER.CLI._incrementLoadBar(5)
	r.context.MAGPIE = MAGPIE
	r.context.SERVER = MAGPIE_SERVER
	// r.context.RUNTIME = MAGPIE_RUNTIME
	r.context.SYSTEM = MAGPIE_SYSTEM
	// r.context.HIVE = MAGPIE_HIVE
	// r.context.DATABASE = MAGPIE_DATABASE
	setTimeout(() => {
		// MAGPIE_SERVER.BOOT.logBootTime()
		r.displayPrompt()
	}, 100)
}
// fs.watchFile(MAGPIE_SERVER.scratchpad.file, { interval: 1000 }, (curr, prev) => {
// 	if(curr.mtime > prev.mtime) 
// 	{
// 		console.log("--- Executing VScode scratchpad ---")
// 		MAGPIE_SERVER.scratchpad.load("scratchpad.js")
// 	}
// })
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