/**
 * @version 0.36.0
 * @desc sessionManager
 * 
 */
const manager = {}
const ePrefix = "[SESSION MANAGER] "
manager.activeSessions = new Map();
manager.init = function(io, server) 
{
    try
    {
        io.on("connection", (socket) => {
            const auth = socket.handshake.auth
            manager.activeSessions.set(socket.id, {
                playerID: auth.playerID,
                username: auth.username,
                joinedAt: Date.now()
            })
            server.log(`${ePrefix} connected. Total players: ${manager.activeSessions.size}`)
            socket.on("disconnect", () => {
                manager.activeSessions.delete(socket.id)
                server.log(`${ePrefix} disconnected. Total players: ${manager.activeSessions.size}`)
            })
        })
    }
    catch(e)
    {
        server.error(ePrefix + e.message, e)
    }
}
manager.printPlayerAuth = function(auth)
{
    return `[PLAYER-${auth?.playerID} | ${auth?.username}]`
}
module.exports = manager;