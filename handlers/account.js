/**
 * @namespace accountHandler
 * @author Matheraptor
 * @version 0.36.0
 * 
 * @typedef {import("socket.io").Socket} Socket
 */
const account = {}
const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../src/services/crypto");
const mailer = require("./email_api")
// const { MAGPIE } = require("../core/index")
const ePrefix = "[ACCOUNT HANDLER] "
account.printPlayerAuth = function(player)
{
	return `[PLAYER-${player?.ID} | ${player?.username}] `
}
/**
 * @desc Handles incoming player registration events over network sockets
 * @param {Object} data 
 * @param {Object} socket 
 * @param {Object} server 
 */
account.register = async function(data, socket, server)
{
	try
	{
		if(!data)
			throw new Error("Invalid socket registration data")
		const { username, password, email } = data;
		// const storedHash = await hashPassword(passwordHash);
		const securedPassword = await hashPassword(password);
		const pendingRegistrationToken = jwt.sign({
			username,
			PASS: securedPassword,
			email,
			isRegistrationToken: true
		},
		server.config.jwtSecret,
		{ expiresIn: server.config.jwtExpire })
		try
		{
			server.log(`[USER-${data.email} | ${data.username}] requested a register link`)
			await mailer.sendConfirmation(email, pendingRegistrationToken)
		}
		catch(e)
		{
			server.error(ePrefix + "Mail delivery failed: " + e.message, e)
			throw new Error("Could not deliver verification email.")
		}
		socket.emit("REGISTER_AWAITING_VERIFICATION", { email })
	}
	catch(e)
	{
		server.error(ePrefix + e.message, e)
		socket.emit("REGISTER_ERROR", { message: e.message || "Registration failed." })
	}
}
account.verifyCredentials = async function(email, password, server)
{
	const db = server.DATABASE
	const player = await db.loginPlayer(email, password)
	if(!player) 
		throw new Error("Invalid credentials")
	if(player.isFrozen === 1) 
		throw new Error("Account is frozen")
	const token = jwt.sign(
		{
			id: player.ID,
			username: player.username
		}, 
		server.config.jwtSecret, 
		{ expiresIn: server.config.jwtExpire }
	)
	return { player, token }
}
account.authenticateToken = (req, res, server, next) => {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]
	if(!token) 
		return res.sendStatus(401)	
	jwt.verify(token, server.config.jwtSecret, (err, user) => {
		if(err) 
			return res.sendStatus(403)
		req.user = user
		next()
	})
}
account.resumeSession = async function (data, socket, server)
{
	try
	{
		const { player, token } = await account.verifyCredentials(data.email, data.password, server)
		server.log(`${ePrefix}${account.printPlayerAuth(player)}resumed session. `)
		socket.emit("RESUME_SESSION_SUCCESS", { username: player.username, token })
	}
	catch(e)
	{
		socket.emit("RESUME_SESSION_FAIL", { message: e.message })
		server.error(ePrefix + e.message, e)
	}
}
/** @param {Socket} socket */
account.joinPrivateRoom = function(socket, playerID)
{
	socket.join(`account:${player.ID}`)
	server.log()
}
account.login = async function (data, socket, server)
{
	try
	{
		const { player, token } = await account.verifyCredentials(data.email, data.password, server)
		server.log(`${ePrefix}${account.printPlayerAuth(player)} logged in. `)
		player.status = true
		
		socket.emit("LOGIN_SUCCESS", { 
			token,
			ID: player.ID,
			username: player.username, 
			email: player.email,
			creatureID: player.creatureID,
			EVP: player.EVP,
			CLOUT: player.CLOUT,
			slots: player.slots,
			status: player.status,
			server: server.status
		 })
	}
	catch(e)
	{
		socket.emit(`LOGIN_ERROR`, { message: e.message })
		server.error(ePrefix + e.message, e)
	}
}
account.logout = async function (data, socket, server)
{
	try
	{
		//@todo logout logic here
		server.log(`${ePrefix}logout called for [USER: ${data?.username}]. `)
	}
	catch(e)
	{
		server.error(ePrefix + e.message, e)
		socket.emit("LOGOUT_ERROR", { message: "Logout failed. " })
	}
}
account.relog = async function(data, socket, server)
{
	try
	{
		const { player, token } = await server.DATABASE.loadPlayer(data?.playerID)
		if(!player) 
			return socket.emit("LOGIN_ERROR", { message: "Unable to sync player data. " })
		server.log(`${ePrefix}${account.printPlayerAuth(player)} logged in. `)
		player.status = true
		socket.emit("LOGIN_SUCCESS", { 
			token,
			ID: player.ID,
			username: player.username, 
			email: player.email,
			creatureID: player.creatureID,
			EVP: player.EVP,
			CLOUT: player.CLOUT,
			slots: player.slots,
			status: player.status,
			server: server.status
		 })
	}
	catch(e)
	{
		socket.emit(`LOGIN_ERROR`, { message: e.message })
		server.error(ePrefix + e.message, e)
	}
}
// @todo account.processEmailConfirmation = async function(token, server)
// {
// 	try
// 	{
// 		const decoded = jwt.verify(token, server.config.jwtSecret)
// 		if(!decoded.isRecoveryToken)
// 			throw new Error("Invalid token type")
// 		const newPlayer = {
// 			username: decoded.username,
// 			PASS: decoded.PASS,
// 			email: decoded.email
// 		}
// 	}
// 	catch(e)
// 	{
// 		server.error(ePrefix + e.message, e)
// 	}
// }
account.requestPasswordReset = async function(data, socket, server)
{
	try
	{
		const email = data?.email
		if(!email)
			throw new Error(`${email} is invalid email`)
		// 1. Enforce the interface contract: Verify an object payload arrived
		server.log(`${ePrefix}Processing recovery request for: "${email}"`);
		const db = server.DATABASE
		const player = await db.getPlayerByEmail(email)
		if(!player)
		{
			socket.emit("RESET_PASSWORD_SUCCESS", { email })
			return { success: true }
		}
		const recoveryToken = jwt.sign(
			{
				id: player.ID,
				isRecoveryToken: true
			}, 
			server.config.jwtSecret, 
			{ expiresIn: server.config.jwtExpire }
		)
		try
		{
			await mailer.sendRecovery(email, recoveryToken)
		}
		catch(e)
		{
			server.error(ePrefix + "Mail delivery failed: " + e.message, e)
			throw new Error("Could not deliver recovery email")
		}
		socket.emit("RESET_PASSWORD_SUCCESS", { email })
		return { success: true, sent: true }
	}
	catch(e)
	{
		server.error(ePrefix + e.message, e)
		socket.emit("RESET_PASSWORD_ERROR", { message: e.message || "Recovery failed." })
		// throw e
	}
}
account.processPasswordReset = async function(token, newPassword, server)
{
	try
	{
		if(!token || !newPassword)
			throw new Error("Missing required reset data")
		const decoded = jwt.verify(token, server.config.jwtSecret)
		if(!decoded.isRecoveryToken)
			throw new Error("Invalid token type")
		const secureNewHash = await hashPassword(newPassword);
		const db = server.DATABASE
		const oldPlayer = await db.loadPlayer(decoded.id);
		if(!oldPlayer)
			throw new Error("Account not found!") 
		oldPlayer.PASS = secureNewHash;
		const updatedPlayer = await db.savePlayer(oldPlayer)
		if(!updatedPlayer)
			throw new Error("Unable to update account!")
		server.log(`${ePrefix}${account.printPlayerAuth(decoded)}password updated.`)
		return { success: true }
	}
	catch(e)
	{
		server.error(ePrefix + e.message, e)
		return { success: false }
	}
}
module.exports = function(io, socket, server)
{
	socket.on("REGISTER", async (data) => {
		await account.register(data, socket, server)
	})
	socket.on("LOGIN", async (data) => {
		await account.login(data, socket, server)
	})
	socket.on("LOGOUT", async (data) => {
		await account.logout(data, socket, server)
	})
	socket.on("RELOG", async (data) => {
		await account.relog(data, socket, server)
	})
	socket.on("RESET_PASSWORD_REQUEST", async (data) => {
		await account.requestPasswordReset(data, socket, server)
	})
}
module.exports.account = account;