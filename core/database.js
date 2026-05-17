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
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
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
const { 
	MAGPIE_EXP, 
	MAGPIE_KEY, 
	MAGPIE_SYMBOL,
	MAGPIE_CONTEXT,
	MAGPIE_TICKET 
} = require("./component.js");
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
// #region > Metastate
//------------------------------------------------------------------------
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
			throw new Error(`no metastate in database`);
		return metastate
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
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Player
//------------------------------------------------------------------------
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
			throw new Error(`[PLAYER-${playerID}] not found`);
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
			throw new Error(`[PLAYER-${playerID}] not found`);
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
		const result = await this.call("saveServerRow", "MAGPIE_PLAYER", payload);
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
 * 	updated: epoch_real,
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
			isFrozen: player.isFrozen ? 1 : 0,
			data: player
		}
		return payload
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Exp
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {MAGPIE_KEY[]} 
 */
MAGPIE_DATABASE.getExpKeys = function getExpKeys(exp)
{
	const ePrefix = "[DATABASE].getExpKeys: ";
	try
	{
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`${exp} is invalid MAGPIE_EXP`)
		const keys = exp.keys;
		if(!Array.isArray(keys) || keys.length < 1) return [];
		const db = MAGPIE_DATABASE.sync.world;
		const placeholders = keys.map(() => "?").join(", ")
		const sql = `SELECT * FROM MAGPIE_KEY WHERE ID IN (${placeholders})`;
		const rows = db.prepare(sql).all(keys);
		const rowMap = new Map(rows.map(row => [row.ID, row]))
		return keys.map(id => rowMap.get(id)).filter(Boolean)
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return []
	}
}
/**
 * 
 * @param {Number} expID 
 * @returns {Promise<MAGPIE_EXP>}
 */
