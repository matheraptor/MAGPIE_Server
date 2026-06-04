const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../core/auth_util");
const mailer = require("nodemailer")
/**
 * @namespace accountHandler
 * @author Matheraptor
 * @version 0.32.0
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
	const ePrefix = "[ACCOUNT HANDLER].register: "
	try
	{
		if(!data)
			throw new Error("Invalid socket registration data")
		const { username, passwordHash, email } = data;
		const storedHash = await hashPassword(passwordHash);
		const pendingRegistrationToken = jwt.sign({
			username,
			PASS: storedHash,
			email,
			isRegistrationToken: true
		},
		server.config.jwtSecret,
		{ expiresIn: '24h' })
		try
		{
			await mailer.sendConfirmation(email, pendingRegistrationToken)
		}
		catch(e)
		{
			console.error(ePrefix + "Mail delivery failed: " + e.message, e)
			throw new Error("Could not deliver verification email.")
		}
		socket.emit("REGISTER_AWAITING_VERIFICATION", { email })
		// const db = server.DATABASE
		// const emailVerificationToken = Math.random().toString(36).substring(2,15)
		// const player = await db.createPlayer({
		// 	username,
		// 	PASS: storedHash,
		// 	email,
		// 	emailVerificationToken,
		// 	is
		// })

		// const token = jwt.sign({ id: player.id, username: player.username }, server.config.jwtSecret, { expiresIn: '1h' });

		// socket.emit("REGISTER_SUCCESS", { username, token })
	}
	catch(e)
	{
		console.error(ePrefix + e.message, e)
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
account.login = async function (data, socket, server)
{
	const ePrefix = "[ACCOUNT HANDLER].login: "
	try
	{
		const { player, token } = await account.verifyCredentials(data.email, data.password, server)
		socket.emit("LOGIN_SUCCESS", { username: player.username, token })
	}
	catch(e)
	{
		socket.emit(`LOGIN_ERROR`, { message: e.message })
	}
}
account.logout = async function (data, socket, server)
{
	const ePrefix = "[ACCOUNT HANDLER].logout: "
	try
	{
		//@todo logout logic here
		console.log(`logout called for user: ${data?.username}`)
	}
	catch(e)
	{
		console.error(ePrefix + e.message, e)
		socket.emit("LOGOUT_ERROR", { message: "Logout failed." })
	}
}
account.requestPasswordReset = async function(email, server)
{
	const ePrefix = "[ACCOUNT HANDLER].requestPasswordReset: "
	try
	{
		if(!email)
			throw new Error("Email is required for recovery request")
		const db = server.DATABASE
		const player = await db.getPlayerByEmail(email)
		if(!player)
			return { success: true, sent: false}
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
			console.error(ePrefix + "Mail delivery failed: " + e.message, e)
			throw new Error("Could not deliver recovery email")
		}
		return { success: true, sent: true }
	}
	catch(e)
	{
		console.error(ePrefix + e.message, e)
		throw e
	}
	
}
account.processPasswordReset = async function(token, newPassword, server)
{
	const ePrefix = "[ACCOUNT HANDLER].processPasswordReset: "
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
		return { success: true}
	}
	catch(e)
	{
		console.error(ePrefix + e.message, e)
		throw e
	}
}
module.exports = function(io, socket, server)
{
	socket.on("REGISTER", (data) => account.register(data, socket, server))
	socket.on("LOGIN", (data) => account.login(data, socket, server))
	socket.on("LOGOUT", (data) => account.logout(data, socket, server))
}
