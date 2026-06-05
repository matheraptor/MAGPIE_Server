const { MAGPIE } = require("../core/index")
const accountHandler = require("./accountHandler")
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
	socket.on("RESET_PASSWORD_REQUEST", async (data) => {
		try
		{
			const result = await accountHandler.processPasswordRecoveryRequest(data.email, server);
			socket.emit("RESET_PASSWORD_SUCCESS", { email: data.email })
		}
		catch(e)
		{
			socket.emit("RESET_PASSWORD_ERROR", { message: e.message })
		}
	})
}