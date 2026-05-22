/**
 * 
 * @namespace MAGPIE_Server
 * @author Matheraptor
 * @version 0.22.26
 * @desc server frontend
 * {@link MAGPIE}
 */
class MAGPIE_SERVER
{
	//
}
/**
 * @name IMPORT
 * @desc dependencies
 * 
 */
//========================================================================
// #region - IMPORT
//========================================================================
/**
 * @name internal
 * @desc MAGPIE dependencies
 * 
 */
//------------------------------------------------------------------------
// #region > internal
//------------------------------------------------------------------------
const { MAGPIE } = require("./core/index");
MAGPIE_SERVER.meta = MAGPIE.meta;
MAGPIE_SERVER.meta.name += " server";
const SYSTEM = require("./core/system");
const { 
	MAGPIE_SYSTEM,
	MAGPIE_LOG,
	MAGPIE_IO,
	MAGPIE_HIVE,
	MAGPIE_RUNTIME,
	MAGPIE_METASTATE,
	MAGPIE_DATE
} = SYSTEM;

const { MAGPIE_PHYSICS } = require("./core/physics");
const { 
	MAGPIE_COMPONENT, 
	MAGPIE_EXP, 
	MAGPIE_KEY,
	MAGPIE_EMOTE,
	MAGPIE_STATE,
	MAGPIE_SYMBOL,
	MAGPIE_CONTEXT,
	MAGPIE_TICKET 
} = require("./core/component");
const { MAGPIE_ENTITY } = require("./core/entity");
const { MAGPIE_PLAYER } = require("./core/player");
const MAGPIE_DATABASE = require("./core/database");
MAGPIE_SERVER.registry = {
	MAGPIE,
	MAGPIE_SYSTEM,
	MAGPIE_LOG,
	MAGPIE_IO,
	MAGPIE_RUNTIME,
	MAGPIE_HIVE,
	MAGPIE_METASTATE,
	MAGPIE_DATE,
	MAGPIE_PHYSICS,
	MAGPIE_COMPONENT,
	MAGPIE_EXP,
	MAGPIE_KEY,
	MAGPIE_EMOTE,
	MAGPIE_ENTITY,
	MAGPIE_PLAYER,
	MAGPIE_DATABASE,
	MAGPIE_SYMBOL,
	MAGPIE_CONTEXT,
	MAGPIE_TICKET
};
MAGPIE_SERVER.meta = {}
MAGPIE_SERVER.perf = {};
MAGPIE_SERVER.perf.start = performance.now();
MAGPIE_SERVER.perf.end = NaN;
MAGPIE_SERVER.config = require("./core/config");
const STATE = require("./data/states");
// #endregion
//------------------------------------------------------------------------
/**
 * @name Input/Output
 * @desc FS I/O external dependencies from node itself
 * 
 */
//------------------------------------------------------------------------
// #region > I/O
//------------------------------------------------------------------------
const fs = require("fs");
const path = require("path");
const { timeEnd } = require("node:console");
const vm = require("node:vm");
// #endregion
//------------------------------------------------------------------------
/**
 * @name server
 * @desc dependencies for running the server
 * 
 */
//------------------------------------------------------------------------
// #region > server
//------------------------------------------------------------------------
//
const express = require("express");
const ratelimit = require("express-rate-limit");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
// #endregion
//------------------------------------------------------------------------
/**
 * @name security
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > security
//------------------------------------------------------------------------
MAGPIE_SERVER.JWT = require("jsonwebtoken");

// #endregion
//------------------------------------------------------------------------
/**
 * @name utility
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > utility
//------------------------------------------------------------------------
const cliSpinner = require("cli-spinner");
const cliProgress = require("cli-progress");
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link MAGPIE_SERVER.meta}
 *
 */
//========================================================================
// #endregion - IMPORT
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - KEY
//========================================================================
MAGPIE.KEY.STATE.TYPE = STATE.TYPE;
MAGPIE.KEY.STATE.INDEX = STATE.INDEX;
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name MAGPIE_SERVER
 * @desc 
 * 
 */
//========================================================================
// #region - SERVER
//========================================================================
MAGPIE_SERVER.SYS = {};
/**
 * @name I/O
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > I/O
//------------------------------------------------------------------------
MAGPIE_SERVER.IO = MAGPIE_IO;
// #endregion
//------------------------------------------------------------------------
/**
 * @name System
 * @desc 
 * @typedef {import("./core/index").vector3} vector3
 * @typedef {import("./core/entity").bivector} bivector
 * @typedef {import("./core/physics").rotor} rotor
 * @typedef {import("./core/entity").entity_stats} entity_stats
 * @typedef {import("./core/physics").POVART} POVART
 * @typedef {import("./core/physics").coords} coords
 * @typedef {import("./core/index").distance} distance
 */
//------------------------------------------------------------------------
// #region > System
//------------------------------------------------------------------------
MAGPIE_SERVER.system = {};
MAGPIE_SERVER.SYS = MAGPIE_SYSTEM;
MAGPIE_SERVER.IO = MAGPIE_IO;
MAGPIE_SERVER.SYS._log = MAGPIE_SYSTEM.log;
MAGPIE_SYSTEM.log = function log(message, prefix, logToConsole)
{
	MAGPIE_SERVER.SYS._log.call(this, message, prefix, logToConsole);
	r.displayPrompt(true);
}
MAGPIE_SERVER.SYS._error = MAGPIE_SYSTEM.error;
/**
 * 
 * @param {String} message 
 * @param {Error} error 
 */
MAGPIE_SYSTEM.error = function error(message, error)
{
	MAGPIE_SERVER.SYS._error.call(this, message, error);
	r.displayPrompt(true);
}
MAGPIE_SYSTEM._logging_debug = function server_debug(message)
{
	if(r.cursor > 0)
		return
	console.clear();
	console.error(new Error(message + "\n"));
	r.displayPrompt();
	// lastMessage = message;
}

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Handlers
//------------------------------------------------------------------------
MAGPIE_SERVER.SYS._handlersPath = path.join(__dirname, "handlers");
MAGPIE_SERVER.HANDLER = fs.readdirSync(MAGPIE_SERVER.SYS._handlersPath)
	.map(file => require(path.join(MAGPIE_SERVER.SYS._handlersPath, file)))
// #endregion
//------------------------------------------------------------------------
/**
 * @name runtime
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Runtime
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_SYSTEM} guest 
 * @param {Number} layerID 
 * @param {Number} switchID
 * @param {Number} layer_frame
 * 
 */
MAGPIE_RUNTIME.prototype.guestRefresh = function guestRefresh(guest, layerID, switchID, layer_frame)
{
	/** @type {MAGPIE_SYSTEM} */
	const system = r.context[guest];
	if(!system || isNaN(layerID)) return
	const pass = system.refresh(layerID, switchID, layer_frame)
	if(!pass) this.kick(guest, layerID);
}
MAGPIE_SERVER.SYS._runtime_guestRefresh = MAGPIE_RUNTIME.__guestRefresh;
MAGPIE_SERVER.SYS._runtime_loadMetastate = MAGPIE_RUNTIME._loadMetastate;
MAGPIE_RUNTIME.prototype.loadMetastate = function loadMetastate()
{
	const ePrefix = "[RUNTIME].loadMetastate: ";
	let state = null;
	try
	{
		state = MAGPIE_DATABASE.loadMetastate();
		if(!(state instanceof MAGPIE_METASTATE)) 
			throw new Error(`${state} is invalid MAGPIE_METASTATE`)
		if(!(state.date instanceof MAGPIE_DATE))
			state.date = new MAGPIE_DATE()
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		state = new MAGPIE_METASTATE();
	}
	finally
	{
		this.host("METASTATE", 0);
		r.context["METASTATE"] = state;
		const message = `[metastate-${state.meta.updated}] loaded | `
			+ `[metadate-${state.date.printDate()}Z]`
		MAGPIE_SERVER.log(ePrefix + message)
	}
}

