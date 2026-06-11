/**
 * 
 * @namespace MAGPIE_Server
 * @author Matheraptor
 * @version 0.32.0
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
MAGPIE_SERVER.config = require("./core/config");
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
	MAGPIE_DATE,
	MAGPIE_CALENDAR
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
	MAGPIE_TICKET,
	MAGPIE_ENGINE,
	MAGPIE_PROPULSOR,
	MAGPIE_POWERTRAIN,
	MAGPIE_CONTAINER 
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
	MAGPIE_CALENDAR,
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
	MAGPIE_TICKET,
	MAGPIE_STATE,
	MAGPIE_ENGINE,
	MAGPIE_PROPULSOR,
	MAGPIE_POWERTRAIN,
	MAGPIE_CONTAINER
};
MAGPIE_SERVER.meta = {}
MAGPIE_SERVER.perf = {};
MAGPIE_SERVER.perf.start = performance.now();
MAGPIE_SERVER.perf.end = NaN;
const STATE = require("./data/states");
const COMPONENTS = require("./data/components")
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
MAGPIE_SERVER.MAIL = require("./core/mailer")
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
MAGPIE_SERVER.handlers = {};
MAGPIE_SERVER.SYS._handlersPath = path.join(__dirname, "handlers");
fs.readdirSync(MAGPIE_SERVER.SYS._handlersPath)
	.forEach(file => {
		const handler = require(path.join(MAGPIE_SERVER.SYS._handlersPath, file))
		const handlerName = path.parse(file).name
		MAGPIE_SERVER.handlers[handlerName] = handler;
	})

// Register handlers
MAGPIE_SERVER.registerHandlers = (io) =>
{
	Object.keys(MAGPIE_SERVER.handlers).forEach(name => {
		const handler = MAGPIE_SERVER.handlers[name]
		io.on("connection", (socket) => 
		{
			handler(io, socket, MAGPIE_SERVER);
		});
	})
}
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
		MAGPIE_SYSTEM.refresh.call(this);
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
			this.tick_buffer(layerBase.name, Base, Base, layerBase.dt, f);
		if(switchID === 1)
		{
			this.tick_buffer(layerBase.name, Base, Game, layerBase.dt, f);
			this.tick_buffer(layerGame.name, Game, Game, layerGame.dt, f);
		}
		if(switchID === 2)
		{
			this.tick_buffer(layerBase.name, Base, TICK, layerBase.dt, f);
			this.tick_buffer(layerGame.name, Game, TICK, layerBase.dt, f);
			this.tick_buffer(layerTICK.name, TICK, TICK, layerTICK.dt, f);
		}
		if(switchID === 3)
		{
			this.tick_buffer(layerBase.name, Base, Super, layerBase.dt, f);
			this.tick_buffer(layerGame.name, Game, Super, layerBase.dt, f);
			this.tick_buffer(layerTICK.name, TICK, Super, layerBase.dt, f);
			this.tick_remote(layerSuper.name, Super, Super, layerSuper.dt, f);
			this.save()
		}
		if(switchID === 4)
		{
			this.tick_buffer(layerBase.name, Base, Mega, layerBase.dt, f);
			this.tick_buffer(layerGame.name, Game, Mega, layerBase.dt, f);
			this.tick_buffer(layerTICK.name, TICK, Mega, layerBase.dt, f);
			this.tick_remote(layerSuper.name, Super, Mega, layerBase.dt, f);
			this.tick_remote(layerMega.name, Mega, Mega, layerMega.dt, f);
		}
		if(switchID === 5)
		{
			this.tick_buffer(layerBase.name, Base, Ultra, layerBase.dt, f);
			this.tick_buffer(layerGame.name, Game, Ultra, layerBase.dt, f);
			this.tick_buffer(layerTICK.name, TICK, Ultra, layerBase.dt, f);
			this.tick_remote(layerSuper.name, Super, Ultra, layerBase.dt, f);
			this.tick_remote(layerMega.name, Mega, Ultra, layerBase.dt, f);
			this.tick_remote(layerUltra.name, Ultra, Ultra, layerUltra.dt, f);
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
MAGPIE_HIVE.tick_buffer = function tick_buffer(layerName, layerID, switchID, dt, layer_frame = 0)
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
				this.kick(entity.ID, "failed update", slot, layerID)
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
			this.kick(entityID, layerID, i);
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
// /**
//  * @desc {@link MAGPIE_HIVE.__getSlot}
//  * @param {Number} slot 
//  * @param {Number} layerID 
//  * @returns {MAGPIE_ENTITY}
//  */
// MAGPIE_HIVE.getSlot = function getSlot(slot, layerID)
// {
// 	const ePrefix = "[HIVE].getSlot: ";
// 	try
// 	{
// 		const layerName = MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name;
// 		if(!layerName)
// 			throw new Error(`${layerName} is invalid layer name`)
// 		const entity = this[layerName][slot]
// 		const valid = layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE 
// 			? entity?.ID
// 			: !isNaN(entity);
// 		if(!valid)
// 			return
// 			// throw new Error(`[LAYER-${layerID}][${slot}] is invalid entity slot`)
// 		return entity
// 	}
// 	catch(e)
// 	{
// 		MAGPIE_SERVER.error(ePrefix + e.message, e)
// 	}
// }
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
/**
 * 
 * @param {entityID} data 
 * @param {Number} layerID
 * @returns {Promise<new MAGPIE_ENTITY>}
 */