MAGPIE_DATABASE.loadExp = async function loadExp(expID)
{
	const ePrefix = "[DATABASE].loadExp: ";
	try
	{
		const exp = await this.call("loadWorldRow", ["MAGPIE_EXP", {ID: expID}])
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`[EXP-${expID}] is not in database`);
		return exp
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {Number} expID 
 * @returns {MAGPIE_EXP}
 */
MAGPIE_DATABASE.loadExpSync = function loadExpSync(expID)
{
	const ePrefix = "[DATABASE].loadExp: ";
	try
	{
		const exp = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_EXP", {ID: expID})
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`[EXP-${expID}] is not in database`);
		return exp
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * @typedef {{
 * ID: epoch_real,
 * subjectID: Number,
 * targetID: Number,
 * data: MAGPIE_EXP
 * }} exp_payload
 * @param {MAGPIE_EXP} exp 
 * @returns {exp_payload}
 */
MAGPIE_DATABASE.prepareExp = function prepareExp(exp)
{
	if(!(exp instanceof MAGPIE_EXP))
		throw new Error(`${exp} is invalid EXP`)
	const payload = {
		ID: exp.ID,
		subjectID: exp.subjectID || null,
		targetID: exp.targetID || null,
		data: exp
	}
	return payload
} 
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {Promise<worker_result>} 
 */
MAGPIE_DATABASE.saveExp = async function saveExp(exp)
{
	const ePrefix = "[DATABASE].saveExp: ";
	try
	{
		const payload = this.prepareExp(exp);
		const result = await this.call("saveWorldRow", "MAGPIE_EXP", payload)
		if(!result)
			throw new Error(`unable to save [EXP-${exp.ID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {worker_result} 
 */
MAGPIE_DATABASE.saveExpSync = function saveExpSync(exp)
{
	const ePrefix = "[DATABASE].saveExp: ";
	try
	{
		const payload = this.prepareExp(exp);
		// this.saveExpRelation(exp);
		const result = this.sync.saveWorldRow("MAGPIE_EXP", payload);
		if(!result)
			throw new Error(`unable to save [EXP-${exp.ID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveExpRelation = function saveExpRelation(exp)
{
	let payloads = [];
	exp.keys.forEach(key => {
		const payload = {
			expID: exp.ID,
			keyID: key
		}
		payloads.push(payload)
	})
	const result = this.sync.makeTransaction(this.sync.world, () => {
		for(const payload of payloads)
		{
			const { values, columns } = this.sync.rowSetter(payload);
			this.sync.setRow("EXP_KEYS", values, columns, this.sync.world);
		}
		return true
	})
	if(!result)
		throw new Error(`unable to save relations for [EXP-${exp.ID}]`)
	return result
}
/**
 * 
 * @param {Number} expID
 * @returns {Promise<worker_result>} 
 */
MAGPIE_DATABASE.deleteExp = async function deleteExp(expID)
{
	const ePrefix = "[DATABASE].deleteExp: ";
	try
	{
		const result = await this.call("deleteRow", "MAGPIE_EXP", {ID: expID})
		if(!result)
			throw new Error(`unable to delete [EXP-${expID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {Number} expID 
 * @returns {worker_result}
 */
MAGPIE_DATABASE.deleteExpSync = function deleteExpSync(expID)
{
	const ePrefix = "[DATABASE].deleteExp: ";
	try
	{
		MAGPIE_DATABASE.deleteExpKeysSync(expID);
		const result = MAGPIE_DATABASE.sync.deleteWorldRow("MAGPIE_EXP", {ID: expID});
		if(!result)
			throw new Error(`unable to delete [EXP-${expID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {Number} expID
 * @returns {worker_result} 
 */
MAGPIE_DATABASE.deleteExpKeysSync = function deleteExpKeysSync(expID)
{
	const ePrefix = "[DATABASE].deleteExpKeys: ";
	try
	{
		const result = this.sync.world.prepare(
			"DELETE FROM EXP_KEYS WHERE expID = ?"
		).run(expID)
		if(!result)
			throw new Error(`unable to delete [EXP-${expID}]`)
		const message = `deleted ${result.changes} key relations for [EXP-${expID}]`;
		MAGPIE_SYSTEM.log(ePrefix + message, "console", true)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Key
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} keyID 
 * @returns {Promise<MAGPIE_KEY>} 
 */
MAGPIE_DATABASE.loadKey = async function loadKey(keyID)
{
	const ePrefix = "[DATABASE].loadKey: ";
	try
	{
		const key = await this.call("loadWorldRow", ["MAGPIE_KEY", {ID: keyID}]);
		if(!(key instanceof MAGPIE_KEY))
			throw new Error(`[KEY-${keyID}] not in database`);
		return key
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {Number} keyID
 * @returns {MAGPIE_KEY} 
 */
MAGPIE_DATABASE.loadKeySync = function loadKeySync(keyID)
{
	const ePrefix = "[DATABASE].loadKeySync: ";
	try
	{
		const key = MAGPIE_DATABASE.sync.getRow("MAGPIE_KEY", {ID: keyID}, MAGPIE_DATABASE.sync.world)[0];
		if(!key?.ID)
			throw new Error(`[KEY-${keyID}] not in database`);
		Object.setPrototypeOf(key, MAGPIE_KEY.prototype);
		return key
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @typedef {{
 * ID: epoch_real,
 * type: Enumerator<Number>,
 * label: String,
 * originID: Number,
 * compoundID: Number,
 * symbolID: Number
 * }} key_payload
 * @param {MAGPIE_KEY} key 
 * @returns {key_payload}
 */
MAGPIE_DATABASE.prepareKey = function prepareKey(key)
{
	return {
		ID: key.ID,
		type: key.type,
		label: key.label,
		originID: key.originID || null,
		compoundID: key.compoundID || null,
		symbolID: key.symbolID || null
	}
}
/**
 * 
 * @param {MAGPIE_KEY} key
 * @returns {Promise<worker_result>} 
 */
MAGPIE_DATABASE.saveKey = async function saveKey(key)
{
	const ePrefix = "[DATABASE].saveKey: ";
	try
	{
		const payload = this.prepareKey(key);
		const result = await this.call("saveWorldRow", "MAGPIE_KEY", payload)
		if(!result)
			throw new Error(`unable to save [KEY-${key.ID}]`)
		if(key.originID)
			await this.call("saveWorldRow", ["key_legacies", {
				keyID: key.originID,
				legacyID: key.ID
			}])
		if(key.compoundID)
			await this.call("saveWorldRow", ["key_components", {
				keyID: key.compoundID,
				componentID: key.ID
			}])
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.messag, e)
	}
}
/**
 * 
 * @param {MAGPIE_KEY} key
 * @returns {worker_result} 
 */
MAGPIE_DATABASE.saveKeySync = function saveKeySync(key)
{
	const ePrefix = "[DATABASE].saveKey: ";
	try
	{
		const payload = this.prepareKey(key);
		const result = this.sync.saveWorldRow("MAGPIE_KEY", payload);
		if(!result)
			throw new Error(`unable to save [KEY-${key.ID}]`)
		if(key.originID)
			this.sync.saveWorldRow("key_legacies", {
				keyID: key.originID,
				legacyID: key.ID
			})
		if(key.compoundID)
			this.sync.saveWorldRow("key_components", {
				keyID: key.compoundID,
				componentID: key.ID
			})
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.messag, e)
	}
}
/**
 * 
 * @param {Number} expID
 * @returns {worker_result} 
 */
MAGPIE_DATABASE.deleteKeyLegacy = function deleteExpSync(expID)
{
	const ePrefix = "[DATABASE].deleteEXP: ";
	try
	{
		const result = this.sync.world.prepare(
			"DELETE FROM EXP_KEYS WHERE expID = ?"
		).run(expID)
		if(!result)
			throw new Error(`unable to delete [EXP-${expID}]`)
		const message = `deleted ${result.changes} key relations for [EXP-${expID}]`;
		MAGPIE_SYSTEM.log(ePrefix + message, "console", true)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > delete
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Entity
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
		const data = await MAGPIE_DATABASE.call("loadWorldRow", "MAGPIE_ENTITY", {ID: entityID});
		if(!data?.ID)
			throw new Error(`[ENTITY-${entityID}] not found`)
		const entity = Object.setPrototypeOf(data, MAGPIE_ENTITY.prototype);
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
		const entity = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_ENTITY", {ID: entityID});
		return entity
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
	}
}
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
		const payload = MAGPIE_DATABASE.prepareEntity(entity);
		if(!payload)
			throw new Error(`unable to prepare ${entity}`);
		const result = await this.call("saveWorldRow", "MAGPIE_ENTITY", payload);
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
		const payload = MAGPIE_DATABASE.prepareEntity(entity);
		if(!payload)
			throw new Error(`unable to prepare ${entity}`);
		const result = MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_ENTITY", payload);
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
 * 
 * @param {MAGPIE_ENTITY[]} entityArray
 * @returns {Promise<Boolean>} 
 */
MAGPIE_DATABASE.transactionSaveEntities = async function saveEntities(entityArray)
{
	const ePrefix = "[DATABASE].saveEntities: ";
	try
	{
		const payloads = entityArray.map(entity => MAGPIE_DATABASE.prepareEntity(entity));
		const result = await this.call("saveEntities", payloads)
		return !!result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return false
	}
}
/**
 * @typedef {{
 * 	ID: Number,
 * 	type: Enumerator<Number>,
 * 	data: MAGPIE_ENTITY,
 * 	updated: epoch_real,
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
			throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
		const K = MAGPIE.KEY.STATS;
		const compoundID = entity.STATS[K.COMPOUND];
		const hostID = entity.STATS[K.HOST];
		const payload = {
			ID: entity.ID,
			type: entity.type,
			name: entity.name,
			updated: entity.updated,
			compoundID: compoundID || null,
			hostID: hostID || null,
			data: entity
		}
		return payload
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Symbol
//------------------------------------------------------------------------

/**
 * 
 * @param {MAGPIE_SYMBOL} symbol 
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveSymbolSync = function saveSymbolSync(symbol)
{
	const ePrefix = "[DATABASE].saveSymbolSync: ";
	try
	{
		symbol._get_requirementIDs().forEach(ID => {
			if(ID)
				MAGPIE_DATABASE.sync.saveWorldRow("symbol_recipes", {
					requirementID: ID,
					recipeID: symbol.ID
				})
		})
		symbol._get_compoundIDs().forEach(ID => {
			if(ID)
				MAGPIE_DATABASE.sync.saveWorldRow("symbol_components", {
					compoundID: ID,
					componentID: symbol.ID
				})
		})
		const payload = MAGPIE_DATABASE.prepareSymbol(symbol);
		return MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_SYMBOL", payload);
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {symbolID} requirementID 
 * @param {symbolID} recipeID 
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveSymbolRecipe = function saveSymbolRecipe(requirementID, recipeID)
{
	return MAGPIE_DATABASE.sync.saveWorldRow("symbol_recipes", {
		requirementID: requirementID,
		recipeID: recipeID
	})
}
/**
 * 
 * @param {symbolID} compoundID 
 * @param {symbolID} componentID 
 * @returns {worker_result}
 */
MAGPIE_DATABASE.saveSymbolComponents = function saveSymbolComponents(compoundID, componentID)
{
	return MAGPIE_DATABASE.sync.saveWorldRow("symbol_components", {
		compoundID: compoundID,
		componentID: componentID
	})
}
MAGPIE_DATABASE.deleteSymbolSync = function deleteSymbolSync(symbolID)
{
	const symbol = MAGPIE_DATABASE.loadSymbolSync(symbolID);
	symbol.requirements
}
/**
 * @typedef {import("./component.js").symbolID} symbolID
 * @typedef {import("./component.js").symbol_type} symbol_type
 * 
 * @typedef {{
 * ID: symbolID,
 * type: symbol_type,
 * requirementID: symbolID,
 * compoundID: symbolID,
 * data: MAGPIE_SYMBOL
 * }} symbol_payload
 * @param {MAGPIE_SYMBOL} symbol 
 * @returns {symbol_payload}
 */
MAGPIE_DATABASE.prepareSymbol = function prepareSymbol(symbol)
{
	/** @type {symbol_payload} */
	const payload = {
		ID: symbol.ID,
		type: symbol.type,
		name: symbol.name,
		data: symbol
	}
	return payload
}
/**
 * 
 * @param {symbolID} symbolID 
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_DATABASE.loadSymbolSync = function loadSymbolSync(symbolID)
{
	const ePrefix = "[DATABASE].loadSymbol: ";
	try
	{
		const symbol = MAGPIE_DATABASE.sync
			.loadWorldRow("MAGPIE_SYMBOL", {ID: symbolID})
		if(!symbol)
			throw new Error(`error loading [SYMBOL-${symbolID}]`)
		return symbol
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {String} tableName 
 * @param {String} name 
 * @returns {*}
 */
MAGPIE_DATABASE.loadWorldRowByName = function loadWorldRowByName(tableName, name)
{
	const cleanName = name.trim();
	if(!cleanName) return [];
	const ftsQuery = cleanName
		.split(/\s+/)
		.map(word => `"${word.replace(/"/g, '""')}"*`)
		.join(" ");
	const statement = MAGPIE_DATABASE.sync.world
		.prepare(`SELECT m.* FROM ${tableName} m
			JOIN ${tableName}_fts f ON m.ID = f.id
			WHERE f.name MATCH ?`);
	return MAGPIE_DATABASE.sync
		.resultsLoader(statement.all(ftsQuery));
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * @typedef {{
 * ID: Number,
 * type: Number,
 * updated: Number,
 * data: MAGPIE_CONTEXT
 * }} context_payload
 */
//------------------------------------------------------------------------
// #region > Context
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_CONTEXT} context 
 * @returns {context_payload}
 */
MAGPIE_DATABASE.prepareContext = function prepareContext(context)
{
	/** @type {context_payload} */
	const payload = {
		ID: context.ID,
		type: context.type,
		updated: context.updated,
		data: context
	}
	return payload
}
/**
 * 
 * @param {Number} contextID
 * @returns {MAGPIE_CONTEXT} 
 */
MAGPIE_DATABASE.loadContextSync = function loadContextSync(contextID)
{
	const ePrefix = "[DATABASE].loadContext: ";
	try
	{
		const context = MAGPIE_DATABASE.sync.loadWorldRow("MAGPIE_CONTEXT", {ID: contextID})
		if(!(context instanceof MAGPIE_CONTEXT))
			throw new Error(`unable to find [CONTEXT-${contextID}]`)
		return context
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_CONTEXT} context
 * @returns {worker_result} 
 */
MAGPIE_DATABASE.saveContextSync = function saveContextSync(context)
{
	const ePrefix = "[DATABASE].saveContext: ";
	try
	{
		if(!(context instanceof MAGPIE_CONTEXT))
			throw new Error(`${context} is invalid MAGPIE_CONTEXT`)
		const payload = MAGPIE_DATABASE.prepareContext(context);
		const result = MAGPIE_DATABASE.sync.saveWorldRow("MAGPIE_CONTEXT", payload);
		if(!result)
			throw new Error(`unable to save [CONTEXT-${context.ID}`)
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Query
//------------------------------------------------------------------------
/**
 * 
 * @param {entityID} parentID 
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_DATABASE.loadChildrenSync = function loadChildrenSync(parentID)
{
	const ePrefix = "[DATABASE].loadChildren: ";
	try
	{
		const result = this.sync.getWorldRelatedRows(
			parentID, 
			"parentID", 
			"childID", 
			"entity_children", 
			"MAGPIE_ENTITY"
		)
		if(!result) 
			throw new Error(`unable to find children for [ENTITY-${parentID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} parentID 
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_DATABASE.loadChildren = async function loadChildren(parentID)
{
	const ePrefix = "[DATABASE].loadChildren: ";
	try
	{
		const result = await this.call("getWorldRelatedRows", [
			parentID, 
			"parentID", 
			"childID", 
			"entity_children", 
			"MAGPIE_ENTITY"
		])
		if(!result) 
			throw new Error(`unable to find children for [ENTITY-${parentID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} compoundID 
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_DATABASE.loadComponents = async function loadComponents(compoundID)
{
	const ePrefix = "[DATABASE].loadComponents: ";
	try
	{
		const result = await this.call("getWorldRelatedRows", [
			compoundID, 
			"compoundID", 
			"componentID", 
			"entity_components", 
			"MAGPIE_ENTITY"
		])
		if(!result) 
			throw new Error(`unable to find components for [ENTITY-${compoundID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} hostID 
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_DATABASE.loadEquips = async function loadEquips(hostID)
{
	const ePrefix = "[DATABASE].loadEquips: ";
	try
	{
		const result = await this.call("getWorldRelatedRows", [
			hostID, 
			"hostID", 
			"equipID", 
			"entity_equips", 
			"MAGPIE_ENTITY"
		])
		if(!result) 
			throw new Error(`unable to find equips for [ENTITY-${hostID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} compoundID 
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_DATABASE.loadComponentsSync = function loadComponentsSync(compoundID)
{
	const ePrefix = "[DATABASE].loadComponents: ";
	try
	{
		const result = this.sync.getWorldRelatedRows(
			compoundID, 
			"compoundID", 
			"componentID", 
			"entity_components", 
			"MAGPIE_ENTITY"
		)
		if(!result) 
			throw new Error(`unable to find components for [ENTITY-${compoundID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} hostID 
 * @returns {MAGPIE_ENTITY[]}
 */
MAGPIE_DATABASE.loadEquipsSync = function loadEquipsSync(hostID)
{
	const ePrefix = "[DATABASE].loadEquips: ";
	try
	{
		const result = this.sync.getWorldRelatedRows(
			hostID, 
			"hostID", 
			"equipID", 
			"entity_equips", 
			"MAGPIE_ENTITY"
		)
		if(!result) 
			throw new Error(`unable to find equips for [ENTITY-${hostID}]`)
		return result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
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
//========================================================================
// #region - SETUP
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Symbol
//------------------------------------------------------------------------
/**
 * @todo template-ify this 
 * Ensures the prototype tables, FTS5 indexes, and self-maintaining triggers
 * exist and are correctly configured on server boot.
 * @param {Database} db - The active better-sqlite3 database instance (MAGPIE_DATABASE.sync.world)
 */
MAGPIE_DATABASE.initializeTableSchema = function initializeTableSchema(tableName, tableSchema, db) 
{
    // Wrap the entire boot setup in a transaction for maximum speed and safety
	// const columnDefs = Object.entries(tableSchema).map(([name, type]) => {
	// 	return `${name.includes("fk") ? "" : name} ${type}`
	// })
	// const noRowID = schema["PRIMARY KEY"] ? " WITHOUT ROWID " : "";

	// const schema = `${columnDefs.join(", ")}`
	db.transaction(() => {
        // 1. Ensure the core prototype table exists
        
		db.exec(`
            CREATE TABLE IF NOT EXISTS ${tableName} (
                ID INTEGER PRIMARY KEY,
                type INTEGER,
                requirementID INTEGER,
                compoundID INTEGER,
                data TEXT,
                name TEXT
            );
        `);

        // 2. Ensure a standard index exists on the name column for standard lookups
        db.exec(`
            CREATE INDEX IF NOT EXISTS idx_magpie_symbol_name 
            ON MAGPIE_SYMBOL(name);
        `);

        // 3. Create the permanent FTS5 search index table
        db.exec(`
            CREATE VIRTUAL TABLE IF NOT EXISTS MAGPIE_SYMBOL_fts 
            USING fts5(id UNINDEXED, name, tokenize="porter");
        `);

        // 4. TRIGGER: Automated Sync on Insertion
        db.exec(`
            CREATE TRIGGER IF NOT EXISTS ts_symbol_insert 
            AFTER INSERT ON MAGPIE_SYMBOL
            BEGIN
                INSERT INTO MAGPIE_SYMBOL_fts(id, name) VALUES (new.ID, new.name);
            END;
        `);

        // 5. TRIGGER: Automated Sync on Updates
        db.exec(`
            CREATE TRIGGER IF NOT EXISTS ts_symbol_update 
            AFTER UPDATE OF name ON MAGPIE_SYMBOL
            BEGIN
                UPDATE MAGPIE_SYMBOL_fts SET name = new.name WHERE id = old.ID;
            END;
        `);

        // 6. TRIGGER: Automated Sync on Deletions
        db.exec(`
            CREATE TRIGGER IF NOT EXISTS ts_symbol_delete 
            AFTER DELETE ON MAGPIE_SYMBOL
            BEGIN
                DELETE FROM MAGPIE_SYMBOL_fts WHERE id = old.ID;
            END;
        `);

        // 7. Safety Backfill: Catch up the FTS index if rows were inserted offline
        db.exec(`
            INSERT INTO MAGPIE_SYMBOL_fts(id, name) 
            SELECT ID, name FROM MAGPIE_SYMBOL 
            WHERE ID NOT IN (SELECT id FROM MAGPIE_SYMBOL_fts) 
              AND name IS NOT NULL;
        `);
    })(); // Execute the transaction instantly
    
    console.log("MAGPIE_SYMBOL table, FTS5 index, and sync triggers verified successfully.");
};

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
module.exports = MAGPIE_DATABASE;
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================