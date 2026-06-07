/**
 * @namespace player
 * @author Matheraptor
 * @version 0.32.0
 * 
 */
//========================================================================
// #region - INDEX
//========================================================================
/**
 * @name 
 * @desc 
 * @param {{
 * ID: playerID,
 * username: username,
 * email: email_encrypted,
 * PASS: pass_encrypted,
 * isFrozen: Boolean,
 * EVP: Number,
 * CLOUT: Number,
 * slots: entityID[]
 * }} data
 * @returns {new MAGPIE_PLAYER}
 */
function MAGPIE_PLAYER(data)
{
	this.initialize(data)
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
 * @name 
 * @desc
 * @typedef {Number} playerID
 * @typedef {String} username
 * @typedef {String} email_encrypted 
 * @typedef {String} pass_encrypted
 * @typedef {import("./entity").entityID} entityID
 * @typedef {{
 * ID: playerID,
 * username: username,
 * email: email_encrypted,
 * PASS: pass_encrypted,
 * isFrozen: Boolean,
 * EVP: Number,
 * CLOUT: Number,
 * slots: entityID[],
 * updated: Number
 * }} player_data
 * @param {player_data} data
 * @returns {new MAGPIE_PLAYER}
 */
//========================================================================
// #region - PLAYER
//========================================================================
/**
 * @name 
 * @desc 
 * @typedef {import("./database_worker").database_result} database_result
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------
/**
 * 
 * @param {player_data} data 
 * @returns {new MAGPIE_PLAYER}
 */
MAGPIE_PLAYER.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_PLAYER"
	const now = Date.now();
	this.ID = Number(data?.ID) || now;
    this.username = String(data?.username);
    this.email = String(data?.email);
    this.PASS = String(data?.PASS);
    this.isFrozen = Boolean(data?.isFrozen);
    this.EVP = Number(data?.EVP);
    this.CLOUT = Number(data?.CLOUT);
    this.slots = data?.slots || [];
	this.updated = Number(data?.updated) || now;
}
/**
 * 
 * @param {*} method 
 * @param {*} arguments
 * @returns {Promise<*>} 
 */
MAGPIE_PLAYER.__hive = async function __hive(method, arguments)
{
	//
}
/**
 * 
 * @param {*} method 
 * @param {*} arguments
 * @returns {*} 
 */
MAGPIE_PLAYER.__hiveSync = function __hiveSync(method, arguments)
{
	//
}
/**
 * 
 * @returns {Promise<database_result>}
 */
MAGPIE_PLAYER.prototype.set = async function set()
{
	return await MAGPIE_PLAYER.__hive("_set_database", "savePlayer", this)
}
/**
 * 
 * @returns {database_result}
 */
MAGPIE_PLAYER.prototype.setSync = function setSync()
{
	return MAGPIE_PLAYER.__hiveSync("_set_databaseSync", ["savePlayerSync", [this]])
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Adoption
//------------------------------------------------------------------------
MAGPIE_PLAYER.prototype.adopt = async function adopt(creatureID)
{
	//@todo adoption
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = { MAGPIE_PLAYER };
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE 
//========================================================================