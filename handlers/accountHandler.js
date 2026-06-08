const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../core/auth_util");
const mailer = require("./email_api")
const ePrefix = "[ACCOUNT HANDLER] "
/**
 * @namespace accountHandler
 * @author Matheraptor
 * @version 0.36.0
 */
const account = {}
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
		{ expiresIn: '24h' })
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
	const token = jwt.sign({
		id: player.ID,
		username: player.username
	}, server.config.jwtSecret, { expiresIn: '1h' })
	return { player, token }
}
account.resumeSession = async function (data, socket, server)
{
	try
	{
		const { player, token } = await account.verifyCredentials(data.email, data.password, server)
		server.log(`${ePrefix} [PLAYER-${player.ID} | ${player.username}] resumed session`)
		socket.emit("RESUME_SESSION_SUCCESS", { username: player.username, token })
	}
	catch(e)
	{
		socket.emit("RESUME_SESSION_FAIL", { message: e.message })
		server.error(ePrefix + e.message, e)
	}
}
account.login = async function (data, socket, server)
{
	try
	{
		const { player, token } = await account.verifyCredentials(data.email, data.password, server)
		server.log(`${ePrefix}[PLAYER-${player.ID} | ${player.username}] logged in.`)
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
		server.log(`${ePrefix}logout called for user: ${data?.username}`)
	}
	catch(e)
	{
		server.error(ePrefix + e.message, e)
		socket.emit("LOGOUT_ERROR", { message: "Logout failed." })
	}
}
account.relog = async function(data, socket, server)
{
	try
	{
		const { player, token } = await server.DATABASE.loadPlayer(data?.playerID)
		if(!player) 
			return socket.emit("LOGIN_ERROR", { message: "Unable to sync player data." })
		server.log(`${ePrefix}[PLAYER-${player.ID} | ${player.username}] logged in.`)
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
// account.processEmailConfirmation = async function(token, server)
// {
// 	const ePrefix = "[ACCOUNT HANDLER] "
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
		const recoveryToken = jwt.sign({
			id: player.ID,
			isRecoveryToken: true
		}, server.config.jwtSecret, { expiresIn: '1h' })
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
		server.log(`${ePrefix}[PLAYER-${decoded.id}].password updated.`)
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