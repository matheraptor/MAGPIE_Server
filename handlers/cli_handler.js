const { MAGPIE } = require("../core/index")
/**
 * @version 0.36.0
 * 
 */
const accountHandler = require("./accountHandler")
const ePrefix = "[CLI HANDLER] "
module.exports = function(io, socket, server)
{
	try
	{
		socket.emit("boot", MAGPIE.KEY);
		server.log(`${ePrefix} Transmitted core keys to socket: ${socket.id}`, "console", true)
	}
	catch(e)
	{
		server.error(`${ePrefix} Failed to send boot payload: ${e.message}`, e)
	}
	socket.on("RESET_PASSWORD_REQUEST", async (data) => {
		try
		{
			socket.emit("RESET_PASSWORD_SUCCESS", { email: data.email })
			server.log(`${ePrefix} resetpassword: success`, "console", true)
		}
		catch(e)
		{
			socket.emit("RESET_PASSWORD_ERROR", { message: e.message })
			throw e
		}
	})
}