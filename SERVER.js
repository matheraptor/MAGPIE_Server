/**
 * 
 * @namespace MAGPIE_Server
 * @author Matheraptor
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
// const { MAGPIE_SYSTEM } = SYSTEM;
// const { MAGPIE_RUNTIME } = SYSTEM;
// const { MAGPIE_HIVE } = SYSTEM;
const { MAGPIE_PHYSICS } = require("./core/physics");
const { 
	MAGPIE_COMPONENT, 
	MAGPIE_EXP, 
	MAGPIE_KEY,
	MAGPIE_EMOTE,
	MAGPIE_STATE 
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
	MAGPIE_PHYSICS,
	MAGPIE_COMPONENT,
	MAGPIE_EXP,
	MAGPIE_KEY,
	MAGPIE_ENTITY,
	MAGPIE_PLAYER,
	MAGPIE_DATABASE
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
	r.displayPrompt();
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
 * @param {*} guest 
 * @param {Number} layerID 
 * @param {Number} switchID
 * @returns 
 * 
 * @desc {@link }
 */
MAGPIE_RUNTIME.prototype.guestRefresh = async function guestRefresh(guest, layerID, switchID)
{
	const system = r.context[guest];
	if(!system || isNaN(layerID)) return
	const pass = system.refresh(layerID, switchID)
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
 * @desc {@link MAGPIE_HIVE.__refresh}
 * @param {Number} layerID
 * @param {Number} switchID
 * 
 * @returns {Promise<Boolean>} 
 */
MAGPIE_HIVE.prototype.refresh = async function refresh(layerID, switchID)
{
	const ePrefix = "[HIVE].refresh: ";
	try
	{
		for(let i = 0; i <= switchID; i++)
		{
			layerID = i;
			const layerStandard = 2;
			const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
			const layerName = K.name;
			const dt = K.delta;
			if(layerID < layerStandard)
			{
				await this.tick_buffer(layerName, layerID, switchID, dt);
				continue
			}
			if(switchID < layerStandard && layerID < layerStandard) continue
			await this.tick_remote(layerName, layerID, switchID, dt);
		}
		if(switchID < 3) return
		await this.save()
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
MAGPIE_HIVE.prototype.tick_buffer = async function tick_buffer(layerName, layerID, switchID, dt)
{
	const ePrefix = "[HIVE].tick_buffer: ";
	const layer = this[layerName];
	const slots = MAGPIE.KEY.RUNTIME.LAYER.get(layerID).slots;
	for(let i = 0; i < slots; i++)
	{
		try
		{
			const slot = i;
			/** @type {MAGPIE_ENTITY} */
			const entry = this.getSlot(slot, layerID)
			if(!entry) return
			const entity = layerID < 2 ? entry : this.loadEntitySync(entry);
			if(entity.type < 1) return
			const pass = await entity.refresh(switchID, dt)
			if(!pass) this.kick(entity.ID, layerID);
		}
		catch(e)
		{
			MAGPIE_SERVER.error(ePrefix + e.message, e)
		}
	}
}

MAGPIE_HIVE.prototype.tick_remote = async function tick_remote(layerName, layerID, switchID, dt)
{
	const ePrefix = "[HIVE].tick_remote: ";
	for(let i = 0; i < this[layerName].length; i++)
	{
		const entityID = this[layerName][i];
		try
		{
			if(isNaN(entityID))
				this[layerName][i] = 0;
			if(!entityID) return
			const entity = this.loadEntitySync(entityID);
			if(!entity instanceof MAGPIE_ENTITY)
				throw new Error(`[ENTITY-${entityID}] is invalid entity`)
			const pass = await entity.refresh(switchID, dt);
			if(!pass) 
				throw new Error(`[ENTITY-${entityID}] has failed to refresh`)
			const save = this.saveEntitySync(entity);
			if(!save)
				throw new Error(`unable to update [ENTITY-${this.ID}]`)
			return true
		}
		catch(e)
		{
			MAGPIE_SERVER.error(ePrefix + e.message, e)
			this.kick(entityID, layerID);
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
MAGPIE_HIVE.prototype.getSlot = function getSlot(slot, layerID)
{
	const ePrefix = "[HIVE].isValidSlot: ";
	try
	{
		const entity = this[MAGPIE.KEY.RUNTIME.LAYER.get(layerID)?.name][slot]
		const valid = layerID < 2 ? (entity instanceof MAGPIE_ENTITY) : isNaN(entity);
		if(!valid)
			throw new Error(`[LAYER-${layerID}][${slot}] is invalid entity slot`)
		return entity
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {expID} expID
 * @returns {MAGPIE_EXP} 
 */
MAGPIE_HIVE.prototype.getEXP = function getEXP(expID)
{
	const entry = this._registry.get(expID);
	const index = entry?.index;
	return this._expBuffer[index];
}
/**
 * 
 * @param {entityID} entityID 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.prototype.getEntity = function getEntity(entityID)
{
	const ePrefix = "[HIVE].getEntity: ";
	try
	{
		const entry = this._registry.get(entityID);
		if(!entry || entry?.layerID >= 2) 
			return MAGPIE_DATABASE.loadEntitySync(entityID);
		const index = entry.slot;
		const layer = MAGPIE.KEY.RUNTIME.LAYER.get(entry.layerID);
		return this[layer.name][index];
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
// #region host
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_ENTITY} entity 
 * @param {Number} layerID 
 * @param {Number} targetLayerID 
 * @returns {void}
 */
MAGPIE_HIVE.prototype.host = function host(entity, layerID, targetLayerID)
{
	const ePrefix = "[HIVE].host: ";
	try
	{
		if(!(entity instanceof MAGPIE_ENTITY))
			throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
		const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
		const layerName = K?.name;
		const slot = this.nextSlot(layerID);
		if(isNaN(slot))
			throw new Error(`[LAYER-${layerID}] is full`);
		this[layerName][slot] = layerID < 2 ? entity : entity.ID;
		this._registry.set(entity.ID, {
			layerID: layerID,
			slot: slot,  
			target: targetLayerID, 
			retain: true
		});
		const layerRecord = this._registry.get(layerID);
		layerRecord.nextSlot = (slot + 1) <= K.slots ? slot + 1 : -1
		this._registry.set(layerID, layerRecord);
		const message = `[HIVE].hosting [ENTITY-${entity.ID}] on `
			+ `[${layerName}][${slot}] with target [LAYER-${targetLayerID}]`
		return MAGPIE_SYSTEM.log(ePrefix + message, null, true)
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
MAGPIE_HIVE.prototype.kick = function kick(entityID, reason = "dev")
{
	const ePrefix = "[HIVE].kick: ";
	try
	{
		const entry = this._registry.get(entityID);
		const layerID = entry?.layerID
		const index = entry?.slot;
		const K = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
		if(!K)
			throw new Error(`[LAYER-${layerID}], for [ENTITY-${entityID}], is invalid layer`)
		const layerName = K.name;
		if(!this[layerName][index])
			throw new Error(`[ENTITY-${entityID}] not at ${layerName}[${index}]`);
		const layerRecord = this._registry.get(layerID);
		const lastSlot = K.slots - 1;
		const nextSlot = layerRecord.nextSlot - 1;
		const entity = this[layerName][index];
		this[layerName][index] = this[layerName][lastSlot];
		this[layerName][lastSlot] = layerID < 2 ? new MAGPIE_ENTITY() : 0;
		layerRecord.nextSlot = nextSlot;
		this._registry.delete(entityID);
		this._registry.set(layerID, layerRecord);
		this[layerRecord.name][layerRecord.nextSlot] = new MAGPIE_ENTITY();
		const message = `[ENTITY-${entityID}] kicked from ${layerName}, reason: `
		let logToConsole = false;
		if(reason === "move")
			logToConsole = true;
		MAGPIE_SERVER.log(message + reason, "console", logToConsole);
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
 * @param {Number} layerB_ID 
 * @param {Number} targetLayerID 
 */
MAGPIE_HIVE.prototype.move = function move(entityID, layerB_ID, targetLayerID = NaN)
{
	const ePrefix = "[HIVE].move: ";
	try
	{
		const entry = this._registry.get(entityID);
		if(!entry)
			throw new Error(`[ENTITY-${entityID}] not in registry`);
		const layerID = entry.layerID;
		const slot = entry.slot;
		const layerA = MAGPIE.KEY.RUNTIME.LAYER.get(layerID);
		const layerB = MAGPIE.KEY.RUNTIME.LAYER.get(layerB_ID);
		const nextSlot = this.nextSlot(layerB_ID);
		if(isNaN(nextSlot)) 
			throw new Error(`${layerB.name} is full`)
		const kicked = this.kick(entityID, "move");
		let entity = null;
		if(kicked instanceof MAGPIE_ENTITY)
			entity = kicked;
		else entity = this.loadEntitySync(entityID);
		if(isNaN(targetLayerID))
			targetLayerID = layerB_ID
		this.host(entity, layerB_ID, targetLayerID)
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
// #region boot
//------------------------------------------------------------------------
MAGPIE_HIVE.prototype.setup = function setup()
{
	const K = MAGPIE.KEY.RUNTIME.LAYER;
	const layerBase = K.get(0).name;
	const layerGame = K.get(1).name;
	const layerStandard = K.get(2).name;
	const layerSuper = K.get(3).name;
	const layerMega = K.get(4).name;
	const layerUltra = K.get(5).name;
	this[layerBase] = new Array(K.get(0).slots).fill(new MAGPIE_ENTITY());
	this[layerGame] = new Array(K.get(1).slots).fill(new MAGPIE_ENTITY());
	this._registry.set(0, {name: layerBase, 	nextSlot: 0});
	this._registry.set(1, {name: layerGame, 	nextSlot: 0});
	this._registry.set(2, {name: layerStandard, nextSlot: 0});
	this._registry.set(3, {name: layerSuper, 	nextSlot: 0});
	this._registry.set(4, {name: layerMega, 	nextSlot: 0});
	this._registry.set(5, {name: layerUltra, 	nextSlot: 0});
	return true
}
/**
 * 
 * 
 */
MAGPIE_HIVE.prototype.awake = async function awake()
{
	MAGPIE_HIVE.__awake.call(this);
	const ePrefix = `[HIVE].awake: `;
	try
	{
		if(this.isActive) return
		const hive = r.context["METASTATE"]?.hive;
		const valid = Object.prototype.toString.call(hive) === "[object Map]";
		const hydrated = hive.get(0)?.name === MAGPIE.KEY.RUNTIME.LAYER.get(0).name;
		if(valid && hydrated)
			this._registry = hive;
		const list = Array.from(this._registry.entries())
			.filter(e => e[0] > 10 && e[1].layerID < 2);
		const base = list.filter(e => e[1].layerID === 0);
		const game = list.filter(e => e[1].layerID === 1);
		const layerBase = MAGPIE.KEY.RUNTIME.LAYER.get(0);
		const layerGame = MAGPIE.KEY.RUNTIME.LAYER.get(1);
		const base_entities = this.loadEntities(base.map(e => e[0]));
		const game_entities = this.loadEntities(game.map(e => e[0]));
		if(base_entities.length > 0)
			base_entities.forEach(e => {
				const entityID = e.ID;
				const index = this._registry.get(entityID).slot
				this[layerBase.name][index] = e;
			});
		const base_message = `loaded ${base_entities.length} entities into ${layerBase.name}`
		MAGPIE_SERVER.log(ePrefix + base_message, null, true)
		if(game_entities.length > 0)
			game_entities.forEach(e => {
				const entityID = e.ID;
				const index = this._registry.get(entityID).slot;
				this[layerGame.name][index] = e;
			})
		const game_message = `loaded ${game_entities.length} entities into ${layerGame.name}`;
		MAGPIE_SERVER.log(ePrefix + game_message, null, true)
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e);
		this.pause();
	}
}
MAGPIE_HIVE.prototype.save = async function save()
{
	const ePrefix = "[HIVE].save: ";
	try
	{
		const result = await this.saveEntities()
		r.context.METASTATE.hive = this._registry;
		const metastate = MAGPIE_DATABASE.saveMetastate(r.context.METASTATE);
		if(!metastate) return
		const state = r.context.METASTATE;
		const message = `${result}x entities saved at `
			+ `[${state.meta.updated}-${state.date.printDate()}]`
		MAGPIE_SERVER.log(ePrefix + message)
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
MAGPIE_HIVE.prototype.saveEntities = async function saveEntities()
{
	const ePrefix = "[HIVE].saveEntities: ";
	try
	{
		const base = this._GuestsBase.filter(entity => entity.type > 0);
		const game = this._GuestsGame.filter(entity => entity.type > 0);
		console.log(base.length)
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
		return base.length + game.length
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
 * @desc {@link MAGPIE_HIVE.__loadEntitySync}
 * @param {entityID} entityID 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_HIVE.prototype.loadEntitySync = function loadEntitySync(entityID)
{
	return MAGPIE_DATABASE.loadEntitySync(entityID);
}
/**
 * 
 * @param {entityID} entityID 
 * @returns {Promise<MAGPIE_ENTITY>}
 */
MAGPIE_HIVE.prototype.loadEntity = async function loadEntity(entityID)
{
	return await MAGPIE_DATABASE.loadEntity(entityID)
}
/**
 * @typedef {import("./core/database_worker").database_result} database_result
 * @param {MAGPIE_ENTITY} entity 
 * @returns {Promise<database_result>}
 */
MAGPIE_HIVE.prototype.saveEntity = async function saveEntity(entity)
{
	return await MAGPIE_DATABASE.saveEntity(entity)
}
/**
 * @desc {@link MAGPIE_HIVE.__saveEntitySync}
 * @param {MAGPIE_ENTITY} entity 
 * @returns {database_result}
 */
MAGPIE_HIVE.prototype.saveEntitySync = function saveEntitySync(entity)
{
	return MAGPIE_DATABASE.saveEntitySync(entity);
}
/**
 * 
 * @desc {@link MAGPIE_HIVE.__loadEntities}
 * @param {entityID[]} entityIDs
 * @returns {MAGPIE_ENTITY[]} 
 */
MAGPIE_HIVE.prototype.loadEntities = function loadEntities(entityIDs)
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
 * @param {[String, ...args]} payload 
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._set_relation = async function _set_relation(payload)
{
	return await MAGPIE_DATABASE.call("setRow", payload)
}
/**
 * @desc {@link MAGPIE_ENTITY.__getEXP}
 * @typedef {import("./data/entity_types").expID} expID
 * @param {expID} expID 
 * 
 */
MAGPIE_ENTITY._hive_getEXP = function _hive_getEXP(expID)
{
	const regEXP = MAGPIE_SERVER.HIVE.getEXP(expID);
	if(regEXP instanceof MAGPIE_EXP) return regEXP;
	MAGPIE_DATABASE.loadExpSync(expID);
}
/**
 * 
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY} 
 */
MAGPIE_ENTITY._hive_getEntitySync = function _hive_getEntitySync(entityID)
{
	return r.context.HIVE.getEntity(entityID);
}
/**
 *
 * @param {entityID} entityID 
 * @returns {Promise<MAGPIE_ENTITY>}
 */
MAGPIE_ENTITY._hive_getEntity = async function _hive_getEntity(entityID)
{
	return await MAGPIE_DATABASE.loadEntity(entityID);
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity 
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._hive_setEntity = async function _hive_setEntity(entity)
{
	return await MAGPIE_DATABASE.saveEntity(entity);
}
/**
 * 
 * @param {String} rT name of relatives table
 * @param {String} pK name of parent foreign key
 * @param {String} fK name of child foreign key
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY._hive_getRelatives = async function _hive_getRelatives(rT, pK, fK)
{
	const ePrefix = `[ENTITY-${this.ID}].getRelatives: `;
	try
	{
		const payload = [this.ID, pK, fK, rT, "MAGPIE_ENTITY"]
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
 * @param {expID} expID 
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_ENTITY._hive_getEXPkeys = function _hive_getEXPkeys(expID)
{
	const ePrefix = `[ENTITY-${this.ID}].getEXPkeys: `;
	try
	{
		const payload = [exp.ID, "expID", "keyID", "exp_keys", "MAGPIE_EXP"]
		const recall = MAGPIE_DATABASE.sync.getWorldRelatedRows(...payload);
		if(!recall || recall?.length < 1)
			throw new Error(`unable to fetch keys for [EXP-${expID}]`)
		return recall
	}
	catch(e)
	{
		MAGPIE_SERVER.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {{
 * POVART1: {P1: vector3, O1: rotor, V1: vector3, A1: vector3, R1: bivector, T1: bivector},
 * STATS: Float64Array,
 * POVART_t: { Pt: vector3 , Ot: rotor, Vt: vector3, At: vector3, Rt: bivector, Tt: bivector },
 * exp: MAGPIE_EXP,
 * geodetic: {
 * lat: angle_deg,
 * lon: angle_deg,
 * ASL: distance,
 * C: MAGPIE_ENTITY,
 * r: Number,
 * forces: Float64Array
 * }
 * }} output 
 * @param {MAGPIE_ENTITY} entity
 */
MAGPIE_ENTITY.__socketEmit = function __socketEmit(output, entity)
{
	const ePrefix = `[ENTITY-${entity.ID}].socketEmit: `;
	try
	{
		const Kp = MAGPIE.KEY.POVART;
		const {lat,lon,ASL,forces} = output.geodetic;
		const { P1, O1, V1, A1, R1, T1 } = output.POVART1;
		const [] = forces;
		const Vspeed = MAGPIE_PHYSICS.mag(V1);
		const Vknots = MAGPIE_PHYSICS._U_MPStoKnots(Vspeed);
		const Acc = MAGPIE_PHYSICS.mag(A1);
		const hdg = MAGPIE_PHYSICS._rotor_toHeadingAbs(O1);
		const POVART_t = output.POVART_t;
		const Pt = POVART_t?.Pt || [0,0,0]
		const r = output.geodetic.r;
		const Ct = MAGPIE_PHYSICS.cartesianToGeodetic(Pt, r);
		const dist = MAGPIE_PHYSICS._geod_distanceTo(P1, Pt, r || 1);
		const ETA_s = Math.floor(dist / Vspeed);
		const ETA = MAGPIE_SYSTEM.Utility.printETA(ETA_s);
		const data = {
			entityID: entity.ID,
			entityName: entity.name,
			metadate: entity.updated,
			coords: [lat,lon,ASL],
			Vspeed: Vspeed,
			Vknots: Vknots,
			Acceleration: Acc,
			Heading: hdg,
			CelestialBody: output.geodetic.C.name,
			targetCoods: Ct,
			distanceTo: dist,
			ETA: ETA
		};
		io.to(`entity_${entity.ID}`).emit("entity_update", data);
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
// #region > Metastate
//------------------------------------------------------------------------
MAGPIE_SERVER.SYS._metastate_tick_base = MAGPIE_METASTATE._TICK_base;
MAGPIE_METASTATE.prototype.TICK_base = async function TICK_base(layerID, switchID)
{
	MAGPIE_SERVER.HIVE.refresh(layerID, switchID);
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
	Object.keys(MAGPIE_SERVER.context).forEach(k => {
		r.context[k] = MAGPIE_SERVER.context[k];
		MAGPIE_SERVER.CLI._incrementLoadBar();
	})
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
		origin: MAGPIE.KEY.SERVER.DOMAIN,
		methods: ["GET", "POST"]
	},
	transports: ["websocket"],
	allowUpgrades: false
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
	const message = "[BOOT].shutdown: ";
	MAGPIE_SERVER.CLI._createLoadBar();
	MAGPIE_SERVER.CLI._updateLoadBar();
	MAGPIE_SERVER.log(message + `[SIGNAL-${signal}] received: initiating shutdown sequence...`);
	if(io)
	{
		await io.close((err) => {
			if(err) MAGPIE_SERVER.log(message + "[io] " + err.message);
			MAGPIE_SERVER.log("Socket.io server closed.", false);
			MAGPIE_SERVER.CLI._incrementLoadBar(10);
			MAGPIE_SERVER.SERVER.close((err) => {
				if(err) MAGPIE_SERVER.log(message + "[express] ", err.message);
				MAGPIE_SERVER.log("HTTP server closed.", false);
				MAGPIE_SERVER.CLI._incrementLoadBar(10);
				MAGPIE_SERVER.CLI._updateLoadBar(100);
				MAGPIE_SERVER.log(message + "sequence complete. Exiting...\n" + 
					"----------------------------------\n\n"
				)
				MAGPIE_SERVER.CLI._stop();
				return process.exit(signal);
			})
		});
		setTimeout(() => {
			const error = new Error(`Shutdown timeout: forcing shutdown...
				-------------------------------\n\n`);
			MAGPIE_SERVER.error(error.message, error);
			return process.exit(0);
		}, 10000);
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
	const integerKey = "INTEGER PRIMARY KEY";
	const foreignKey = " FOREIGN KEY";
	const blob = "JSON NOT NULL";
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
			updated: integer,
			compundID: integer,
			hostID: integer,
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
			fk1: "FOREIGN KEY (compoundID) REFERENCES MAGPIE_ENTITY(ID)",
			fk2: "FOREIGN KEY (componentID) REFERENCES MAGPIE_ENTITY(ID)"
		})
		tables.set("entity_components", entity_components);
		const entity_equips = this.sync.createWorldTable("entity_equips", {
			hostID: integer,
			equipID: integer,
			"PRIMARY KEY": "(hostID, equipID)",
			fk1: "FOREIGN KEY (hostID) REFERENCES MAGPIE_ENTITY(ID)",
			fk2: "FOREIGN KEY (equipID) REFERENCES MAGPIE_ENTITY(ID)"
		})
		tables.set("entity_equips", entity_equips);
		const events = this.sync.createWorldTable("MAGPIE_EVENT", {
			ID: integerKey,
			type: integer,
			parentID: integer,
			status: integer,
			updated: integer,
			data: blob
		})
		tables.set("events", events);
		const event_children = this.sync.createWorldTable("event_children", {
			eventID: integer,
		})
		const keys = this.sync.createWorldTable("MAGPIE_KEY", {
			ID: integerKey,
			type: integer,
			data: blob
		});
		tables.set("keys", keys);
		const exps = this.sync.createWorldTable("MAGPIE_EXP", {
			ID: integerKey,
			subjectID: integer,
			targetID: integer,
			data: blob
		})
		tables.set("exps", exps);
		const exp_keys = this.sync.createWorldTable("EXP_KEYS", {
			expID: integer,
			keyID: integer,
			"PRIMARY KEY": "(expID, keyID)",
			fk1: "FOREIGN KEY (expID) REFERENCES MAGPIE_EXP(ID)",
			fk2: "FOREIGN KEY (keyID) REFERENCES MAGPIE_KEY(ID)"
		})
		tables.set("exp_keys", exp_keys);
		const metastate = this.sync.createWorldTable("MAGPIE_METASTATE", {
			key: textKey,
			data: blob
		});
		tables.set("metastate", metastate);
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
MAGPIE_SERVER.CLI._createLoadBar();
MAGPIE_SERVER.CLI._updateLoadBar(0);
MAGPIE_SERVER._REPL_boot();
MAGPIE_SERVER.RUNTIME = new MAGPIE_RUNTIME();
MAGPIE_SERVER.DATABASE = MAGPIE_DATABASE;
MAGPIE_SERVER.log("loading data...", null, true);
MAGPIE_EMOTE.setup();
MAGPIE_STATE.setup();
MAGPIE_SERVER.CLI._incrementLoadBar(5);
/** @type {MAGPIE_HIVE} */
MAGPIE_SERVER.HIVE = new MAGPIE_HIVE();
MAGPIE_SERVER.HIVE.setup();
/** @type {new MAGPIE_METASTATE} */
MAGPIE_SERVER.METASTATE = null;
MAGPIE_SERVER.CLI._incrementLoadBar(5);
r.context.SERVER = MAGPIE_SERVER;
r.context.RUNTIME = MAGPIE_SERVER.RUNTIME;
r.context.HIVE = MAGPIE_SERVER.HIVE;
r.context.DATABASE = MAGPIE_SERVER.DATABASE;
r.context.PHYSICS = MAGPIE_PHYSICS;
MAGPIE_SERVER.CLI._updateLoadBar(20);
r.context.io = io;
MAGPIE_SERVER.BOOT.connect()
	.then(() => {
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
		
	});
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