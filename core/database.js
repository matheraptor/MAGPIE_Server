/**
 * @name DATABASE
 * @desc 
 * 
 */
//========================================================================
// #region - DATABASE
//========================================================================
const { response } = require("express");
const { MAGPIE } = require("./index");
const { 
	MAGPIE_LOG, 
	MAGPIE_SYSTEM,
	MAGPIE_METASTATE, 
	MAGPIE_DATE 
} = require("./system.js")
const { MAGPIE_ENTITY } = require("./entity.js");
class MAGPIE_DATABASE
{
	static {
		//
	}
}
/**
 * @name WORKER
 * @desc 
 * 
 */
//========================================================================
// #region - WORKER
//========================================================================
MAGPIE_DATABASE._pending = new Map();
MAGPIE_DATABASE.sync = require("./database_worker");
const { Worker } = require("worker_threads");
const { MAGPIE_PLAYER } = require("./player.js");
const { pl } = require("zod/locales");
MAGPIE_DATABASE.worker = new Worker("./core/database_worker.js");
MAGPIE_DATABASE.call = function call(method, ...args)
{
	const requestID = Date.now() + Math.floor(Math.random() * 10000000);
	return new Promise((resolve, reject) => {
		if(this._pending.has(requestID))
			console.error("collision!");
		MAGPIE_DATABASE._pending.set(requestID, { resolve, reject });
		MAGPIE_DATABASE.worker.postMessage({ method, args, requestID });
	})
}
MAGPIE_DATABASE.worker.on("message", (response) => {
	const { requestID, result, error } = response;
	const tools = MAGPIE_DATABASE._pending.get(requestID);
	if(!tools) return;
	const { resolve, reject } = tools;
	if(error) reject(error);
	else resolve(result);
	MAGPIE_DATABASE._pending.delete(requestID);
});
MAGPIE_DATABASE.worker.on("error", (err) => console.error("[DATABASE WORKER].ERROR: ", err));
MAGPIE_DATABASE.worker.on("exit", (code) => console.log("[DATABASE WORKER].EXITED with code: ", code));
MAGPIE_DATABASE.pingWorker = async function pingWorker()
{
	const ePrefix = "[DATABASE].pingWorker";
	MAGPIE_SYSTEM.log(ePrefix + "...", "console", true);
	try
	{
		const result = await MAGPIE_DATABASE.call("ping");;
		MAGPIE_SYSTEM.log(ePrefix + `: ${result}`, "console", true);
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + ": " + e.message, e)
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
/**
 * @name wrappers
 * @desc 
 * @typedef {import("better-sqlite3").RunResult} worker_result
 * @typedef {import("./entity.js").entityID} entityID
 * 
 */
//========================================================================
// #region - WRAPPERS
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > save
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<worker_result>} 
 */
