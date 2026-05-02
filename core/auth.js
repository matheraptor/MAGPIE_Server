/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - INDEX
//========================================================================
const jwt = require("jsonwebtoken");
const config = require("./config");
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
 * @type {{
 * signToken: (Number) => String,
 * verifyToken: (token) => import("jsonwebtoken").JwtPayload
 * }}
 * 
 */
//========================================================================
// #region - AUTH
//========================================================================
const MAGPIE_AUTH = {
	signToken(playerID)
	{
		const secret = config.jwtSecret || "dev_secret";
		const payload = { playerID: playerID };
		return jwt.sign(payload, secret, { expiresIn: "24h" });
	},
	verifyToken(token)
	{
		try
		{
			const secret = config.jwtSecret || "dev_secret";
			return jwt.verify(token, secret);
		}
		catch(e)
		{
			return null
		}
	}
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = MAGPIE_AUTH;