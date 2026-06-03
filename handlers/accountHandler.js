const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../core/auth_util");
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
		const db = server.DATABASE
		const player = await db.createPlayer({
			username,
			PASS: storedHash,
			email
		})

		const token = jwt.sign({ id: player.id, username: player.username }, server.config.jwtSecret, { expiresIn: '1h' });

		socket.emit("REGISTER_SUCCESS", { username, token })
	}
	catch(e)
	{
		console.error(ePrefix + e.message, e)
		socket.emit("REGISTER_ERROR", { message: "Registration failed." })
	}
}
account.login = async function (data, socket, server)
{
	const ePrefix = "[ACCOUNT HANDLER].login: "
	try
	{
		if (!data)
			throw new Error("Invalid socket login data");
		const { email, password } = data;
		const db = server.DATABASE;
		const player = await db.loginPlayer(email, password);
		if(!player)
			throw new Error(`Invalid credentials`);
		const token = jwt.sign({ 
			id: player.id, 
			username: player.username 
		}, 
		server.config.jwtSecret, { expiresIn: '1h' });
		socket.emit("LOGIN_SUCCESS", { username: player.username, token });
	}
	catch(e)
	{
		console.error(ePrefix + e.message, e)
		socket.emit(`LOGIN_ERROR`, { message: "Login failed." })
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
module.exports = function(io, socket, server)
{
	socket.on("REGISTER", (data) => account.register(data, socket, server))
	socket.on("LOGIN", (data) => account.login(data, socket, server))
	socket.on("LOGOUT", (data) => account.logout(data, socket, server))
}
