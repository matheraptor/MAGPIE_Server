const { MAGPIE } = require("../core/index")
const cli = {};
module.exports = function(io, socket, server)
{
    try
    {
        socket.emit("boot", MAGPIE.KEY);
        console.log(`[CLI HANDLER] Transmitted core keys to socket: ${socket.id}`)
    }
    catch(e)
    {
        console.error(`[CLI HANDLER] Failed to send boot payload: ${e.message}`, e)
    }
}