MAGPIE_HIVE._set_new_entity = async function newEntity(data, layerID)
{
	const entity = MAGPIE_HIVE._new_entity(data);
	await entity.set();
	return MAGPIE_HIVE.host(entity, layerID)
}
/**
 * 
 * @param {entity_data} data
 * @param {{
 * dummy: Boolean
 * }} options
 * @returns {new MAGPIE_ENTITY} 
 */
MAGPIE_HIVE._new_entity = function(data, dummy)
{
	const entity = new MAGPIE_ENTITY(data);
	if(dummy)
		entity.ID = 0;
	return entity
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
		if(Object.prototype.toString.call(hive?.registry) !== "[object Map]")
			throw new Error(`${hive} is invalid hive registry`)
		const entities = Array.from(hive.registry.entries())
			.filter(e => e[0] > 10);
		const layer = MAGPIE.KEY.RUNTIME.LAYER;
		entities.forEach(entry => {
			try
			{
				const entityID = entry[0];
				const record = entry[1];
				const layerID = Number(record?.layerID) || 3;
				const contexts = record?.contexts;
				const entity = MAGPIE_DATABASE.loadEntitySync(entityID);
				MAGPIE_HIVE.host(entity, layerID, layerID)
				if(contexts?.length > 0)
					record.contexts = contexts;
			}
			catch(e)
			{
				MAGPIE_SYSTEM.error(ePrefix + e.message, e)
			}
		})
		MAGPIE_SERVER.CLI._incrementLoadBar()
		MAGPIE_SERVER.log(ePrefix + `loaded ${entities.length}x entities`)
		hive.contexts.forEach(contextID => {
			MAGPIE_HIVE._host_context(MAGPIE_DATABASE.loadContextSync(contextID))
		})
		MAGPIE_SERVER.CLI._incrementLoadBar()
		MAGPIE_HIVE._validate_layers();
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
		const results = await MAGPIE_HIVE._save_buffers();
		if(!results)
			throw new Error("unable to save buffers")
		r.context.METASTATE.hive = {
			registry: MAGPIE_HIVE._registry,
			contexts: Array.from(MAGPIE_HIVE._contextBuffer.keys())
		}
		const metastate = MAGPIE_DATABASE.saveMetastate(r.context.METASTATE);
		if(!metastate) return
		const state = r.context.METASTATE;
		const message = `${results.length}x buffers saved at `
			+ `[${state.meta.updated}-${state.date.printDate()}]`
		MAGPIE_SERVER.log(ePrefix + message, "console", false)
		return results;
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
/**
 * @returns {Promise<database_result[]>}
 */
MAGPIE_HIVE._save_buffers = async function _save_buffers()
{
	const ePrefix = "[HIVE].saveBuffers: ";
	try
	{
		const entity_buffer = [];
		const entityIDs = Array.from(MAGPIE_HIVE._registry.entries())
			.filter(entry => entry[0] > 10 && entry[1].layerID < MAGPIE.KEY.HIVE.BUFFER_SIZE)
			.map(entry => entry[0])
		for(let i = 0; i < entityIDs.length; i++)
		{
			try
			{
				const entityID = entityIDs[i]
				const entity = MAGPIE_HIVE._get_entity(entityID);
				if(entity?.constructor?.name !== "MAGPIE_ENTITY")
					throw new Error(`[ENTITY-${entityID}] @ ${entity} is invalid entity`)
				const payload = MAGPIE_DATABASE.prepareEntity(entity)
				entity_buffer.push(payload);
			}
			catch(e)
			{
				MAGPIE_SERVER.error(ePrefix + e.message, e)
			}
		}
		// MAGPIE_SERVER._debug(entityIDs)
		const exp_buffer = Array.from(MAGPIE_HIVE._expBuffer.values())
			.map(value => MAGPIE_DATABASE.prepareExp(value.data))
		const key_buffer = Array.from(MAGPIE_HIVE._keyBuffer.values())
			.map(value => MAGPIE_DATABASE.prepareKey(value.data));
		const symbol_buffer = Array.from(MAGPIE_HIVE._symbolBuffer.values())
			.map(value => MAGPIE_DATABASE.prepareSymbol(value.data));
		const context_buffer = Array.from(MAGPIE_HIVE._contextBuffer.values())
			.map(value => MAGPIE_DATABASE.prepareContext(value))
		const buffers = [
			["MAGPIE_ENTITY", entity_buffer],
			["MAGPIE_EXP", exp_buffer],
			["MAGPIE_KEY", key_buffer],
			["MAGPIE_SYMBOL", symbol_buffer],
			["MAGPIE_CONTEXT", context_buffer]
		]
		// MAGPIE_SERVER._debug(buffers)
		return await MAGPIE_DATABASE.call("saveBuffers", buffers)
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
 * @typedef {import("./core/entity").entityID} entityID
 * @typedef {import("./core/entity").entity_data} entity_data
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
/**
 * 
 * @param {Number[]} output 
 * @param {MAGPIE_EXP} exp 
 * @param {MAGPIE_ENTITY} entity 
 * @param {MAGPIE_ENTITY} P_C 
 * @param {POVART} POVART1 
 * @param {Number} dt 
 * @param {Number} switchID 
 * @param {Number} layer_frame
 */
MAGPIE_ENTITY.__socketEmit = function __socketEmit(output, exp, entity, P_C, POVART1, dt, switchID, layer_frame)
{
	const ePrefix = `[ENTITY-${entity.ID}].socketEmit: `;
	try
	{
		if(!MAGPIE_PHYSICS.isValidPOVART(POVART1))
			throw new Error(`(${POVART1}) is invalid POVART₁`);
		const { P0, V0, A0 } = MAGPIE_PHYSICS.decomp_POVART(POVART1)
		const Kp = MAGPIE.KEY.POVART;
		const C = P_C;
		const P1 = entity._get_P0();
		const O1 = entity._get_O0();
		const V1 = entity._get_V0();
		// const V1hdg = MAGPIE_PHYSICS._get_V0_heading(P1, V1);
		// MAGPIE_SERVER._debug(`V1hdg: ${V1hdg}`)
		const A1 = entity._get_A0();
		const R1 = entity._get_R0();
		const T1 = entity._get_T0();
		const lat = Number(output[0]);
		const lon = Number(output[1]);
		const ASL = Number(output[2]);
		const r = Number(output[3]);
		const forces = output?.slice(4);
		const Vmag = Number(MAGPIE_PHYSICS.mag(V1));
		const Vknots = Number(MAGPIE_PHYSICS._U_MPStoKnots(Vmag));
		const Amag = Number(MAGPIE_PHYSICS.mag(A1) / dt);
		const Rmag = Number(MAGPIE_PHYSICS.mag(R1));
		const Tmag = Number(MAGPIE_PHYSICS.mag(T1) / dt);
		const normP1 = MAGPIE_PHYSICS.normalizeVector(P1);
		const unitP1mag = MAGPIE_PHYSICS.mag(normP1)
		const [roll, pitch, hdg] = unitP1mag !== 1 ? [NaN,NaN,NaN] : MAGPIE_PHYSICS._rotor_toEulerAbs(O1, P1)
		const target = entity._get_target();
		const Pt = target?.STATS?.slice(0, Kp.P_C) || [NaN,NaN,NaN]
		const validTarget = MAGPIE_PHYSICS.isValidVector(Pt);
		// MAGPIE_SERVER._debug(`output: ${output}`)
		const Ct = validTarget && r > 1 ? MAGPIE_PHYSICS.cartesianToGeodetic(Pt, r) : [NaN, NaN, NaN];
		const dist = validTarget && r > 1 ? Number(MAGPIE_PHYSICS._geod_distanceTo(P1, Pt, r)) : NaN;
		const dist2 = validTarget && r > 1 ? Number(MAGPIE_PHYSICS.distanceTo(P1, Pt)) : NaN;
		const ETA_s = Number(Math.floor(dist / Vmag));
		// MAGPIE_SERVER._debug(ETA_s)
		const ETA = !isNaN(ETA_s) ? MAGPIE_SYSTEM.Utility.printETA(ETA_s) : "N/A";
		const raw = output?.emote?.raw || output?.target?.raw || [];
		const index = MAGPIE.KEY.INDEX;
		const dR_mag = Number(raw?.dR_mag) || NaN;
		const dR = Array.isArray(raw?.dR) ? raw.dR : [NaN, NaN, NaN];
		const Bdist = Array.isArray(raw?.Bdist) ? raw.Bdist : [NaN, NaN, NaN];
		// MAGPIE_SYSTEM._logging_debug(raw)
		const form = MAGPIE_SYSTEM.Utility._format_num;
		const states = (stateID) => {return MAGPIE_STATE.INDEX.get(stateID)?.name} 
		const data = {
			switchID,
			entityID: entity.ID,
			entityName: entity.name,
			metadate: entity.updated,
			coords: [lat,lon,ASL],
			states: entity._get_states(this).map(n => states(n)),
			Vmag: Vmag,
			Vknots: Vknots,
			Amag: switchID !== 1 ? Amag : layer_frame % 10 === 0 ? Amag : undefined,
			Rmag: Rmag,
			Tmag: Tmag,
			dR_mag: dR_mag,
			dR: dR.map(n => form(n, 5, true)),
			R1: R1.map(n => form(n, 5, true)),
			T1: T1.map(n => form(n, 5, true)),
			Bdist: Bdist?.map(n => form(n, 5, true)),
			heading: hdg,
			pitch: pitch,
			roll: roll,
			CelestialBody: C.name,
			targetID: target?.ID,
			targetName: target?.name,
			targetCoords: Ct,
			distanceTo: dist,
			ETA: ETA,
			forces: forces
		};
		// MAGPIE_SERVER._debug(data.Rstate)
		const V0_mag = MAGPIE_PHYSICS.mag(V0);
		const A0_mag = MAGPIE_PHYSICS.mag(A0);
		if(!MAGPIE_ENTITY?._delta)
			MAGPIE_ENTITY._delta = Date.now();
		MAGPIE_ENTITY._delta += dt * 1000;
		io.to(`entity_${entity.ID}`).emit("entity_update", data);
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return false
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
// #region > Player
//------------------------------------------------------------------------
MAGPIE_PLAYER.__hive = async function __hive(method, arguments)
{
	const callback = MAGPIE_HIVE[method]
	return await callback(...arguments)
}
MAGPIE_PLAYER.__hiveSync = function __hiveSync(method, arguments)
{
	const callback = MAGPIE_HIVE[method]
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
/**
 * @typedef {import("./data/components").component} component
 */
MAGPIE_COMPONENT.setup = function()
{
	/** @type {Map<String, component>} */
	MAGPIE_COMPONENT.INDEX = COMPONENTS.INDEX
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
		// const db = MAGPIE_DATABASE.sync.world;
		// const sql = "SELECT label FROM MAGPIE_KEY WHERE type = ?";
		// /** @param {Enumerator<Number>} type @returns {String[]} */
		// const query = (type) => {
		// 	const results = db.prepare(sql).all(type)
		// 	return results.map(result => result.label)
		// }
		// const axioms = query(MAGPIE.KEY.TYPE.AXIOM);
		// MAGPIE_SERVER.log(`loaded ${axioms.length}x keys`);
		// MAGPIE_SERVER.CLI._incrementLoadBar();
		/** @param {Map<Number, String>} type */
		const index = (type) => {
			const start = type.get("start")
			const end = type.get("end")
			const types = Object.keys(MAGPIE.KEY.INDEX).slice(start, end + 1)
			types.forEach(label => {
				type.set(MAGPIE.KEY.INDEX[label], label)
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
MAGPIE_EXP.__hive = async function __hive(method, arguments)
{
	const callback = MAGPIE_HIVE[method];
	return await callback(...arguments)
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
		origin: "*", // Temporarily allow all for debugging
		methods: ["GET", "POST"],
		credentials: true
	},
	transports: ["polling", "websocket"],
	allowUpgrades: true
})
instrument(io, {
	auth: false,
	mode: "development"
})
app.use((req, res, next) => {
	MAGPIE_SERVER.log(`[HTTP REQUEST] ${req.method} ${req.url}`)
	next()
})
app.use(express.static(path.join(process.cwd(), "public")));
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
		next(new Error(String(MAGPIE.KEY.SERVER.HTTP.STATUS_403.code)));
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
	Object.values(MAGPIE_SERVER.handlers).forEach(handler => {
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
MAGPIE_SERVER.status = {}
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
			MAGPIE_SERVER.log(ePrefix + "save complete; terminating database worker...")
			const workerExitPromise = new Promise((resolve) => {
				MAGPIE_DATABASE.worker.once('exit', () => {
					resolve()
				})
			})
			MAGPIE_DATABASE.worker.postMessage({method: "close"})
			await workerExitPromise;
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
MAGPIE_DATABASE.setup = function setupDatabase()
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
			name: textNullable,
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
// #region - ROUTES
//========================================================================
MAGPIE_SERVER.ROUTE = {};
/**
 * @name Post
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Post
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > main get
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > main post
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Account
//------------------------------------------------------------------------
app.post("/login", MAGPIE_SERVER.public.loginLimiter, async (req, res) => {
	const ePrefix = "[APP POST].login: ";
	const { email, pass } = req.body;
	try
	{
		if(!email || !pass)
			return res.status(MAGPIE.KEY.SERVER.HTTP.STATUS_400).json({
				error: ePrefix + "Missing credentials"
			})
		const { token } = await account.verifyCredentials(email, pass, MAGPIE_SERVER)
		return res.status(MAGPIE.KEY.SERVER.HTTP.STATUS_200).json({ token })
	}
	catch(e)
	{
		const status = e.message === "Invalid credentials" 
			? MAGPIE.KEY.SERVER.HTTP.STATUS_401.code 
			: e.message === "Account is frozen" 
				? MAGPIE.KEY.SERVER.HTTP.STATUS_403.code 
				: MAGPIE.KEY.SERVER.HTTP.STATUS_500.code
		if(status === 500)
			MAGPIE_SERVER.error(ePrefix + e.message, e)
		return res.status(status).json({
			error: ePrefix + e.message
		})
	}
})
// app.get("/api/player-data", account.authenticateToken, async (req, res) => {
// 	res.json({ message: "Welcome, " + req.user.username })
// })
app.get("/verify-email", async (req, res) => {
	const ePrefix = "[HTTP]/verify-email: "
	const code = MAGPIE.KEY.SERVER.HTTP;
	const { token } = req.query;
	const db = MAGPIE_DATABASE;
	try
	{
		const printPlayer = function(ID, email, username)
		{
			const handle = email ? email : username
			return `[PLAYER-${ID} | ${handle}]`
		}
		if(!token) 
			return res.status(code.STATUS_401.code).send("<h1>Missing verification token</h1>");
		const decoded = MAGPIE_SERVER.JWT.verify(token, MAGPIE_SERVER.config.jwtSecret)
		// console.error(new Error(Object.entries(decoded)))
		const email = decoded?.email
		const username = decoded?.username
		if(!decoded.isRegistrationToken)
			return res.status(code.STATUS_400.code).send("<h1>Invalid token type</h1>")
		const existingEmail = await db.getPlayerByEmail(decoded.email)
		const existingUser = await db.getPlayerByUsername(decoded.username)
		const player = printPlayer(existingEmail?.ID || existingUser?.ID, decoded.email)
		if(!existingEmail && !existingUser)
		{
			res.status(code.STATUS_200.code).send(`<h1>Registration Complete!</h1>
					<p>Your M.A.G.P.I.E. profile is active.
					You can now close this window and login.</p>`)
			MAGPIE_SERVER.log(ePrefix + `Registration completed for ${player}.`)
			return await db.createPlayer({
				username: decoded.username,
				PASS: decoded.PASS,
				email: decoded.email
			})
		}
		if(existingEmail?.email !== email)
			return res.status(code.STATUS_409.code).send("<h1>Error</h1><p>This email has already been registered.</p>")
		if(existingUser?.username !== username)
			return res.status(code.STATUS_409.code).send("<h1>Error</h1><p>This username has already been taken.</p>")
		const isAlreadyConfirmed = `<h1>${player} created.</h1>
		<p>You already successfully used this link to confirm registration.</p>
		<p>Login with your credentials at ${MAGPIE_SERVER.config.domain}/login or within the ShelderEvolution app.</p>
		<p>You may now close this window.</p>`
		return res.status(code.STATUS_200.code).send(isAlreadyConfirmed)
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') 
			return res.status(code.STATUS_400.code).send("<h1>Verification Failed</h1><p>The link is invalid, altered, or has expired.</p>");
		res.status(500).send(MAGPIE.KEY.SERVER.MESSAGE.INTERNAL_ERROR)
	}
})
app.get("/reset-password", (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'routes', 'reset-password.html'));
})
app.post("/reset-password", async (req, res) => {
	const ePrefix = "[HTTP].resetPassword: "
	const { email } = req.body
	try
	{
		if(!email)
			return res.status(400).send("<h1>Email required</h1>")
		await account.requestPassowrdReset(email, MAGPIE_SERVER)
		res.status(200).send(`
			<h1>Recovery requested</h>
			<p>Recovery link has been sent to the provided email.</p>`)
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		res.status(500).send("<h1>Internal server error</h1><p>Please, try again later.</h1>")
	}
})
app.post("/finalize-account", async (req, res) => {
	const ePrefix = "[HTTP] "
	try
	{
		const { token, email } = req.body
		await MAGPIE_SERVER.handlers.accountHandler.account.process
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
})
app.post("/finalize-password-reset", async (req, res) => {
	try
	{
		const ePrefix = "[HTTP].finalizePasswordReset: "
		const { token, password } = req.body
		await MAGPIE_SERVER.handlers.accountHandler.account
			.processPasswordReset(token, password, MAGPIE_SERVER)
		res.status(200).redirect("/reset-password?success=true&token=" + token + "&email=" + req.body.email)
	}
	catch(e)
	{
		res.status(400).send("<h1>Reset failed</h1><p>Please, request a new link.</p>")
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
// #region > ECOSYSTEM
//------------------------------------------------------------------------
// Add this in SERVER.js where you define your other routes
// app.get("/adoption", async (req, res) => {
// 	const ePrefix = "[HTTP]/embryos: "
// 	const code = MAGPIE.KEY.SERVER.HTTP
// 	const { token } = req.query
// 	const db = MAGPIE_DATABASE
// 	try
// 	{
// 		res.sendFile(path.join(__dirname, 'public', 'routes', 'adoption.html'));
// 	}
// 	catch(e)
// 	{
// 		MAGPIE_SERVER.error(ePrefix + e.message, e)
// 	}
// })
io.on("species_embryos", async(socket, speciesID) => {
	const ePrefix = "[SOCKET] "
	try
	{
		/** @type {MAGPIE_ENTITY[]} */
		const embryos = await MAGPIE_DATABASE.call("loadWorldRow", "MAGPIE_ENTITY", {type: speciesID})
		if(!Array.isArray(embryos))
		{
			MAGPIE_SERVER.error(`${embryos} is invalid embryos list`)
			io.emit("species_embryos_error", speciesID)
		}
		if(embryos.length < 1)
			io.emit("species_embryos_empty", speciesID)
		const species = MAGPIE_DATABASE.loadSymbolSync(speciesID)
		const embryo_data = embryos.map(entity => {
			const data = {
				ID: entity.ID, 
				species: species.name,
				growth: entity.growth(),
				EVP: species._species_EVP_cost()
			}
			return data
		})
		io.emit("species_embryos_success", {speciesID, embryo_data})
		MAGPIE_SERVER.log(`${ePrefix}${embryo_data.length}x embryos data sent to [SOCKET-${socket?.id}]`)
	}
	catch(e)
	{
		MAGPIER_SERVER.error(ePrefix + e.message, e)
	}
})
io.on("adopt_creature_request", async(socket, creatureID, playerID) => {
	const ePrefix = `[SOCKET-${socket?.id}] `
	try
	{
		/** @type {MAGPIE_ENTITY} */
		const creature = MAGPIE_SERVER.ECOSYSTEM.list.get(creatureID)
		if(!creature)
			throw new Error(`unable to reconcile requested [CREATURE-${creatureID}]`)
		const player = MAGPIE_DATABASE.loadPlayerSync(playerID)
		if(!player)
			throw new Error(`unable to reconcile [PLAYER-${playerID}]`)
		player.slots.push(creature.ID)
		creature.STATS[MAGPIE.KEY.STATS.FIT] = playerID
		await creature.set()
		await player.set()
		const successMessage = ePrefix + `[PLAYER-${playerID}] adopted [CREATURE-${creatureID}]`
		io.emit("adopt_creature_success", {
			message: successMessage,
			creatureData: creature,
			playerData: player
		})
		MAGPIE_SERVER.log(successMessage)
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
		io.emit("adopt_creature_error", { message: e.message, creatureID, playerID })
	}
})
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
			return console.log(prefix + "regions not found. Skipping execution");
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
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - ECOSYSTEM
//========================================================================
MAGPIE_SERVER.ECOSYSTEM = {}
/**
 * @name 
 * @desc 
 * @typedef {import("./core/component").symbolID} symbolID
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
MAGPIE_SERVER.ECOSYSTEM.populateList = async function ()
{
	const ePrefix = "[ECOSYSTEM].populateList: "
	try
	{
		/** @todo ecosystem list */
		MAGPIE_SERVER.ECOSYSTEM.list = {}
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {symbolID} speciesID
 * @returns {Promise<MAGPIE_ENTITY>} 
 */
MAGPIE_SERVER.ECOSYSTEM.generateSpecies = async function(speciesID)
{
	const ePrefix = "[ECOSYSTEM].generateSpecies: "
	try
	{
		const species = MAGPIE_DATABASE.loadSymbolSync(speciesID)
		if(!(species instanceof MAGPIE_SYMBOL))
			throw new Error(`${species} is invalid species`)
		const pop = species.getPopulation()
		const health = species.getHealth()
		const fertility = Number(pop * health) || 0
		const generation_threshold = (fertility * 0.75)
		const generate = (Math.random() * fertility) > generation_threshold
		if(!generate)
			return
		const stats = new Array(29).concat(species._get_entity_stats())
		const traits = species._get_entity_fitness()
		const creature = new MAGPIE_ENTITY({
			type: speciesID, 
			STATS: stats,
			fitness: traits
		})
		if(!(creature instanceof MAGPIE_ENTITY))
			throw new Error(`${creature} is invalid creature`)
		await creature.set()
		return creature
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {symbolID} speciesID 
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_SERVER.ECOSYSTEM.populateSpecies = async function(speciesID)
{
	const specimens = await MAGPIE_SERVER.ECOSYSTEM.getSpecies(speciesID)
	const existing = MAGPIE_SERVER.ECOSYSTEM.filterEmbryos(specimens)
	const generation = await MAGPIE_SERVER.ECOSYSTEM.generateSpecies(speciesID)
	return existing.concat(generation)
}
/**
 * 
 * @param {symbolID} speciesID 
 * @returns 
 */
MAGPIE_SERVER.ECOSYSTEM.getSpecies = async function(speciesID)
{
	const ePrefix = "[ECOSYSTEM] "
	try
	{
		if(!Number(speciesID))
			throw new Error(`${speciesID} is invalid speciesID`)
		const specimens = await MAGPIE_DATABASE.call("loadWorldRow", "MAGPIE_ENTITY", {type: speciesID})
		if(!specimens)
			throw new Error(`unable to find any specimen of [SPECIES-${speciesID}]`)
		return specimens
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {MAGPIE_ENTITY[]} creatureList 
 */
MAGPIE_SERVER.ECOSYSTEM.filterEmbryos = function(creatureList)
{
	const ePrefix = "[ECOSYSTEM] "
	try
	{
		if(!creatureList)
			throw new Error(`${creatureList} is invalid creatureList`)
		if(creatureList.length < 1)
			MAGPIE_SERVER.log(`${creatureList} is empty`, "console", false)
		const embryo = MAGPIE.KEY.GROWTH.EMBRYO[0]
		return creatureList.filter(creature => creature.growthStage() === embryo)
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
	MAGPIE_COMPONENT.setup();
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