MAGPIE_DATABASE.saveEntity = async function saveEntity(entity)
{
	const ePrefix = "[DATABASE].saveEntity: ";
	try
	{
		const payload = this.prepareEntity(entity);
		if(!payload)
			throw new Error(`unable to prepare ${entity}`);
		const result = await this.call("saveWorldRow", ["MAGPIE_ENTITY", payload]);
		if(!result)
			throw new Error(`unable to save [ENTITY-${entity.ID}`);
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity 
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveEntitySync = function saveEntitySync(entity)
{
	const ePrefix = "[DATABASE].saveEntity: ";
	try
	{
		const payload = this.prepareEntity(entity);
		if(!payload)
			throw new Error(`unable to prepare ${entity}`);
		const result = this.sync.saveWorldRow("MAGPIE_ENTITY", payload);
		if(!result)
			throw new Error(`unable to save [ENTITY-${entity.ID}`);
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * @typedef {{
 * 	ID: Number,
 * 	type: Enumerator<Number>,
 * 	data: MAGPIE_ENTITY,
 * 	created: epoch_real,
 * 	updated: epoch_real,
 * 	saved: epoch_real
 * }} entity_payload
 * @param {MAGPIE_ENTITY} entity
 * @returns {entity_payload} 
 */
MAGPIE_DATABASE.prepareEntity = function prepareEntity(entity)
{
	const ePrefix = "[DATABASE].prepareEntity: ";
	try
	{
		if(!(entity instanceof MAGPIE_ENTITY))
			throw new Error(`${entity} is invalid MAGPIE_ENTITY`)
		const now = this.timestamp();
		entity.saved = now;
		const payload = {
			ID: entity.ID,
			type: entity.type,
			data: entity,
			created: entity.created,
			updated: entity.updated,
			saved: now
		}
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_METASTATE} metastate
 * @returns {worker_result} 
 */
MAGPIE_DATABASE.saveMetastate = function saveMetastate(metastate)
{
	const ePrefix = "[DATABASE].saveMetastate: ";
	try
	{
		if(!(metastate instanceof MAGPIE_METASTATE))
			throw new Error(`${metastate} is invalid MAGPIE_METASTATE`);
		metastate.meta.updated = this.timestamp();
		const save = this.sync.saveWorldRow("MAGPIE_METASTATE", {
			key: "MAGPIE_METASTATE",
			data: metastate
		})
		return save
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_PLAYER} player
 * @returns {Promise<worker_result>} 
 */
MAGPIE_DATABASE.savePlayer = async function savePlayer(player)
{
	const ePrefix = "[DATABASE].savePlayer: ";
	try
	{
		const payload = this.preparePlayer(player);
		if(!payload) 
			throw new Error(`${payload} is invalid player payload`);
		const result = await this.call("saveServerRow", ["MAGPIE_PLAYER", payload]);
		if(!result)
			throw new Error(`unable to save [PLAYER-${player.ID}`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_PLAYER} player
 * @returns {worker_result} 
 */
MAGPIE_DATABASE.savePlayerSync = function savePlayerSync(player)
{
	const ePrefix = "[DATABASE].savePlayer: ";
	try
	{
		const payload = this.preparePlayer(player);
		if(!payload) 
			throw new Error(`${payload} is invalid player payload`);
		const result = this.sync.saveServerRow("MAGPIE_PLAYER", payload);
		if(!result)
			throw new Error(`unable to save [PLAYER-${player.ID}`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * @typedef {String} email
 * @typedef {String} username 
 * @typedef {String} encrypted_password
 * @typedef {Number} epoch_real from Date.now()
 * @typedef {Number} epoch_game from metastate.date.timestamp()
 * @typedef {Number} binary_bool 0 for false, 1 for true
 * @typedef {{
 * 	ID: Number,
 *  username: username,
 * 	email: email,
 * 	PASS: encrypted_password,
 * 	created: epoch_real,
 * 	updated: epoch_real,
 * 	saved: epoch_real,
 * 	isFrozen: binary_bool
 * }} player_payload
 * @param {MAGPIE_PLAYER} player
 * @returns {player_payload} 
 */
MAGPIE_DATABASE.preparePlayer = function preparePlayer(player)
{
	const ePrefix = "[DATABASE].preparePlayer: ";
	try
	{
		if(!(player instanceof MAGPIE_PLAYER))
			throw new Error(`${player} is invalid MAGPIE_PLAYER`);
		const now = this.timestamp();
		player.saved = now;
		const payload = {
			ID: player.ID,
			username: player.username,
			email: player.email,
			PASS: player.PASS,
			created: player.created,
			updated: player.updated,
			saved: now,
			isFrozen: player.isFrozen ? 1 : 0
		}
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name load
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > load
//------------------------------------------------------------------------
/**
 * 
 * @param {entityID} entityID 
 * @returns {Promise<MAGPIE_ENTITY>}
 */
MAGPIE_DATABASE.loadEntity = async function loadEntity(entityID)
{
	const ePrefix = `[DATABASE].loadEntity: `;
	try
	{
		const entity = await this.call("loadWorldRow", ["MAGPIE_ENTITY", {ID: entityID}]);
		if(!(entity instanceof MAGPIE_ENTITY))
			throw new Error(`${entityID} not found`)
		return entity
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
/**
 * 
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY} 
 */
MAGPIE_DATABASE.loadEntitySync = function loadEntitySync(entityID)
{
	const ePrefix = `[DATABASE].loadEntity: `;
	try
	{
		const entity = this.sync.loadWorldRow("MAGPIE_ENTITY", {ID: entityID});
		if(!(entity instanceof MAGPIE_ENTITY))
			throw new Error(`${entityID} not found`)
		return entity
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
/**
 * 
 * @returns {MAGPIE_METASTATE} 
 *  
 */
MAGPIE_DATABASE.loadMetastate = function loadMetastate()
{
	const ePrefix = "[DATABASE].loadMetastate: ";
	try
	{
		const metastate = this.sync.loadWorldRow("MAGPIE_METASTATE", {});
		if(!(metastate instanceof MAGPIE_METASTATE))
			throw new Error(`${metastate} is invalid MAGPIE_METASTATE`);
		return metastate
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {Number} playerID 
 * @returns {Promise<MAGPIE_PLAYER>}
 */
MAGPIE_DATABASE.loadPlayer = async function loadPlayer(playerID)
{
	const ePrefix = "[DATABASE].loadPlayer: ";
	try
	{
		const player = await this.call("loadServerRow", ["MAGPIE_PLAYER", {ID: playerID}]);
		if(!(player instanceof MAGPIE_PLAYER))
			throw new Error(`${playerID} not found`);
		return player
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {Number} playerID 
 * @returns {MAGPIE_PLAYER}
 */
MAGPIE_DATABASE.loadPlayerSync = function loadPlayer(playerID)
{
	const ePrefix = "[DATABASE].loadPlayer: ";
	try
	{
		const player = this.sync.loadServerRow("MAGPIE_PLAYER", {ID: playerID});
		if(!(player instanceof MAGPIE_PLAYER))
			throw new Error(`${playerID} not found`);
		return player
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * @typedef {String} password
 * @param {email} email 
 * @param {password} pass 
 * @returns {Promise<Boolean>}
 */
MAGPIE_DATABASE.loginPlayer = async function loginPlayer(email, pass)
{
	if(!this.isValidEmail(email) || !this.isValidPass(pass)) return
	const player = await this.call("loadServerRow", ["MAGPIE_PLAYER", {email: email}]);
	if(!(player instanceof MAGPIE_PLAYER)) return false
	if(!player.PASS === pass) return false;
	return player
}
/**
 * 
 * @param {email} email 
 * @returns {Boolean}
 */
MAGPIE_DATABASE.isValidEmail = function isValidEmail(email)
{
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  	return regex.test(email);
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
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
/**
 * @typedef {import("../SERVER.js").epoch_real} epoch_real
 * @returns {epoch_real}
 */
MAGPIE_DATABASE.timestamp = function timestamp()
{
	return Date.now()
}
// #endregion
//------------------------------------------------------------------------

module.exports = MAGPIE_DATABASE;
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================