/**
 * 
 * @returns 
 */
MAGPIE_RUNTIME.prototype.saveMetastate = function saveMetastate()
{
	const state = r.context.METASTATE;
	if(!state) return
	return MAGPIE_DATABASE.saveMetastate(state);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name Hive
 * @desc 
 * @typedef {MAGPIE_ENTITY[]} hive_buffer
 */
//------------------------------------------------------------------------
// #region > Hive
//------------------------------------------------------------------------
MAGPIE_HIVE.__server = {};
/**
 * @name 
 * @typedef {import("./core/index").duration} duration 
 * 
 */
//------------------------------------------------------------------------
// #region refresh
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} layerID
 * @param {Number} runtimeID
 * @param {Number} layer_frame
 * 
 * @returns {Promise<Boolean>} 
 */
MAGPIE_HIVE.refresh = function refresh(runtimeID, switchID, layer_frame)
{
	const ePrefix = "[HIVE].refresh: ";
	try
	{
		MAGPIE_SYSTEM.refresh.call(this)
		const layer = MAGPIE.KEY.RUNTIME.LAYER;
		const Base = 0;
		const Game = 1;
		const TICK = 2;
		const Super = 3;
		const Mega = 4;
		const Ultra = 5;
		const layerBase = layer.get(Base);
		const layerGame = layer.get(Game);
		const layerTICK = layer.get(TICK);
		const layerSuper = layer.get(Super);
		const layerMega = layer.get(Mega);
		const layerUltra = layer.get(Ultra);
		const f = layer_frame
		if(switchID === 0)
			this.tick_buffer(layerBase.name, Base, Base, layerBase.delta, f);
		if(switchID === 1)
		{
			this.tick_buffer(layerBase.name, Base, Game, layerBase.delta, f);
			this.tick_buffer(layerGame.name, Game, Game, layerGame.delta, f);
		}
		if(switchID === 2)
		{
			this.tick_buffer(layerBase.name, Base, TICK, layerBase.delta, f);
			this.tick_buffer(layerGame.name, Game, TICK, layerBase.delta, f);
			this.tick_buffer(layerTICK.name, TICK, TICK, layerTICK.delta, f);
		}
		if(switchID === 3)
		{
			this.tick_buffer(layerBase.name, Base, Super, layerBase.delta, f);
			this.tick_buffer(layerGame.name, Game, Super, layerBase.delta, f);
			this.tick_buffer(layerTICK.name, TICK, Super, layerBase.delta, f);
			this.tick_remote(layerSuper.name, Super, Super, layerSuper.delta, f);
			this.save()
		}
		if(switchID === 4)
		{
			this.tick_buffer(layerBase.name, Base, Mega, layerBase.delta, f);
			this.tick_buffer(layerGame.name, Game, Mega, layerBase.delta, f);
			this.tick_buffer(layerTICK.name, TICK, Mega, layerBase.delta, f);
			this.tick_remote(layerSuper.name, Super, Mega, layerBase.delta, f);
			this.tick_remote(layerMega.name, Mega, Mega, layerMega.delta, f);
		}
		if(switchID === 5)
		{
			this.tick_buffer(layerBase.name, Base, Ultra, layerBase.delta, f);
			this.tick_buffer(layerGame.name, Game, Ultra, layerBase.delta, f);
			this.tick_buffer(layerTICK.name, TICK, Ultra, layerBase.delta, f);
			this.tick_remote(layerSuper.name, Super, Ultra, layerBase.delta, f);
			this.tick_remote(layerMega.name, Mega, Ultra, layerBase.delta, f);
			this.tick_remote(layerUltra.name, Ultra, Ultra, layerUltra.delta, f);
		}
		return true
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {String} layerName 
 * @param {Number} layerID 
 * @param {Number} switchID 
 * @param {duration} dt 
 * @param {Number} layer_frame 
 */
MAGPIE_HIVE.tick_buffer = function tick_buffer(layerName, layerID, switchID, dt, layer_frame)
{
	const ePrefix = "[HIVE].tick_buffer: ";
	const layer = this[layerName];
	const slots = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).slots;
	const now = Date.now();
	for(let i = 0; i < slots; i++)
	{
		try
		{
			const slot = i;
			/** @type {MAGPIE_ENTITY} */
			const entity = MAGPIE_HIVE.getSlot(slot, layerID)
			if(!entity) continue
			if(!(entity instanceof MAGPIE_ENTITY)) 
				throw new Error(`${entity} is invalid MAGPIE_ENTITY`)
			if(entity.type < 1) continue
			// if((now - entity.updated) > dt * 3000) @audit-issue what's wrong with this?
			// 	this.kick(entity.ID, `timed-out`)
			const pass = entity.refresh(switchID, dt, layer_frame);
			if(!pass) 
				this.kick(entity.ID, "failed update")
		}
		catch(e)
		{
			MAGPIE_SERVER.error(ePrefix + e.message, e)
		}
	}
}
/**
 * 
 * @param {String} layerName 
 * @param {Number} layerID 
 * @param {Number} switchID 
 * @param {duration} dt 
 */
MAGPIE_HIVE.tick_remote = function tick_remote(layerName, layerID, switchID, dt)
{
	const ePrefix = "[HIVE].tick_remote: ";
	for(let i = 0; i < this[layerName].length; i++)
	{
		const entityID = this[layerName][i];
		try
		{
			if(isNaN(entityID))
				this[layerName][i] = 0;
			if(!entityID) continue
			const entity = this.loadEntitySync(entityID);
			if(!entity instanceof MAGPIE_ENTITY)
				throw new Error(`[ENTITY-${entityID}] is invalid entity`)
			const pass = entity.refresh(switchID, dt);
			if(!pass) 
				throw new Error(`[ENTITY-${entityID}] has failed to refresh`)
			const save = this.saveEntitySync(entity);
			if(!save)
				throw new Error(`unable to update [ENTITY-${this.ID}]`)
		}
		catch(e)
		{
			MAGPIE_SERVER.error(ePrefix + e.message, e)
			this.kick(entityID, layerID);
			continue
		}
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
// #region getters
//------------------------------------------------------------------------
/**
 * @desc {@link MAGPIE_HIVE.__getSlot}
 * @param {Number} slot 
 * @param {Number} layerID 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.getSlot = function getSlot(slot, layerID)
{
	const ePrefix = "[HIVE].getSlot: ";
	try
	{
		const layerName = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).name;
		const entity = this[layerName][slot]
		const valid = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE 
			? entity?.ID
			: !isNaN(entity);
		if(!valid)
			return
			// throw new Error(`[LAYER-${layerID}][${slot}] is invalid entity slot`)
		return entity
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} entityID 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE._get_entity = function _get_entity(entityID)
{
	const ePrefix = "[HIVE]._get_entity: ";
	try
	{
		const entry = MAGPIE_HIVE._registry.get(entityID);
		if(!entry || entry?.layerID >= MAGPIE.KEY.HIVE.BUFFER_SIZE) 
			return MAGPIE_DATABASE.loadEntitySync(entityID);
		const index = entry.slot;
		return MAGPIE_HIVE.getSlot(index, entry.layerID)
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {String} rT name of relatives table
 * @param {String} pK name of parent foreign key
 * @param {String} fK name of child foreign key
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_HIVE._get_entity_relatives = async function getEntityRelatives(entityID, rT, pK, fK)
{
	const ePrefix = `[HIVE].getEntityRelatives: `;
	try
	{
		const payload = [entityID, pK, fK, rT, "MAGPIE_ENTITY"]
		const result = await MAGPIE_DATABASE.call("getWorldRelatedRows", payload);
		if(!result || result?.length < 1)
			throw new Error(`unable to fetch ${rT}`)
		return result
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_HIVE._get_expKeys = function _get_expKeys(exp)
{
	const ePrefix = "[HIVE].getExpKeys: ";
	try
	{
		const keyIDs = exp.keys;
		if(!Array.isArray(keyIDs))
			throw new Error(`${keyIDs} is invalid exp.keys array`)
		if(keyIDs.length < 1) return
		const keys = [];
		for(const keyID of keyIDs)
		{
			try
			{
				const key = MAGPIE_HIVE._get_key(keyID);
				if(!(key instanceof MAGPIE_KEY))
					throw new Error(`unable to find [KEY-${keyID}]`)	
				keys.push(key)
			}
			catch(e)
			{
				MAGPIE_SERVER.error(ePrefix + e.message, e)
			}
		}
		return keys
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
MAGPIE_HIVE.__get_serverSync = function __get_serverSync(method, arguments)
{
	const callback = MAGPIE_SERVER[method];
	return callback(...arguments);
}
MAGPIE_SERVER._hive_new_entity = function newEntity(data)
{
	return new MAGPIE_ENTITY(data)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Setters
//------------------------------------------------------------------------
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {Promise<database_result>} 
 */
MAGPIE_HIVE._set_database = async function _set_database(method, arguments)
{
	const callback = MAGPIE_DATABASE[method]
	return await callback(...arguments);
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {database_result} 
 */
MAGPIE_HIVE._set_databaseSync = function _set_database(method, arguments)
{
	const callback = MAGPIE_DATABASE[method]
	return callback(...arguments)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region boot
//------------------------------------------------------------------------
/**
 * @typedef {import("./core/system").hive_vault} hive_vault 
 * 
 */
MAGPIE_HIVE.awake = async function awake()
{
	const ePrefix = `[HIVE].awake: `;
	try
	{
		if(this.isActive) return
		/** @type {hive_vault} */
		const hive = r.context["METASTATE"]?.hive;
		if(Object.prototype.toString.call(MAGPIE_HIVE._registry) !== "[object Map]")
			throw new Error(`${hive.registry} is invalid hive registry`)
		MAGPIE_HIVE._registry = hive.registry;
		const entities = Array.from(MAGPIE_HIVE._registry.entries())
			.filter(e => e[0] > 10);
		const layer = MAGPIE.KEY.RUNTIME.LAYER;
		entities.forEach(entry => {
			const entityID = entry[0];
			const record = entry[1];
			const layerID = record.layerID;
			const slot = record.slot;
			const target = record.target;
			const layerName = layer.get(layerID).name;
			this[layerName][slot] = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE ? this.loadEntitySync(entityID) : entityID;
		})
		MAGPIE_SERVER.CLI._incrementLoadBar()
		MAGPIE_SERVER.log(ePrefix + `loaded ${entities.length}x entities`)
		// hive.exps.forEach(expID => {
		// 	MAGPIE_HIVE._host_exp(MAGPIE_DATABASE.loadExpSync(expID), );
		// })
		// MAGPIE_SERVER.CLI._incrementLoadBar()
		// MAGPIE_SERVER.log(ePrefix + `loaded ${hive.exps.length}x exps`)
		// hive.keys.forEach(keyID => {
		// 	MAGPIE_HIVE._keyBuffer.set(keyID, MAGPIE_DATABASE.loadKeySync(keyID));
		// })
		// MAGPIE_SERVER.CLI._incrementLoadBar()
		// MAGPIE_SERVER.log(ePrefix + `loaded ${hive.keys.length}x keys`)
		// hive.symbols.forEach(symbolID => {
		// 	MAGPIE_HIVE._symbolBuffer.set(symbolID, MAGPIE_DATABASE.loadSymbolSync(symbolID));
		// })
		// MAGPIE_SERVER.CLI._incrementLoadBar()
		// MAGPIE_SERVER.log(ePrefix + `loaded ${hive.symbols.length}x symbols`)
		hive.contexts.forEach(contextID => {
			MAGPIE_HIVE._host_context(MAGPIE_DATABASE.loadContextSync(contextID))
		})
		MAGPIE_SERVER.CLI._incrementLoadBar()
		MAGPIE_SERVER.log(ePrefix + `loaded ${hive.contexts.length}x contexts`)
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
		this.pause();
	}
}
MAGPIE_HIVE.save = async function save()
{
	const ePrefix = "[HIVE].save: ";
	try
	{
		const result = await this.saveEntities()
		r.context.METASTATE.hive = {
			registry: MAGPIE_HIVE._registry,
			contexts: Array.from(MAGPIE_HIVE._contextBuffer.keys())
		}
		const metastate = MAGPIE_DATABASE.saveMetastate(r.context.METASTATE);
		if(!metastate) return
		const state = r.context.METASTATE;
		const message = `${result}x entities saved at `
			+ `[${state.meta.updated}-${state.date.printDate()}]`
		MAGPIE_SERVER.log(ePrefix + message, "console", false)
		return result;
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * 
 * @returns {Promise<Number>}
 */
MAGPIE_HIVE.saveEntities = async function saveEntities()
{
	const ePrefix = "[HIVE].saveEntities: ";
	try
	{
		const layer = MAGPIE.KEY.RUNTIME.LAYER;
		const base = this[layer.get(0).name].filter(entity => entity?.type > 0);
		const game = this[layer.get(1).name].filter(entity => entity?.type > 0);
		const TICK = this[layer.get(2).name].filter(entity => entity?.type > 0);
		if(base.length > 0)
		{
			const base_result = await MAGPIE_DATABASE.transactionSaveEntities(base);
			if(!base_result) 
				throw new Error(`unable to save ${base.length}x entities in layer0`)
		}
		if(game.length > 0)
		{
			const game_result = await MAGPIE_DATABASE.transactionSaveEntities(game);
			if(!game_result)
				throw new Error(`unable to save ${game.length}x entities in layer1`)
		}
		if(TICK.length > 0)
		{
			const TICK_result = await MAGPIE_DATABASE.transactionSaveEntities(TICK);
			if(!TICK_result)
				throw new Error(`unable to save ${TICK.length}x entities in layer2`)
		}
		return base.length + game.length + TICK.length
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.messag, e)
		return 0
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * @typedef {import("./core/entity").entityID} entityID
 */
//------------------------------------------------------------------------
// #region database
//------------------------------------------------------------------------
/**
 * 
 * @param {String} method 
 * @param {*} arguments 
 * @returns {Promise<*>}
 */
MAGPIE_HIVE._get_database = async function _get_database(method, arguments)
{
	const callback = MAGPIE_DATABASE[method] 
	return await callback(...arguments)
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments 
 * @returns {*}
 */
MAGPIE_HIVE._get_databaseSync = function _get_databaseSync(method, arguments)
{
	const callback = MAGPIE_DATABASE[method] 
	return callback(...arguments)
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments 
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE._set_database = async function _set_database(method, arguments)
{
	const callback = MAGPIE_DATABASE[method]
	return await callback(...arguments)
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments 
 * @returns {database_result}
 */
MAGPIE_HIVE._set_databaseSync = function _set_databaseSync(method, arguments)
{
	const callback = MAGPIE_DATABASE[method]
	return callback(...arguments)
}
/**
 * @desc {@link MAGPIE_HIVE.__loadEntitySync}
 * @param {entityID} entityID 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.loadEntitySync = function loadEntitySync(entityID)
{
	return MAGPIE_DATABASE.loadEntitySync(entityID);
}
/**
 * 
 * @param {entityID} entityID 
 * @returns {Promise<MAGPIE_ENTITY>}
 */
MAGPIE_HIVE.loadEntity = async function loadEntity(entityID)
{
	return await MAGPIE_DATABASE.loadEntity(entityID)
}
/**
 * @typedef {import("./core/database_worker").database_result} database_result
 * @param {MAGPIE_ENTITY} entity 
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE.saveEntity = async function saveEntity(entity)
{
	return await MAGPIE_DATABASE.saveEntity(entity)
}
/**
 * @desc {@link MAGPIE_HIVE.__saveEntitySync}
 * @param {MAGPIE_ENTITY} entity 
 * @returns {database_result}
 */
MAGPIE_HIVE.saveEntitySync = function saveEntitySync(entity)
{
	return MAGPIE_DATABASE.saveEntitySync(entity);
}
/**
 * 
 * @desc {@link MAGPIE_HIVE.__loadEntities}
 * @param {entityID[]} entityIDs
 * @returns {MAGPIE_ENTITY[]} 
 */
MAGPIE_HIVE.loadEntities = function loadEntities(entityIDs)
{
	const ePrefix = "[HIVE].loadEntities: ";
	let list = [];
	for(const entityID of entityIDs)
	{
		const entity = MAGPIE_DATABASE.loadEntitySync(entityID);
		list.push(entity);
	}
	return list
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * back to {@link MAGPIE_HIVE.__server}
 */
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Physics
//------------------------------------------------------------------------
/**
 * 
 * @param {{
 * C: MAGPIE_ENTITY,
 * C0: coords,
 * C1: coords,
 * CB: vector3
 * }} data
 * @returns {{Ac: vector3, Tc: bivector}}
 */
MAGPIE_PHYSICS._geod_checkCollisions = function _geod_checkCollisions(data)
{
	const ePrefix = "[PHYSICS].checkCollisions: ";
	try
	{
		const { C, C0, C1, CB } = data
		// MAGPIE_SERVER.HIVE._geod_checkCollisions()
		const Ac = [0,0,0];
		const Tc = [0,0,0];
		return { Ac, Tc }
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
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
// #region > Entity
//------------------------------------------------------------------------
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {*} 
 */
MAGPIE_ENTITY.__hiveSync = function __hiveSync(method, arguments)
{
	const callback = MAGPIE_HIVE[method];
	return callback(...arguments);
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {Promise<*>} 
 */
MAGPIE_ENTITY.__hive = async function __hive(method, arguments)
{
	const callback = MAGPIE_HIVE[method]
	return callback(...arguments)
}
MAGPIE_ENTITY.__socketEmit = function __socketEmit(output, exp, entity, P_C, POVART1, dt)
{
	const ePrefix = `[ENTITY-${entity.ID}].socketEmit: `;
	try
	{
		const { P0, V0, A0 } = MAGPIE_PHYSICS.decomp_POVART(POVART1)
		const Kp = MAGPIE.KEY.POVART;
		const C = P_C;
		const P1 = entity._get_P0();
		const O1 = entity._get_O0();
		const V1 = entity._get_V0();
		const V1hdg = MAGPIE_PHYSICS._get_V0_heading(P1, V1);
		// MAGPIE_SERVER._debug(`V1hdg: ${V1hdg}`)
		const A1 = entity._get_A0();
		const R1 = entity._get_R0();
		const T1 = entity._get_T0();
		const lat = Number(output[0]);
		const lon = Number(output[1]);
		const ASL = Number(output[2]);
		const r = Number(output[3]);
		const forces = output.slice(4);
		const Vspeed = Number(MAGPIE_PHYSICS.mag(V1));
		const Vknots = Number(MAGPIE_PHYSICS._U_MPStoKnots(Vspeed));
		const Acc = Number(MAGPIE_PHYSICS.mag(A1) / dt);
		const normP1 = MAGPIE_PHYSICS.normalizeVector(P1);
		const hdg = Number(MAGPIE_PHYSICS._rotor_toHeadingAbs(O1, normP1));
		const pitch = Number(MAGPIE_PHYSICS._rotor_toPitchAbs(O1, normP1));
		const roll = Number(MAGPIE_PHYSICS._rotor_toRollAbs(O1, normP1));
		const Pt = exp?._get_targetSTATS()?.slice(0, Kp.P_C) || [NaN,NaN,NaN]
		const validTarget = MAGPIE_PHYSICS.isValidVector(Pt);
		const Ct = validTarget ? MAGPIE_PHYSICS.cartesianToGeodetic(Pt, r) : [NaN, NaN, NaN];
		const dist = validTarget ? Number(MAGPIE_PHYSICS._geod_distanceTo(P1, Pt, r)) : NaN;
		const dist2 = validTarget ? Number(MAGPIE_PHYSICS.distanceTo(P1, Pt)) : NaN;
		const ETA_s = Number(Math.floor(dist / Vspeed));
		// MAGPIE_SERVER._debug(ETA_s)
		const ETA = !isNaN(ETA_s) ? MAGPIE_SYSTEM.Utility.printETA(ETA_s) : "N/A";
		const data = {
			entityID: entity.ID,
			entityName: entity.name,
			metadate: entity.updated,
			coords: [lat,lon,ASL],
			Vspeed: Vspeed,
			Vknots: Vknots,
			Acceleration: Acc,
			heading: hdg,
			pitch: pitch,
			roll: roll,
			CelestialBody: C.name,
			targetCoords: Ct,
			distanceTo: dist,
			ETA: ETA,
			forces: forces
		};
		// MAGPIE_SERVER._debug(Object.entries(data))
		const V0_mag = MAGPIE_PHYSICS.mag(V0);
		const A0_mag = MAGPIE_PHYSICS.mag(A0);
		if(!MAGPIE_ENTITY?._delta)
			MAGPIE_ENTITY._delta = Date.now();
		MAGPIE_ENTITY._delta += dt * 1000;
		io.to(`entity_${entity.ID}`).emit("entity_update", data);
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {String} method 
 * @param  {*} argument 
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._database = async function _database(method, argument)
{
	const callback = MAGPIE_DATABASE[method]
	return await callback(argument)
}
/**
 * 
 * @param {String} method 
 * @param  {*} argument
 * @returns {*} 
 */
MAGPIE_ENTITY._database_Sync = function _database_Sync(method, argument)
{
	const callback = MAGPIE_DATABASE[method]
	return callback(argument)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Compon.
//------------------------------------------------------------------------
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {MAGPIE_COMPONENT} 
 */
MAGPIE_COMPONENT.__get = function get(method, arguments)
{
	const callback = MAGPIE_HIVE[method]
	return callback(...arguments)
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {Promise<database_result>} 
 */
MAGPIE_COMPONENT.__set = async function set(method, arguments)
{
	const callback = MAGPIE_HIVE[method];
	return await callback(...arguments);
} 
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {database_result} 
 */
MAGPIE_COMPONENT.__setSync = function setSync(method, arguments)
{
	const callback = MAGPIE_HIVE[method];
	return callback(...arguments)
} 
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Context
//------------------------------------------------------------------------
MAGPIE_CONTEXT.__hive = async function __hive(method, arguments)
{
	const callback = MAGPIE_HIVE[method]
	return await callback(...arguments)
}
MAGPIE_CONTEXT.__hiveSync = function __hiveSync(method, arguments)
{
	const callback = MAGPIE_HIVE[method]
	return callback(...arguments)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * @typedef {import("./core/index").keyID} keyID
 */
//------------------------------------------------------------------------
// #region > Key
//------------------------------------------------------------------------
MAGPIE_SERVER.key = {};
MAGPIE_KEY.setup = async function setup()
{
	const ePrefix = "[KEY].setup: ";
	try
	{
		MAGPIE_SERVER.log("loading keys...", null, true);
		const db = MAGPIE_DATABASE.sync.world;
		const sql = "SELECT label FROM MAGPIE_KEY WHERE type = ?";
		/** @param {Enumerator<Number>} type @returns {String[]} */
		const query = (type) => {
			const results = db.prepare(sql).all(type)
			return results.map(result => result.label)
		}
		const axioms = query(MAGPIE.KEY.TYPE.AXIOM);
		MAGPIE_SERVER.log(`loaded ${axioms.length}x keys`);
		MAGPIE_SERVER.CLI._incrementLoadBar();
		/** @param {Object} */
		const index = (type) => {
			const start = axioms.indexOf("Vmax")
			const end = axioms.indexOf("Tdock")
			const types = axioms.slice(start, end + 1)
			types.forEach(label => {
				type.set(MAGPIE.KEY.INDEX[label.toUpperCase()], label)
			})
			return types.length
		}
		MAGPIE_SERVER.log(`indexed ${index(MAGPIE.KEY.INDEX.VSPEEDS)}x Vspeeds`);
		MAGPIE_SERVER.CLI._incrementLoadBar()
		return true
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		return false
	}
}
/**
 * 
 * @param {String} method
 * @param {[]} arguments
 * @returns {Promise<database_result>}
 */
MAGPIE_KEY.__hive = async function __hive(method, arguments)
{
	const callback = MAGPIE_HIVE[method];
	return await callback(...arguments)
}
/**
 * 
 * @param {String} method
 * @param {[]} arguments
 * @returns {database_result}
 */
MAGPIE_KEY.__hiveSync = function __hiveSync(method, arguments)
{
	const callback = MAGPIE_HIVE[method];
	return callback(...arguments)
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
MAGPIE_EXP.__hiveSync = function __hiveSync(method, arguments)
{
	const callback = MAGPIE_HIVE[method];
	return callback(...arguments)
}
/**
 * 
 * @returns {Promise<database_result>}
 */
MAGPIE_EXP.prototype.set = async function set()
{
	return await MAGPIE_DATABASE.saveExp(this);
}
/**
 * 
 * @returns {database_result}
 */
MAGPIE_EXP.prototype.setSync = function setSync()
{
	return MAGPIE_DATABASE.saveExpSync(this);
}
/**
 * @param {keyID} keyID
 * @returns {MAGPIE_KEY}
 * {@link MAGPIE_EXP.__getKey}
 */
MAGPIE_EXP.prototype.getKey = function getKey(keyID)
{
	return MAGPIE_DATABASE.loadKeySync(keyID)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Metastate
//------------------------------------------------------------------------
MAGPIE_SERVER.SYS._metastate_tick_base = MAGPIE_METASTATE._TICK_base;
MAGPIE_METASTATE.prototype.TICK_base = async function TICK_base(layerID, switchID)
{
	const now = performance.now();
	this.date.millisecond = Math.floor(now % 1000);
	if(switchID === 2) 
	{
		this._socketEmit();
		return this.date.TICK();
	}
}
MAGPIE_METASTATE.prototype.TICK_game = async function TICK_game()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_standard = async function TICK_standard()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_super = async function TICK_super()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_mega = async function TICK_mega()
{
	//
}
MAGPIE_METASTATE.prototype.TICK_ultra = async function TICK_ultra()
{
	//
}
MAGPIE_METASTATE.prototype.save = function save()
{
	//
}
MAGPIE_METASTATE.prototype.load = function load()
{
	//
}
/**
 * {@link MAGPIE_METASTATE._socketEmit}
 */
MAGPIE_METASTATE.prototype._socketEmit = function _socketEmit()
{
	const metastate = {};
	const calendar = this.date.getCalendar();
	metastate.meta = this.meta;
	metastate.date = this.date;
	metastate.weekDayName = this.date.getWeekDayName(); 
	metastate.calendar = this.date.getCalendar(),
	metastate.hive = this.hive,
	metastate.contents = this.contents
	io.emit("metastate", metastate);
}

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > CLI
//------------------------------------------------------------------------
MAGPIE_SERVER.CLI = {};
MAGPIE_SERVER.CLI.SPINNER = cliSpinner.Spinner;
//
MAGPIE_SERVER.CLI._createLoadBar = function createLoadBar(options = {
	clearOnComplete: true,
	hideCursor: true,
	name: "bar1"
})
{
	MAGPIE_SERVER.CLI.loadbar = new cliProgress.MultiBar({
		clearOnComplete: true,
		hideCursor: true
	}, cliProgress.Presets.shades_classic);
	MAGPIE_SERVER.CLI[options.name] = MAGPIE_SERVER.CLI.loadbar.create(100,0);
}
MAGPIE_SERVER.CLI._updateLoadBar = function updateLoadBar(value = 0, name = "bar1")
{
	MAGPIE_SERVER.CLI[name].update(value);
}
MAGPIE_SERVER.CLI._incrementLoadBar = function incrementLoadBar(value = 1, name = "bar1")
{
	MAGPIE_SERVER.CLI[name].increment(value);
}
MAGPIE_SERVER.CLI._stop = function stopLoadBar()
{
	MAGPIE_SERVER.CLI.loadbar.stop();
	// process.stdout.write('\r\x1b[K'); 
	// process.stdout.write('\x1b[?25h');
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name logging
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > logging
//------------------------------------------------------------------------
MAGPIE_SERVER.LOG = MAGPIE_LOG;
/**
 * 
 * @param {String} message 
 * @param {String} prefix 
 * @param {Boolean} logToConsole 
 * @returns 
 */
MAGPIE_SERVER.log = function log(message, prefix, logToConsole)
{
	return MAGPIE_SYSTEM.log(message, prefix, logToConsole);
}
MAGPIE_SERVER.error = function error(message, error)
{
	return MAGPIE_SYSTEM.error(message, error);
}
MAGPIE_SERVER._debug = function debug(message)
{
	return MAGPIE_SYSTEM._logging_debug(message);
}
MAGPIE_SERVER.LOG.exp = function logExpActivity(message)
{
	return MAGPIE_SYSTEM.logging.log_exp(message);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name Utility
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Utility
//------------------------------------------------------------------------
MAGPIE_SERVER.UTILITY = {};
/**
 * 
 * @param {Number[]} version 
 * @returns {String} MAJOR.MINOR.PATCH
 */
MAGPIE_SERVER.UTILITY.version = function version(version)
{
	if(!version || version.length < 2 || version.some(n => isNaN(n)))
		version = [0,1,0];
	const Vr = version;
	return `${Vr[0]}.${Vr[1]}.${Vr[2]}`; 
}
/**
 * @typedef {import("./core/system").CTZD} CTZD
 * @returns {CTZD} YYYYMMDD
 */
MAGPIE_SERVER.UTILITY.CTZD = function CTZD()
{
	return MAGPIE_SYSTEM.Utility.CTZD()
}
/**
 * @typedef {import("./core/system").CTZ} CTZ
 * @returns {CTZ} YYYYMMDDHHMM
 */
MAGPIE_SERVER.UTILITY.CTZ = function CTZ()
{
	return MAGPIE_SYSTEM.Utility.CTZ();
}
/**
 * @typedef {import("./core/system").CTZT} CTZT
 * @returns {CTZT} HHMM
 */
MAGPIE_SERVER.UTILITY.CTZT = function CTZT()
{
	return MAGPIE_SYSTEM.Utility.CTZT();
}
/**
 * @typedef {import("./core/system").CTZTS} CTZTS
 * @returns {CTZTS} HHMMSS
 */
MAGPIE_SERVER.UTILITY.CTZTS = function CTZTS()
{
	return MAGPIE_SYSTEM.Utility.CTZTS()
}
/**
 * @typedef {import("./core/system").CTZF} CTZF
 * @returns {CTZF} YYYYMMDDHHMMSSmmm
 */
MAGPIE_SERVER.UTILITY.CTZF = function CTZF()
{
	return MAGPIE_SYSTEM.Utility.CTZF()
}
/**
 * @typedef {import("./core/system").epoch_real} epoch_real
 * @returns {epoch_real}
 */
MAGPIE_SERVER.UTILITY.epoch = function epoch()
{
	return Date.now();
}
/**
 * 
 * @returns {CTZ} [YYYYMMDDHHMM]
 */
MAGPIE_SERVER.UTILITY.consoleTime = function consoleTime()
{
	return MAGPIE_SYSTEM.Utility.consoleTime();
}
/**
 * 
 * @returns {CTZF} [YYYYMMDDHHMMSSmmm]
 */
MAGPIE_SERVER.UTILITY.logTime = function logTime()
{
	return MAGPIE_SYSTEM.Utility.logTime();
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name REPL
 * @desc 
 */
//------------------------------------------------------------------------
// #region > REPL
//------------------------------------------------------------------------
MAGPIE_SERVER.context = {};

Object.keys(MAGPIE_SERVER.registry).forEach(k => {
	MAGPIE_SERVER.context[k] = MAGPIE_SERVER.registry[k];
})
MAGPIE_SERVER.prototype.constructor = MAGPIE_SERVER;
MAGPIE_SERVER._REPL_boot = function bootREPLconsole()
{
	const keys = Object.keys(MAGPIE_SERVER.context);
	keys.forEach(k => {
		r.context[k] = MAGPIE_SERVER.context[k];
		MAGPIE_SERVER.CLI._incrementLoadBar();
	})
	return keys.length
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name app
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > App
//------------------------------------------------------------------------
const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: [MAGPIE.KEY.SERVER.DOMAIN, "https://socket.io"],
		methods: ["GET", "POST"],
		credentials: true
	},
	transports: ["websocket"],
	allowUpgrades: false
})
instrument(io, {
	auth: false,
	mode: "development"
})
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
MAGPIE_SERVER.public = {};
MAGPIE_SERVER.public.loginLimiter = ratelimit.rateLimit({
	windowMs: MAGPIE.KEY.SERVER.LOGIN_COOLDOWN * 60 * 1000,
	max: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
	handler: (req, res, next, options) => {
		const http = MAGPIE.KEY.SERVER.HTTP.STATUS_429;
		const resetTime = req.rateLimit.resetTime;
		const remainingMs = resetTime - Date.now();
		const minutes = Math.ceil(remainingMs / (60 * 1000));
		res.status(http).json({
			status: http,
			error: MAGPIE.KEY.SERVER.LOGIN_MAX_ATTEMPTS,
			message: `Please, wait ${minutes} minute(s) before trying again.`,
			retryAfter: minutes
		})
	},
	standardHeaders: true, //return rate limit info in the 'RateLimit-*' headers
	legacyHeaders: false //disable the 'X-RateLimit-*' headers
})
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Auth
//------------------------------------------------------------------------
MAGPIE_SERVER.AUTH = require("./core/auth")
// #endregion
//------------------------------------------------------------------------
/**
 * @name Post
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Post
//------------------------------------------------------------------------
MAGPIE_SERVER.POST = {};
app.post("/login", MAGPIE_SERVER.public.loginLimiter, async (req, res) => {
	const ePrefix = "[APP POST].login: ";
	const { email, pass } = req.body;
	try
	{
		const badRequest = MAGPIE.KEY.SERVER.HTTP.STATUS_400;
		const unauthorized = MAGPIE.KEY.SERVER.HTTP.STATUS_401;
		const forbidden = MAGPIE.KEY.SERVER.HTTP.STATUS_403;
		const serverError = MAGPIE.KEY.SERVER.HTTP.STATUS_500;
		if(!email || !pass)
			return res.status(badRequest).json({
				error: ePrefix + "Missing credentials"
			})
		const player = await MAGPIE_DATABASE.loginPlayer(email, pass);
		if(!player) return res.status(unauthorized).json({
			error: ePrefix + "Invalid credentials"
		})
		if(player.isFrozen === 1)
			return res.status(forbidden).json({
				error: ePrefix + MAGPIE.KEY.SERVER.HTTP.STATUS_403.message
			})
		const token = MAGPIE_SERVER.AUTH.signToken(player.ID);
		return res.status(successful).json( { token });
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		return res.status(serverError).json({
			error: ePrefix + "Internal Server Error"
		})
	}
})
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Socket
//------------------------------------------------------------------------
MAGPIE_SERVER.SOCKET = {};
MAGPIE_SERVER.SOCKET.auth_failed = function auth_failed(socketID, errorMessage)
{
	const err = new Error(errorMessage);
	return MAGPIE_SERVER.error(`[AUTH FAILED] [SOCKET-${socketID}] `
		+ `invalid: ${err.message}`, err);
}
MAGPIE_SERVER.SOCKET.auth_dev = function auth_dev(socketID)
{
	return MAGPIE_SERVER.log("[AUTH DEV] Dev_mode active: bypassing JWT for "
		+ `[SOCKET-${socketID}]`
	)
}
io.use((socket, next) => {
	const token = socket.handshake.auth?.token;
	const config = MAGPIE.config;
	const isDev = config.devMode;
	if(!token) 
	{
		socket.data.playerID = isDev ? "999" : "0";
		return next();
	}
	try
	{
		// @todo JWT login security
		// const secret = config.jwtSecret || "dev_secret";
		// const payload = MAGPIE_SERVER.JWT.verify(token, secret);
		// socket.data.playerID = String(payload.playerID || payload.guestID || "0");
		socket.data.playerID = isDev ? "999" : "0";
		next();
	}
	catch(e)
	{
		socket.data.playerID = "0";
		MAGPIE_SERVER.SOCKET.auth_failed(socket.id, e.message);
		next();
	}
})
io.on("connection", (socket) => {
	const playerID = String(socket.data.playerID);
	const ePrefix = `[SOCKET-${socket.id}] [PLAYER-${playerID}]: `;
	socket.use(([event, ...args], next) => {
		MAGPIE_SERVER.log(`${ePrefix} ${event} — ${JSON.stringify(args)}`, "console", false);
		if(socket.data.isFrozen && event !== "chat message")
		{
			socket.emit("error_message", "You are frozen!");
			return
		}
		next()
	})
	MAGPIE_SERVER.HANDLER.forEach(handler => {
		if(typeof handler === "function")
			handler(io, socket, MAGPIE_SERVER);
	})
	socket.on("disconnect", (reason) => {
		if(playerID !== 0)
			MAGPIE_SERVER.log(`${ePrefix} disconnected — ${reason}`, "console", false);
		socket.watchID = null;
	})
	socket.on("error", (err) => {
		socket.emit("error_message", err.message);
	})
})
// #endregion
//------------------------------------------------------------------------
/**
 * @name boot
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Boot
//------------------------------------------------------------------------
MAGPIE_SERVER.BOOT = {}
MAGPIE_SERVER.BOOT.meta = {};
/**
 * @typedef {Number} exit_signal
 * @param {exit_signal} signal 
 */
MAGPIE_SERVER.BOOT.shutdown = async function shutdown(signal = 0)
{
	const ePrefix = "[BOOT].shutdown: ";
	MAGPIE_SERVER.CLI._createLoadBar();
	MAGPIE_SERVER.CLI._updateLoadBar();
	MAGPIE_SERVER.log(ePrefix + `[SIGNAL-${signal}] received: initiating shutdown sequence...`, null, true);
	if(io)
	{
		const fallbackTimeout = setTimeout(() => {
			const error = new Error(`Shutdown timeout: forcing shutdown...
				-------------------------------\n\n`);
			MAGPIE_SERVER.error(error.message, error);
			process.exit(signal)
		}, 10000)
		try
		{
			await MAGPIE_HIVE.save();
			MAGPIE_SERVER.CLI._incrementLoadBar(10);
			await new Promise((resolve) => {
				io.close((err) => {
					if(err) MAGPIE_SERVER.log(ePrefix + "[io] " + err.message, "console", true);
					MAGPIE_SERVER.log("Socket.io server closed.", null, true);
					resolve();
				})
			})
			MAGPIE_SERVER.CLI._incrementLoadBar(10);
			await new Promise((resolve) => {
				MAGPIE_SERVER.SERVER.close((err) => {
					if(err) MAGPIE_SERVER.log(ePrefix + err.message, "console", true);
					MAGPIE_SERVER.log("HTTP server closed.", null, true);
					resolve();
				})
			})
			MAGPIE_SERVER.CLI._incrementLoadBar(10);
			MAGPIE_SERVER.CLI._updateLoadBar(100);
			MAGPIE_SERVER.log(ePrefix + "sequence complete. Exiting...\n" + 
					"----------------------------------\n\n", null, true)
			MAGPIE_SERVER.CLI._stop();
			if(typeof r !== 'undefined' && typeof r.displayPrompt === 'function')
				r.displayPrompt();
			clearTimeout(fallbackTimeout);
			return process.exit(signal)
		}
		catch(e)
		{
			MAGPIE_SERVER.error(ePrefix + e.message, e);
			clearTimeout(fallbackTimeout);
			return process.exit(1);
		}
	}
}
MAGPIE_SERVER.restart = function restart()
{
	return MAGPIE_SERVER.BOOT.shutdown(2);
}
MAGPIE_SERVER.BOOT.connect = async function connect()
{
	const S = MAGPIE.KEY.SERVER;
	MAGPIE_SERVER.SERVER = server.listen(S.PORT, "0.0.0.0", () => {
		const message = `${S.MESSAGE.BOOTED}${MAGPIE_SERVER.config.domain}:${S.PORT}...`;
		MAGPIE_SERVER.log(message);
	})
	MAGPIE_SERVER.CLI._incrementLoadBar(20);
	return true
}
MAGPIE_SERVER.BOOT.logBootTime = function logBootTime()
{
	const bootTime = `[BOOT time: ${MAGPIE_SERVER.perf.end = performance.now()}]`;
	const version = MAGPIE_SERVER.UTILITY.version(MAGPIE.meta.version);
	const splash = `${MAGPIE.meta.name} v${version} ${MAGPIE.meta.firmwareDate}`
	MAGPIE_SERVER.log(`${splash} ${bootTime}`)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Setup
//------------------------------------------------------------------------
/**
 * 
 */
MAGPIE_DATABASE.setup = function setup()
{
	const ePrefix = "[DATABASE].setup: ";
	const integer = "INTEGER NOT NULL";
	const integerNullable = "INTEGER"
	const integerKey = "INTEGER PRIMARY KEY";
	const foreignKey = " FOREIGN KEY";
	const blob = "JSON NOT NULL";
	const textNullable = "TEXT";
	const text = "TEXT NOT NULL";
	const textKey = "TEXT PRIMARY KEY";
	/** @type {Map<String, database_result[]>} */
	const tables = new Map();
	try
	{
		const logs = this.sync.createServerTable("MAGPIE_LOG", {
			ID: integerKey,
			gravity: integer,
			urgency: integer
		});
		tables.set("logs", logs);
		const entities = this.sync.createWorldTable("MAGPIE_ENTITY", {
			ID: integerKey,
			type: integer,
			name: textNullable,
			updated: integer,
			compoundID: integerNullable,
			hostID: integerNullable,
			data: blob,
			fk1: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_ENTITY(ID)",
			fk2: "FOREIGN KEY (hostID) REFERENCES MAGPIE_ENTITY(ID)"
		});
		tables.set("entities", entities);
		const entity_parent = this.sync.createWorldTable("entity_parent", {
			type: integerKey,
			desc: text
		})
		const entity_children = this.sync.createWorldTable("entity_children", {
			parentID: integer,
			childID: integer,
			parentType: integer,
			"PRIMARY KEY": "(parentID, childID, parentType)",
			fk1: "FOREIGN KEY (parentID) REFERENCES MAGPIE_ENTITY(ID)",
			fk2: "FOREIGN KEY (childID) REFERENCES MAGPIE_ENTITY(ID)",
			fk3: "FOREIGN KEY (parentType) REFERENCES entity_parent(type)"
		})
		tables.set("entity_children", entity_children);
		const entity_components = this.sync.createWorldTable("entity_components", {
			compoundID: integer,
			componentID: integer,
			"PRIMARY KEY": "(compoundID, componentID)",
			fk1: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_ENTITY(ID) ON DELETE CASCADE",
			fk2: "FOREIGN KEY (componentID) REFERENCES MAGPIE_ENTITY(ID)"
		})
		tables.set("entity_components", entity_components);
		const entity_equips = this.sync.createWorldTable("entity_equips", {
			hostID: integer,
			equipID: integer,
			"PRIMARY KEY": "(hostID, equipID)",
			fk1: "FOREIGN KEY (hostID) REFERENCES MAGPIE_ENTITY(ID) ON DELETE CASCADE",
			fk2: "FOREIGN KEY (equipID) REFERENCES MAGPIE_ENTITY(ID)"
		})
		tables.set("entity_equips", entity_equips);
		const events = this.sync.createWorldTable("MAGPIE_EVENT", {
			ID: integerKey,
			type: integer,
			parentID: integerNullable,
			status: integer,
			updated: integer,
			data: blob,
			fk1: "FOREIGN KEY (parentID) REFERENCES MAGPIE_EVENT(ID)"
		})
		tables.set("events", events);
		const event_children = this.sync.createWorldTable("event_children", {
			parentID: integer,
			childID: integer,
			fk1: "FOREIGN KEY (parentID) REFERENCES MAGPIE_EVENT(ID) ON DELETE CASCADE",
			fk2: "FOREIGN KEY (childID) REFERENCES MAGPIE_EVENT(ID)"
		})
		const keys = this.sync.createWorldTable("MAGPIE_KEY", {
			ID: integerKey,
			type: integer,
			label: textNullable,
			originID: integerNullable,
			compoundID: integerNullable,
			symbolID: integerNullable,
			fk1: "FOREIGN KEY (originID) REFERENCES MAGPIE_KEY(ID)",
			fk2: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_KEY(ID)",
			fk3: "FOREIGN KEY (symbolID) REFERENCES MAGPIE_SYMBOL(ID)"
		});
		tables.set("keys", keys);
		const exps = this.sync.createWorldTable("MAGPIE_EXP", {
			ID: integerKey,
			subjectID: integerNullable,
			targetID: integerNullable,
			data: blob,
			fk1: "FOREIGN KEY (subjectID) REFERENCES MAGPIE_ENTITY(ID)",
			fk2: "FOREIGN KEY (targetID) REFERENCES MAGPIE_ENTITY(ID)"
		})
		tables.set("exps", exps);
		const exp_keys = this.sync.createWorldTable("EXP_KEYS", {
			expID: integer,
			keyID: integer,
			"PRIMARY KEY": "(expID, keyID)",
			fk1: "FOREIGN KEY (expID) REFERENCES MAGPIE_EXP(ID) ON DELETE CASCADE",
			fk2: "FOREIGN KEY (keyID) REFERENCES MAGPIE_KEY(ID)"
		})
		tables.set("exp_keys", exp_keys);
		const key_legacies = this.sync.createWorldTable("key_legacies", {
			keyID: integer,
			legacyID: integer,
			"PRIMARY KEY": "(keyID, legacyID)",
			fk1: "FOREIGN KEY (keyID) REFERENCES MAGPIE_KEY(ID) ON DELETE CASCADE",
			fk2: "FOREIGN KEY (legacyID) REFERENCES MAGPIE_KEY(ID)"
		});
		tables.set("key_legacies", key_legacies);
		const key_components = this.sync.createWorldTable("key_components", {
			keyID: integer,
			componentID: integer,
			"PRIMARY KEY": "(keyID, componentID)",
			fk1: "FOREIGN KEY (keyID) REFERENCES MAGPIE_KEY(ID) ON DELETE CASCADE",
			fk2: "FOREIGN KEY (componentID) REFERENCES MAGPIE_KEY(ID)"
		});
		tables.set("key_components", key_components);
		const symbols = this.sync.createWorldTable("MAGPIE_SYMBOL", {
			ID: integerKey,
			type: integer,
			name: textNullable,
			data: blob,
		});
		tables.set("symbols", symbols);
		const symbol_recipes = this.sync.createWorldTable("symbol_recipes", {
			requirementID: integer,
			recipeID: integer,
			"PRIMARY KEY": "(requirementID, recipeID)",
			fk1: "FOREIGN KEY (requirementID) REFERENCES MAGPIE_SYMBOL(ID)",
			fk2: "FOREIGN KEY (recipeID) REFERENCES MAGPIE_SYMBOL(ID)"
		});
		tables.set("symbol_recipes", symbol_recipes);
		const symbol_components = this.sync.createWorldTable("symbol_components", {
			compoundID: integer,
			componentID: integer,
			"PRIMARY KEY": "(compoundID, componentID)",
			fk1: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_SYMBOL(ID)",
			fk2: "FOREIGN KEY (componentID) REFERENCES MAGPIE_SYMBOL(ID)"
		});
		tables.set("symbol_components", symbol_components);
		const metastate = this.sync.createWorldTable("MAGPIE_METASTATE", {
			key: textKey,
			data: blob
		});
		tables.set("metastate", metastate);
		const contexts = this.sync.createWorldTable("MAGPIE_CONTEXT", {
			ID: integerKey,
			type: integer,
			updated: integer,
			data: blob
		})
		const players = this.sync.createServerTable("MAGPIE_PLAYER", {
			ID: integerKey,
			username: text,
			email: text,
			PASS: text,
			isFrozen: integer,
			data: blob
		})
		tables.set("players", players);
		const results = Array.from(tables.entries());
		if(results.every((r) => r[1])) return results
			throw new Error(`unable to setup [${results.filter(r => !r[1])}]`);
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
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
// #region - PAD
//========================================================================
MAGPIE_SERVER.scratchpad = {};
MAGPIE_SERVER.scratchpad.file = path.join(__dirname, "plugins", "scratchpad.js");
MAGPIE_SERVER.scratchpad.load = async function load(fileName)
{
	const filePath = path.join(__dirname, "plugins", fileName);
	const prefix = "[SCRATCHPAD].load: ";
	try
	{
		const { content, startMarker, startIndex, endIndex } = MAGPIE_SERVER.scratchpad.read();
		if(startIndex === -1 || endIndex === -1)
			return console.log(prefix = "regions not found. Skipping execution");
		const codeToRun = content
			.substring(startIndex + startMarker.length, endIndex).trim();
		if(!codeToRun) 
		{
			console.log(prefix + "no code found");
			return r.displayPrompt() 
		}
		const sandbox = {
			MAGPIE_SERVER,
			api: MAGPIE_SERVER.api,
			console,
			require
		};
		vm.createContext(sandbox);
		await new Promise((resolve) => setTimeout(() => {
			try
			{
				eval(codeToRun);
				console.log("ok");
				resolve()
			}
			catch(e)
			{
				console.error(e);
			}
		}, 100));
		MAGPIE_SYSTEM.PS.playSound(MAGPIE.KEY.WMEDIA.CHORD);
		const newContent = content.substring(0, startIndex + startMarker.length)
			+ "\n\n" + content.substring(endIndex);
		fs.writeFileSync(filePath, newContent);
		console.log(prefix + `[PUNCH-IN: ${filePath}] executed and cleared`);
		r.displayPrompt();
	}
	catch(e)
	{
		console.error(prefix + "error: ", e);
	}
}
MAGPIE_SERVER.scratchpad.read = function read()
{
	const filePath = path.join(__dirname, "plugins", "scratchpad.js");
	const content = fs.readFileSync(filePath, "utf-8");
	const startMarker = "// #region - Scratchpad";
	const endMarker = "// #endregion";
	const startIndex = content.indexOf(startMarker);
	const endIndex = content.indexOf(endMarker);
	return { content, startMarker, endMarker, startIndex, endIndex }
}
MAGPIE_SERVER.scratchpad.log = function log(input)
{
	const prefix = "[SCRATCHPAD].load: ";
	const filePath = path.join(__dirname, "plugins", "scratchpad.js");
	fs.appendFileSync(filePath, `\n\n${input}\n`);
	console.log(prefix + `[PUNCH-OUT: ${filePath}] logged`);
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
 * @name BOOT
 * @desc 
 * 
 */
//========================================================================
// #region - BOOT
//========================================================================
const REPL = require("repl");
console.clear();
const r = REPL.start("MAGPIE_SERVER > ")
r.context.r = r;
MAGPIE_SERVER.CLI._createLoadBar();
MAGPIE_SERVER.CLI._updateLoadBar(0);
MAGPIE_SERVER.CLI._updateLoadBar(MAGPIE_SERVER._REPL_boot());
MAGPIE_SERVER.BOOT.connect().then(() => main())
const main = async function main() 
{
	MAGPIE_SERVER.RUNTIME = new MAGPIE_RUNTIME();
	MAGPIE_SERVER.DATABASE = MAGPIE_DATABASE;
	MAGPIE_SERVER.log("loading data...", null, true);
	await MAGPIE_EMOTE.setup();
	MAGPIE_SERVER.CLI._incrementLoadBar(5);
	MAGPIE_STATE.setup();
	MAGPIE_SERVER.CLI._incrementLoadBar(5);
	await MAGPIE_KEY.setup();
	MAGPIE_SERVER.CLI._incrementLoadBar(5);
	MAGPIE_SERVER.HIVE = MAGPIE_HIVE;
	MAGPIE_HIVE.setup();
	/** @type {new MAGPIE_METASTATE} */
	MAGPIE_SERVER.METASTATE = null;
	MAGPIE_SERVER.CLI._incrementLoadBar(5);
	r.context.SERVER = MAGPIE_SERVER;
	r.context.RUNTIME = MAGPIE_SERVER.RUNTIME;
	r.context.HIVE = MAGPIE_SERVER.HIVE;
	r.context.DATABASE = MAGPIE_SERVER.DATABASE;
	r.context.PHYSICS = MAGPIE_PHYSICS;
	r.context.EMOTE = MAGPIE_EMOTE;
	MAGPIE_SERVER.CLI._updateLoadBar(20);
	r.context.io = io;
	// MAGPIE_DATABASE.sitrep();
	MAGPIE_SERVER.CLI._incrementLoadBar(5);
	MAGPIE_SERVER.RUNTIME.loadMetastate();
	MAGPIE_SERVER.RUNTIME.host("HIVE", 0);
	MAGPIE_SERVER.RUNTIME.awake();
	MAGPIE_SERVER.HIVE.awake()
	MAGPIE_SERVER.CLI._incrementLoadBar(5);
	MAGPIE_SERVER.CLI._incrementLoadBar(10);
	MAGPIE_SERVER.CLI._updateLoadBar(100);
	MAGPIE_SERVER.CLI._stop();
	setTimeout(() => {
		// console.clear();
		MAGPIE_SERVER.BOOT.logBootTime();
		r.displayPrompt();
		}, 100);
	
};
	fs.watchFile(MAGPIE_SERVER.scratchpad.file, { interval: 1000 }, (curr, prev) => {
	if(curr.mtime > prev.mtime) {
		console.log("--- Executing VS code scratchpad --- ")
		MAGPIE_SERVER.scratchpad.load("scratchpad.js");
	}
})
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
 * @desc back to {@link MAGPIE_SERVER}
 *
 */
//========================================================================
// #END OF FILE
//========================================================================