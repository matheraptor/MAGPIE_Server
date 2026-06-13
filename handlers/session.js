/**
 * @namespace MAGPIE_Server
 * @name session
 * @desc session Manager
 * @version 0.39.0
 * @typedef {import("socket.io").Server} io
 * @typedef {import("socket.io").Socket} socket
 * @typedef {Number} socketID
 * @typedef {import("../SERVER").MAGPIE_SERVER} MAGPIE_SERVER
 * @typedef {import("../src/player").playerID} playerID
 * @typedef {import("../SERVER").session_data} session_data
 */
//========================================================================
// #region - MANAGER
//========================================================================
const manager = {}
const { MAGPIE } = require("../src/index")
const ePrefix = "[SESSION MANAGER] "
manager.printPlayerAuth = function(auth)
{
	return `[PLAYER-${auth?.playerID} | ${auth?.username}]`
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
 * 
 * @param {io} io 
 * @param {socket} socket 
 * @param {MAGPIE_SERVER} server 
 * 
 */
module.exports = function(io, socket, server)
{
	try
	{
		/** @typedef {import("../SERVER").auth} auth @type {auth} */
		const auth = socket.handshake.auth
		/** @type {session_data} */
		const session = server.SESSION
		if(auth?.playerID)
			session.active.set(socket.id, {
				playerID: auth.playerID,
				username: auth.username,
				joinedAt: Date.now()
			})
		server.log(`Total players: ${session.active.size}`)
		io.on("connection", (socket) => {
			socket.on("disconnect", () => {
				session.active.delete(socket.id)
				server.log(`${ePrefix} disconnected. Total players: ${manager.active.size}`)
			})
		})
	}
	catch(e)
	{
		server.error(ePrefix + e.message, e)
	}
}