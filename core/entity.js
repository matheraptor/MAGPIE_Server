/**
 * @name INDEX
 * @desc 
 * @param {{
 * name: String,
 * type: Enumerator<Number>,
 * parents: entityID[],
 * children: entityID[],
 * STATS: entity_stats,
 * fitness: entity_fitness,
 * exps: MAGPIE_EXP[],
 * host: entityID,
 * equip: entityID[]
 * }} data
 * @returns {new MAGPIE_ENTITY}
 * 
 */
//========================================================================
// #region - INDEX
//========================================================================
function MAGPIE_ENTITY(data = {})
{
	this.initialize(data)
}
const { MAGPIE } = require("./index");
const { MAGPIE_SYSTEM } = require("./system");
const { 
	MAGPIE_STATE, 
	MAGPIE_EMOTE, 
	MAGPIE_EXP,
	MAGPIE_KEY: MAGPIE_KEY,
	MAGPIE_CONTEXT,
	MAGPIE_COMPONENT,
	MAGPIE_SYMBOL
} = require("./component");
const STATE = require("../data/states")
const { MAGPIE_PHYSICS } = require("./physics");
const ENTITY_TYPES = require("../data/entity_types");
/**
 * 
 * @typedef {import("./index").duration} duration
 */
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name Entity
 * @desc 
 * 
 */
//========================================================================
// #region - ENTITY
//========================================================================
MAGPIE_ENTITY.meta = {};
/**
 * @name Static
 * @desc 
 * 
 * @version 0.20.6
 * 
 * @changelog 
 * 
 * @version 0.20.6
 * - ADDED: destructure/recompose POVART with new POVART+ORBIT+STATS format
 * - ADDED: placeholder hive helpers link helpers in SERVER.js 
 * 
 */
//------------------------------------------------------------------------
// #region > Static
//------------------------------------------------------------------------
/**
 * @typedef {import("./index").key_stats} key_stats
 * @param {STATS} STATS 
 * @returns {key_stats}
 */
MAGPIE_ENTITY._stat_destructure = function statDestructure(STATS)
{
	const K = MAGPIE.KEY.STATS;
	const statsSize = K.ARRAY - MAGPIE.KEY.POVART.ARRAY;
	const stats = Object.keys(K).slice(1, statsSize + 1);
	const result = {};
	stats.forEach((key, index) => {
		result[key] = STATS[index]
	})
	return result
}
MAGPIE_ENTITY._povart_destructure = function povartDestructure(POVART)
{
	const K = MAGPIE.KEY.POVART;
	const keys = Object.keys(K).slice(1, K.ARRAY + 1);
	const result = {};
	keys.forEach((key, index) => {
		result[key] = POVART[index]
	})
	return result
}
/**
 * 
 * @param {entity_stats} entity_stats 
 * @returns { {POVART: POVART, STATS: STATS } }
 */
MAGPIE_ENTITY._stats_destructure = function statsDestructure(entity_stats)
{
	const K = MAGPIE.KEY.POVART;
	const POVART = entity_stats.slice(0, K.ARRAY + 1);
	const STATS = entity_stats.slice(K.ARRAY + 1)
	return { POVART, STATS }
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {Promise<database_result>} 
 */
MAGPIE_ENTITY.__hive = async function __hive(method, arguments)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {*} arguments
 * @returns {*} 
 */
MAGPIE_ENTITY.__hiveSync = function __hiveSync(method, arguments)
{
	//
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {Boolean} 
 */
MAGPIE_ENTITY._hive_setEntitySync = function _hive_setEntitySync(entity)
{
	return MAGPIE_ENTITY.__hiveSync("_set_entitySync", [entity])
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<Boolean>} 
 */
MAGPIE_ENTITY._hive_setEntity = async function _hive_setEntity(entity)
{
	return await MAGPIE_ENTITY.__hive("_set_entity", [entity]);
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {Promise<database_result>} 
 */
MAGPIE_ENTITY._hive_setExp = async function _hive_setExp(exp)
{
	return await MAGPIE_ENTITY.__hive("_set_exp", [exp])
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {database_result} 
 */
MAGPIE_ENTITY._hive_setExpSync = function _hive_setExpSync(exp)
{
	return MAGPIE_ENTITY.__hiveSync("_set_expSync", [exp])
}
/**
 * 
 * @param {STATS} STATS 
 * @returns {Boolean}
 */
MAGPIE_ENTITY.isValidSTATS = function isValidSTATS(STATS)
{
	const size = MAGPIE.KEY.STATS.ARRAY;
	if(!STATS || STATS?.length !== size || STATS.some(n => isNaN(n)))
		return false
	return true	
}
/**
 * 
 * @param {entity_stats} stats 
 * @returns 
 */
MAGPIE_ENTITY.isValidEntityStats = function isValidEntityStats(stats)
{
	const size = MAGPIE.KEY.STATS.ARRAY - MAGPIE.KEY.POVART.ARRAY;
	if(!stats || stats?.length !== size || stats.some(n => isNaN(n)))
		return false
	return true
}
/**
 * 
 * @param {POVART} POVART
 * @returns {Boolean} 
 */
MAGPIE_ENTITY.isValidPOVART = function isValidPOVART(POVART)
{
	//
}
MAGPIE_ENTITY.isValidFitness = function isValidFitness(fitness)
{
	if(!fitness || fitness?.length < 1 || fitness.some(n => isNaN(n)))
		return false
	return true
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {Boolean} 
 */
MAGPIE_ENTITY.isValidCelestial = function isValidCelestial(entity)
{
	const K = MAGPIE.KEY.ENTITY.TYPE;
	const celestial = K.get("CELESTIAL").type;
	const materia = K.get("MATERIA").type;
	if(!entity || entity.type < celestial || entity.type >= materia)
		return false
	return true
}
/**
 * 
 * @param {entityID[]} property 
 * @param {String} propertyName property of the depdendencies on this entity 
 * @param {String} dependencyName property on the dependencies of this entity
 */
MAGPIE_ENTITY._setDependency = async function setDependency(property, propertyName, dependencyName)
{
	if(!property?.length < 1 || property.some(n => isNaN(n)))
		throw new Error(`${property} is invalid ${propertyName}`);
	let list = [];
	for(const ID of property)
	{	
		const entity = await MAGPIE_ENTITY.__hive("_get_entity", ID);
		if(entity instanceof MAGPIE_ENTITY) list.push(entity);
	}
	if(list.length < property.length)
		throw new Error(`could not fetch all ${propertyName}`);
	let errors = [];
	for(const entity of list)
	{
		entity[dependencyName].push(this.ID);
		const result = await MAGPIE_ENTITY._hive_setEntity(entity);
		if(!result)
			errors.push(entity.ID);
	}
	if(errors.length > 0)
		throw new Error(`could not set ${dependencyName} for ${propertyName}[${errors}]`)
}
// #endregion
//------------------------------------------------------------------------

/**
 * @name Proto
 * @desc 
 * 
 * @version 0.20.6
 * 
 * @changelog
 * 
 * @version 0.20.6
 * - ADDED: new format and functionality
 * - TWEAKED: "@" is now "_firmware"
 * - TWEAKED: ".created", ".updated", "".saved", and ".metadate" all combined 
 * into ".updated" as type epoch_real_s
 * - TWEAKED: ".POVART" and ".STATS" combined together into ".STATS"
 * - TWEAKED: ".traits", "_reserve", ".states", "._discard", "._injury",
 * "._stamina", combined into ".fitness", with "".ID" at index 0, and "deckSize"
 * at index 1
 * - TWEAKED: ".inventory" and ".equip" combined into ".equip"
 * - TWEAKED: ".sensors" and ".emitters" removed, and their logic integrated
 * as trait cards
 * - TWEAKED: "._vault" removed and its logic integrated into ".exps" for
 * the buffer and using exp aggregation so that STM and LTM is now an
 * emergent property of the ".exps" buffer cycle
 * 
 * @typedef {Number} entityID Date.now()
 * @typedef {import("./physics").POVART} POVART [
 * ...P, 
 * ...orbit_data, 
 * P_C, 
 * ...O, 
 * ...V, 
 * ...A, 
 * ...R, 
 * ...T, 
 * E_ID
 * ]
 * @typedef {Float64Array} STATS POVART + STATS
 * @typedef {Number} deckSize
 * @typedef {Float64Array} entity_fitness 
 * [
 * E_ID, 
 * deckSize, 
 * ...traitID[], 
 * ...stateID[], 
 * ...equipID[],
 * ...wasteIndex[], 
 * ...injuryID[],
 * ...staminaIndex[]
 * ]
 * @typedef {Number[]} entity_stats 
 * @typedef {Number[]} entity_povart
 * @typedef {Number[]} entity_params
 * @typedef {Enumerator<Number>} entity_type {@link MAGPIE.KEY.ENTITY.TYPE}
 * @typedef {import("./index").orbit_data} orbit_data
 * @typedef {import("./index").orbit} orbit [a,e,i,raan,aop,nu,T0,M0]
 * @typedef {Number[]} fitness
 * @typedef {import("./index").epoch_real_s} epoch_real_s time in s since epoch J2000
 * @typedef {import("../data/entity_types").traitID} traitID 
 * @typedef {Number} stateID
 * @typedef {Number} wasteIndex
 * @typedef {Number} injuryID
 * @typedef {Number} staminaIndex 
 * @typedef {import("../data/entity_types").expID} expID
 * @typedef {import("./index").distance} distance
 * @typedef {import("./index").ratio} ratio
 * @typedef {import("./index").angle_rad} angle_rad
 * @typedef {import("./index").vector3} vector3
 * @typedef {import("./index").bivector} bivector
 * @typedef {import("./index").rotor} rotor
 * @typedef {import("./index").angle_deg} angle_deg
 * @typedef {import("./index").acceleration} acceleration
 * @typedef {import("./index").force} force
 * @typedef {angle_deg} lat
 * @typedef {angle_deg} lon
 * @typedef {distance} ASL
 * @typedef {{
 * name: String,
 * type: Enumerator<Number>,
 * parents: entityID[],
 * children: entityID[],
 * STATS: [...entity_povart, ...entity_stats],
 * fitness: entity_fitness,
 * exps: MAGPIE_EXP[],
 * host: entityID,
 * equip: entityID[]
 * }} entity_data
 * @typedef {Number} fitness_index this.fitness[index]
 * 
 * 
 * @typedef {import("./system").database_result} database_result
 * @typedef {import("./index").keyID} keyID
 * @typedef {import("./component").emoteID} emoteID
 * 
 * @param {entity_data} data
 * @returns {new MAGPIE_ENTITY}
 * 
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_ENTITY.prototype.initialize = function initialize(data)
{
	const now = Date.now();
	this._firmware = "MAGPIE_ENTITY";
	/** @type {entityID} */
	this.ID = now;
	this.name = String(data?.name);
	/** @type {entity_type} @desc {@link MAGPIE.KEY.ENTITY.TYPE}*/
	this.type = Number(data?.type || 0);
	/** @type {epoch_real_s} time in s since epoch J2000 */
	this.updated = now;
	/** @type {STATS} @desc {@link MAGPIE.KEY.STATS.meta} */
	this.STATS = new Float64Array(0);
	/** 
	 * @type {entity_fitness} 
	 * @desc {@link MAGPIE.KEY.TRAIT} {@link MAGPIE.KEY.ECG} 
	 * 
	 **/
	this.fitness = [];
	/** @type {expID[]} */
	this.exps = [];
	setTimeout(() => {this.setup(data)}, 1000);
}
MAGPIE_ENTITY.prototype.isValid = function isValid()
{
	return true
}
MAGPIE_ENTITY.prototype._stat_endurance = function _stat_endurance()
{
	const K = MAGPIE.KEY.STATS;
	return this.STATS[K.END]
}
/**
 * 
 * @param {entity_data} data 
 */
MAGPIE_ENTITY.prototype.setup = async function setup(data)
{
	if(this.type < 1) return
	this.birth = Number(data?.birth) || 0;
	this.setupSTATS(data?.STATS);
	await this.setupParents();
	await this.setupCompound();
	await this.setupHost();
	this.setupFitness(data?.fitness);
}
/**
 * 
 * @param {[...entity_povart, ...entity_stats]} STATS 
 * @returns 
 */
MAGPIE_ENTITY.prototype.setupSTATS = function setupSTATS(STATS)
{
	if(!STATS) return
	const ePrefix = `[ENTITY-${this.ID}].setupSTATS: `;
	try
	{
		this.STATS = new Float64Array(MAGPIE.KEY.STATS.ARRAY).fill(0);
		const offset = MAGPIE.KEY.POVART.ARRAY + 1;
		const povart = STATS.slice(0, offset);
		const stats = STATS.slice(offset);
		if(!MAGPIE_ENTITY.isValidPOVART(povart))
			throw new Error(`${povart} is invalid POVART`)
		povart.forEach((value, index) => {
			this.STATS[index] = value;
		})
		if(!MAGPIE_ENTITY.isValidEntityStats(stats))
			throw new Error(`${stats} is invalid STATS`);
		stats.forEach((stat, index) => {
			this.STATS[index + offset] = stat;
		})
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
MAGPIE_ENTITY.prototype.setupParents = async function setupParents()
{
	const ePrefix = `[ENTITY-${this.ID}].setupParents: `;
	try
	{
		const mother = await this.setupMother();
		if(!mother) 
			throw new Error("unable to setup mother-child relation")
		const father = await this.setupFather();
		if(!father) 
			throw new Error ("unable to setup father-child relation")
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupMother = async function setupMoter()
{
	const STATS = this.STATS;
	const K = MAGPIE.KEY.STATS;
	const motherID = STATS[K.MOTHER];
	const motherType = 0;
	if(!motherID) return
	const mother_payload = ["entity_parent", {
		parentID: motherID, 
		childID: this.ID, 
		parentType: motherType
	}]
	return await MAGPIE_ENTITY._set_relation(mother_payload);
}
/**
 * 
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupFather = async function setupFather()
{
	const STATS = this.STATS;
	const K = MAGPIE.KEY.STATS;
	const fatherType = 1;
	const fatherID = STATS[K.FATHER];
	if(isNaN(fatherID)) return
	const father_payload = ["entity_parent", {
		parentID: fatherID,
		childID: this.ID,
		parentType: fatherType
	}]
	return await MAGPIE_ENTITY._set_relation(father_payload)
}
/**
 * 
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupCompound = async function setupCompound()
{
	const K = MAGPIE.KEY.STATS.COMPOUND;
	const ID = this.STATS[K];
	if(!ID || isNaN(ID)) return
	const payload = ["entity_components", {
		entityID: ID,
		componentID: this.ID
	}]
	return await MAGPIE_ENTITY._set_relation(payload);
}
/**
 * 
 * @returns {Promise<import("better-sqlite3").RunResult>}
 */
MAGPIE_ENTITY.prototype.setupHost = async function setupHost()
{
	const K = MAGPIE.KEY.STATS.HOST;
	const ID = this.STATS[K];
	if(!ID || isNaN(ID)) return
	const payload = ["entity_equips", {
		entityID: ID,
		equipID: this.ID
	}]
	return await MAGPIE_ENTITY._set_relation(payload);
}
/**
 * 
 * @param {entity_data} data 
 * @returns 
 */
MAGPIE_ENTITY.prototype.setupFitness = function setupFitness(data)
{
	const ePrefix = `[ENTITY-${this.ID}].setupFitness: `;
	const fitness = data?.fitness;
	const deckSize = fitness?.length;
	if(!deckSize) return
	try
	{
		const K = MAGPIE.KEY.ENTITY.STATS.INDEX;
		const FIT = MAGPIE.KEY.FITNESS;
		const deckZones = FIT.ZONES;
		const index_entityID = FIT.E_ID;
		const index_deckSize = FIT.DECKSIZE;
		const arraySize = 2 + deckSize * deckZones + this._stat_endurance();
		this.fitness = new Float64Array(arraySize).fill(NaN);
		if(MAGPIE_ENTITY.isValidFitness(fitness))
			throw new Error(`${fitness} is invalid fitness`)
		this.fitness[index_entityID] = this.ID;
		this.fitness[index_deckSize] = deckSize;
		fitness.forEach((traitID, index) => {
			this.fitness[index + 2] = traitID;
		})
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
// #region > I/O
//------------------------------------------------------------------------
/**
 * 
 * @param {String} method 
 * @param  {*} argument 
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._database = async function _database(method, argument)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param  {*} argument
 * @returns {database_result} 
 */
MAGPIE_ENTITY._database_Sync = function _database_Sync(method, argument)
{
	//
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > getters
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_ENTITY} entity 
 * @returns {POVART}
 */
MAGPIE_ENTITY._get_POVART = function getPOVART(entity)
{
	return entity.STATS.slice(0, MAGPIE.KEY.POVART.ARRAY);
}
/**
 * 
 * @param {POVART} POVART 
 * @returns 
 */
MAGPIE_ENTITY._get_decomp_POVART = function getDecompPOVART(POVART)
{
	return MAGPIE_PHYSICS.decomp_POVART(POVART);
}
/**
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_celestial = function _get_celestial()
{
	const celestialID = this.STATS[MAGPIE.KEY.POVART.P_C];
	return MAGPIE_ENTITY.__hiveSync("_get_celestial", [celestialID])
}
/**
 * 
 * @returns {vector3}
 */
MAGPIE_ENTITY.prototype._get_P0 = function getP0()
{
	const K = MAGPIE.KEY.POVART;
	return [this.STATS[K.P_X], this.STATS[K.P_Y], this.STATS[K.P_Z]]
}
/**
 * 
 * @returns {rotor}
 */
MAGPIE_ENTITY.prototype._get_O0 = function getO0()
{
	const K = MAGPIE.KEY.POVART;
	return [this.STATS[K.O_YZ], this.STATS[K.O_XZ], this.STATS[K.O_XY], this.STATS[K.O_W]]
}
/**
 * 
 * @returns {vector3}
 */
MAGPIE_ENTITY.prototype._get_V0 = function getV0()
{
	const K = MAGPIE.KEY.POVART;
	return [this.STATS[K.V_X], this.STATS[K.V_Y], this.STATS[K.V_Z]]
}
/**
 * 
 * @returns {vector3}
 */
MAGPIE_ENTITY.prototype._get_A0 = function getA0()
{
	const K = MAGPIE.KEY.POVART;
	return [this.STATS[K.A_X], this.STATS[K.A_Y], this.STATS[K.A_Z]]
}
/**
 * 
 * @returns {bivector}
 */
MAGPIE_ENTITY.prototype._get_R0 = function getR0()
{
	const K = MAGPIE.KEY.POVART;
	return [this.STATS[K.R_YZ], this.STATS[K.R_XZ], this.STATS[K.R_XY]]
}
/**
 * 
 * @returns {bivector}
 */
MAGPIE_ENTITY.prototype._get_T0 = function getT0()
{
	const K = MAGPIE.KEY.POVART;
	return [this.STATS[K.T_YZ], this.STATS[K.T_XZ], this.STATS[K.T_XY]]
}
MAGPIE_ENTITY.prototype._get_STATS = function getSTATS()
{
	return this.STATS.slice(MAGPIE.KEY.POVART.ARRAY)
}
MAGPIE_ENTITY.prototype._get_traits = function getTraits()
{
	return this.fitness.slice(2, this.fitness[1] + 2)
}
/**
 * @param {MAGPIE_ENTITY} entity
 * @returns {stateID[]} Number[]
 */
MAGPIE_ENTITY._get_States = function _get_States(entity)
{
	const K = MAGPIE.KEY.FITNESS;
	const deckSize = entity.fitness[K.DECKSIZE];
	const offset = entity.fitness[K.TRAITS];
	const stateOffset = K.STATES;
	const states = entity.fitness
		.slice(offset + deckSize, offset + deckSize * stateOffset + 1)
		.filter(n => !isNaN(n))
	return states
}
/**
 * 
 * @returns {stateID[]} stateID[]
 */
MAGPIE_ENTITY.prototype._get_states = function getStates()
{
	return MAGPIE_ENTITY._get_States(this)
}
/**
 * 
 * @returns {Number}
 */
MAGPIE_ENTITY.prototype._get_growthLevel = function _get_growthLevel()
{
	return this.STATS[MAGPIE.KEY.STATS.G_LVL];
}
MAGPIE_ENTITY.prototype._get_fatLevel = function _get_fatLevel()
{
	let fat = 0;
	const states = MAGPIE_ENTITY._get_States();
	const FAT = STATE.INDEX.FAT;
	if(states.length < 1) return 0;
	for(const stateID of states)
	{
		const state = MAGPIE_STATE.INDEX.get(stateID);
		if(state.type === FAT)
			fat += 1;
	}
	return fat
}
/**
 * 
 * @param {expID} expID
 * @returns {MAGPIE_EXP} 
 */
MAGPIE_ENTITY._hive_getExp = function _hive_getExp(expID)
{
	return MAGPIE_ENTITY.__hiveSync("_get_databaseSync", ["loadExpSync", [expID]])
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_ENTITY._hive_getExpKeys = function _hive_getExpKeys(exp)
{
	return exp.getKeys
}
/**
 * {@link MAGPIE_HIVE._get_entity_relatives}
 * @param {String} rT name of relatives table
 * @param {String} pK name of parent foreign key
 * @param {String} fK name of child foreign key
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY._hive_getRelatives = async function _hive_getRelatives(rT, pK, fK)
{
	return await MAGPIE_ENTITY.__hive("_get_relatives", [this.ID, rT, pK, fK])
}
/**
 * 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getMother = function getMother()
{
	const motherID = this.STATS[MAGPIE.KEY.STATS.MOTHER];
	return MAGPIE_ENTITY.__hiveSync("_get_entitySync", [motherID]);
}
/**
 * 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getFather = function getFather()
{
	const fatherID = this.STATS[MAGPIE.KEY.STATS.FATHER];
	return MAGPIE_ENTITY.__hiveSync("_get_entitySync", [fatherID]);
}
/**
 * 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getCompound = function getCompound()
{
	const compoundID = this.STATS[MAGPIE.KEY.STATS.COMPOUND];
	return MAGPIE_ENTITY.__hiveSync("_get_entitySync", [compoundID]);
}
/**
 * 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype.getHost = function getHost()
{
	const hostID = this.STATS[MAGPIE.KEY.STATS.HOST];
	return MAGPIE_ENTITY.__hiveSync("_get_entitySync", [hostID]);
}
/**
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY.prototype.getChildren = async function getChildren()
{
	return await MAGPIE_ENTITY._hive_getRelatives("entity_children", "parentID", "childID")
}
/**
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY.prototype.getComponents = async function getComponents()
{
	return await MAGPIE_ENTITY._hive_getRelatives("entity_components", "compoundID", "componentID")
}
/**
 * @returns {Promise<MAGPIE_ENTITY[]>}
 */
MAGPIE_ENTITY.prototype.getEquips = async function getEquips()
{
	return await MAGPIE_ENTITY._hive_getRelatives("entity_equips", "hostID", "equipID")
}
MAGPIE_ENTITY.prototype._get_POVART = function _get_POVART()
{
	return MAGPIE_ENTITY._get_POVART(this)
}
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region celestial
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_ENTITY} entity 
 * @returns {distance}
 */
MAGPIE_ENTITY._get_celestialRadius = function radius(entity)
{
	if(!MAGPIE_ENTITY.isValidCelestial(entity))
		throw new Error(`${entity} is invalid celestial body`)
	return entity.STATS[MAGPIE.KEY.CELESTIAL.R]
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @returns {{
 * a: distance, 
 * e: ratio, 
 * i: angle_rad, 
 * raan: angle_rad, 
 * aop: angle_rad,
 * nu: angle_rad,
 * T0: duration,
 * M0: angle_rad
 * }}
 */
MAGPIE_ENTITY.prototype._get_orbit_data = function getOrbitData()
{
	/** @type {orbit_data} */
	const orbit_data = {};
	const K = MAGPIE.KEY.POVART;
	orbit_data.a = this.STATS[K.P_O_A];
	orbit_data.e = this.STATS[K.P_O_E];
	orbit_data.i = this.STATS[K.P_O_I];
	orbit_data.raan = this.STATS[K.P_O_RAAN];
	orbit_data.aop = this.STATS[K.P_O_AOP];
	orbit_data.nu = this.STATS[K.P_O_NU];
	orbit_data.T0 = this.STATS[K.P_O_T0];
	orbit_data.M0 = this.STATS[K.P_O_M0];
	return orbit_data
}
/**
 * 
 * @returns {orbit}
 */
MAGPIE_ENTITY.prototype._get_orbit = function getOrbit()
{
	const K = MAGPIE.KEY.POVART;
	const offset = K.P_C + 1;
	const end = K.P_O_M0 + 1;
	return this.STATS.slice(offset, end)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > setters
//------------------------------------------------------------------------
/**
 * 
 * @param {[String, ...args]} payload 
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._set_relation = async function _set_relation(payload)
{
	return await MAGPIE_ENTITY.__hive("_set_relation", payload)
}
/**
 * 
 * @param {orbit_data} orbit_data 
 */
MAGPIE_ENTITY.prototype._set_orbit_data = function setOrbitData(orbit_data)
{
	if(!orbit_data || Object.values(orbit_data).some(n => isNaN(n)))
		return
	const K = MAGPIE.KEY.POVART;
	this.STATS[K.P_O_A] = orbit_data.a;
	this.STATS[K.P_O_E] = orbit_data.e;
	this.STATS[K.P_O_I] = orbit_data.i;
	this.STATS[K.P_O_RAAN] = orbit_data.raan;
	this.STATS[K.P_O_AOP] = orbit_data.aop;
	this.STATS[K.P_O_NU] = orbit_data.nu;
	this.STATS[K.P_O_T0] = orbit_data.M0;
	this.STATS[K.P_O_M0] = orbit_data.M0;
}
/**
 * 
 * @param {orbit} orbit 
 */
MAGPIE_ENTITY.prototype._set_Orbit = function setOrbit(orbit)
{
	if(!orbit || orbit.some(n => isNaN(n)))
		throw new Error(`${orbit} is invalid orbit`)
	const K = MAGPIE.KEY.POVART;
	const offset = K.P_C + 1;
	orbit.forEach((value, index) => {
		this.STATS[offset + index] = value;
	})
}
/**
 * 
 * @param {vector3} P1 
 * @param {entityID} P_C 
 * @param {orbit} orbit 
 * @param {rotor} O1 
 * @param {vector3} V1 
 * @param {vector3} A1 
 * @param {bivector} R1 
 * @param {bivector} T1 
 * @param {entityID} E_ID 
 * @returns {POVART}
 */
MAGPIE_ENTITY._set_POVART_recompose = function _set_POVART_recompose(
	P1, P_C, orbit, O1, V1, A1, R1, T1, E_ID
)
{
	return MAGPIE_PHYSICS._POVART_recompose(P1, P_C, orbit, O1, V1, A1, R1, T1, E_ID)
}
/**
 * 
 * @param {{
 * P1: vector3,
 * P_C: entityID,
 * orbit: orbit,
 * O1: rotor,
 * V1: vector3,
 * A1: vector3,
 * R1: bivector,
 * T1: bivector
 * }} POVART1 
 */
MAGPIE_ENTITY.prototype._set_POVART = function _set_POVART(POVART1)
{
	if(!POVART1) return
	if(POVART1?.P1)
		this._set_P1(POVART1.P1);
	if(POVART1?.P_C)
		this.STATS[MAGPIE.KEY.POVART.P_C] = POVART1.P_C;
	if(POVART1?.O1)
		this._set_O1(POVART1.O1);
	if(POVART1?.V1)
		this._set_V1(POVART1.V1);
	if(POVART1?.A1)
		this._set_A1(POVART1.A1);
	if(POVART1?.R1)
		this._set_R1(POVART1.R1);
	if(POVART1?.T1)
		this._set_T1(POVART1.T1);
}
/**
 * 
 * @param {vector3} P1 
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype._set_P1 = function _set_P1(P1)
{
	// if(!MAGPIE_PHYSICS.isValidVector(P1))
	// 	throw new Error(`${P1} is invalid position vector`)
	const [x,y,z] = P1;
	const K = MAGPIE.KEY.POVART;
	this.STATS[K.P_X] = x;
	this.STATS[K.P_Y] = y;
	this.STATS[K.P_Z] = z;
	return true
}
/**
 * 
 * @param {rotor} O1 
 */
MAGPIE_ENTITY.prototype._set_O1 = function _set_O1(O1)
{
	// if(!MAGPIE_PHYSICS.isValidRotor(O1))
	// 	throw new Error(`${O1} is invalid rotor`)
	const [yz,xz,xy,w] = O1;
	const K = MAGPIE.KEY.POVART;
	this.STATS[K.O_YZ] = yz;
	this.STATS[K.O_XZ] = xz;
	this.STATS[K.O_XY] = xy;
	this.STATS[K.O_W] = w;
}
/**
 * 
 * @param {vector3} V1 
 */
MAGPIE_ENTITY.prototype._set_V1 = function _set_V1(V1)
{
	// if(!MAGPIE_PHYSICS.isValidVector(V1))
	// 	throw new Error(`${V1} is invalid velocity vector`)
	const [x,y,z] = V1;
	const K = MAGPIE.KEY.POVART;
	this.STATS[K.V_X] = x;
	this.STATS[K.V_Y] = y;
	this.STATS[K.V_Z] = z;
}
/**
 * 
 * @param {vector3} A1 
 */
MAGPIE_ENTITY.prototype._set_A1 = function _set_A1(A1)
{
	// if(!MAGPIE_PHYSICS.isValidVector(A1))
	// 	throw new Error(`${A1} is invalid acceleration vector`)
	const [x,y,z] = A1;
	const K = MAGPIE.KEY.POVART;
	this.STATS[K.A_X] = x;
	this.STATS[K.A_Y] = y;
	this.STATS[K.A_Z] = z;
}
/**
 * 
 * @param {bivector} R1 
 */
MAGPIE_ENTITY.prototype._set_R1 = function _set_R1(R1)
{
	// if(!MAGPIE_PHYSICS.isValidVector(R1))
	// 	throw new Error(`${R1} is invalid rotation bivector`)
	const [yz, xz, xy] = R1;
	const K = MAGPIE.KEY.POVART;
	this.STATS[K.R_YZ] = yz;
	this.STATS[K.R_XZ] = xz;
	this.STATS[K.R_XY] = xy;
}
/**
 * 
 * @param {bivector} T1 
 */
MAGPIE_ENTITY.prototype._set_T1 = function _set_T1(T1)
{
	// if(!MAGPIE_PHYSICS.isValidVector(T1))
	// 	throw new Error(`${T1} is invalid torque bivector`)
	const [yz,xz,xy] = T1;
	const K = MAGPIE.KEY.POVART;
	this.STATS[K.T_YZ] = yz;
	this.STATS[K.T_XZ] = xz;
	this.STATS[K.T_XY] = xy;
}
/**
 * 
 * @typedef {{
 * Vmax: velocity, 
 * Vsafe: velocity, 
 * Vcruise: velocity,
 * Vcreep: velocity,
 * Vdock: velocity,
 * Rmax: omega,
 * Rcruise: omega,
 * Rcreep: omega,
 * Rdock: omega,
 * Amax: acceleration,
 * Asafe: acceleration,
 * Acruise: acceleration,
 * Acreep: acceleration,
 * Adock: acceleration,
 * Tmax: alpha,
 * Tsafe: alpha,
 * Tcruise: alpha,
 * Tcreep: alpha,
 * Tdock: alpha
 * }} entity_speeds
 * @param {entity_speeds} overrideVspeed 
 */
MAGPIE_ENTITY.prototype._get_speeds = function getSpeed(overrideVspeed)
{
	const symbol = this._get_type()
	const Vspeeds = symbol.getVspeeds();
	/** @type {entity_speeds} */
	const speeds = {
		Vmax: overrideVspeed?.Vmax || Vspeeds?.Vmax,
		Vcruise: overrideVspeed?.Vcruise || Vspeeds?.Vcruise,
		Vsafe: overrideVspeed?.Vsafe || Vspeeds?.Vsafe,
		Vcreep: overrideVspeed?.Vcreep || Vspeeds?.Vcreep,
		Vdock: overrideVspeed?.Vdock || Vspeeds?.Vdock,
		Amax: overrideVspeed?.Amax || Vspeeds?.Amax,
		Asafe: overrideVspeed?.Asafe || Vspeeds?.Asafe,
		Acruise: overrideVspeed?.Acruise || Vspeeds?.Acruise,
		Acreep: overrideVspeed?.Acreep || Vspeeds?.Acreep,
		Adock: overrideVspeed?.Adock || Vspeeds?.Adock,
		Rmax: overrideVspeed?.Rmax || Vspeeds?.Rmax,
		Rsafe: overrideVspeed?.Rsafe || Vspeeds?.Rsafe,
		Rcruise: overrideVspeed?.Rcruise || Vspeeds?.Rcruise,
		Rcreep: overrideVspeed?.Rcreep || Vspeeds?.Rcreep,
		Rdock: overrideVspeed?.Rdock || Vspeeds?.Rdock,
		Tmax: overrideVspeed?.Tmax || Vspeeds?.Tmax,
		Tsafe: overrideVspeed?.Tsafe || Vspeeds?.Tsafe,
		Tcruise: overrideVspeed?.Tcruise || Vspeeds?.Tcruise,
		Tcreep: overrideVspeed?.Tcreep || Vspeeds?.Tcreep,
		Tdock: overrideVspeed?.Tdock || Vspeeds?.Tdock
	}
	return speeds
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Stats
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Celestial
//------------------------------------------------------------------------
/**
 * 
 * @param {Number[]} traits 
 */
MAGPIE_ENTITY.prototype._C_importTraits = function importCelestialTraits(traits)
{
	if(!traits || traits.length < 1 || traits.some(n => isNaN(n))) 
		throw new Error(`${traits} is invalid celestial traits`);
	const [
		mass, 
		CMF, 
		axial, 
		rotation, 
		albedo, 
		greenhouse, 
		age, 
		radius, 
		g,
		Ve,
		surf_temp,
		atm,
		atmo_dens,
		atmo_comp
	] = traits;
	const K = MAGPIE.KEY.CELESTIAL;
	this.STATS[K.MASS] = mass;
	this.STATS[K.CMF] = CMF;
	this.STATS[K.AXIAL] = axial;
	this.STATS[K.ROTATION] = rotation;
	this.STATS[K.ALBEDO] = albedo;
	this.STATS[K.GREENHOUSE] = greenhouse;
	this.STATS[K.AGE] = age;
	this.STATS[K.R] = radius;
	this.STATS[K.G] = g;
	this.STATS[K.ESCAPE] = Ve;
	this.STATS[K.SURF_TEMP] = surf_temp;
	this.STATS[K.ATM] = atm;
	this.STATS[K.ATD] = atmo_dens;
	this.STATS[K.COMP] = atmo_comp;
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Materia
//------------------------------------------------------------------------
/**
 * 
 * @param {Number[]} STATS 
 */
MAGPIE_ENTITY.prototype._M_importSTATS = function importMateriaSTATS(STATS)
{
	if(!STATS || STATS.length < 1 || STATS.some(n => isNaN(n)))
		throw new Error(`${STATS} is invalid materia stats`);
	const [
		FIT,END,PWR,MASS,SEN,DEX,RT,EVO,G_R,G_I,INERT_X,INERT_Y,INERT_Z,
		TMAX_X,TMAX_Y,TMAX_Z,FB,CM,MASSKG,DENSITY,LENGTH,HEIGHT,WIDTH,VOLUME,
		FT,VMAX,AMAX,BMAX,GMAX,CF,CL,CD,COM,COL
	] = STATS;
	const K = MAGPIE.KEY.STATS;
	this.STATS[K.FIT] = FIT;
	this.STATS[K.END] = END;
	this.STATS[K.PWR] = PWR;
	this.STATS[K.MASS] = MASS;
	this.STATS[K.SEN] = SEN;
	this.STATS[K.DEX] = DEX;
	this.STATS[K.RT] = RT;
	this.STATS[K.EVO] = EVO;
	this.STATS[K.G_R] = G_R;
	this.STATS[K.G_I] = G_I;
	this.STATS[K.INERT_X] = INERT_X;
	this.STATS[K.INERT_Y] = INERT_Y;
	this.STATS[K.INERT_Z] = INERT_Z;
	this.STATS[K.TMAX_X] = TMAX_X;
	this.STATS[K.TMAX_Y] = TMAX_Y;
	this.STATS[K.TMAX_Z] = TMAX_Z;
	this.STATS[K.FB] = FB;
	this.STATS[K.CM] = CM;
	this.STATS[K.MASSKG] = MASSKG;
	this.STATS[K.DENSITY] = DENSITY;
	this.STATS[K.LENGTH] = LENGTH;
	this.STATS[K.HEIGHT] = HEIGHT;
	this.STATS[K.WIDTH] = WIDTH;
	this.STATS[K.VOLUME] = VOLUME;
	this.STATS[K.FT] = FT;
	this.STATS[K.VMAX] = VMAX;
	this.STATS[K.AMAX] = AMAX;
	this.STATS[K.BMAX] = BMAX;
	this.STATS[K.GMAX] = GMAX;
	this.STATS[K.CF] = CF;
	this.STATS[K.CL] = CL;
	this.STATS[K.CD] = CD;
	this.STATS[K.COM] = COM;
	this.STATS[K.COL] = COL;
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * @typedef {import("./physics").coords} coords
 */
//------------------------------------------------------------------------
// #region > POVART
//------------------------------------------------------------------------
/**
 * 
 * @param {coords} C1 
 * @param {distance} r 
 */
MAGPIE_ENTITY.prototype._set_C1 = function _set_C1(C1, r = null)
{
	return this._set_P1(MAGPIE_PHYSICS.geodeticToCartesian(C1, r))
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Target
//------------------------------------------------------------------------
/**
 * @param {String} method
 * @param {[]} args
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY.prototype._update = async function update(method = null, args = [])
{
	if(method)
		this[method](...args);
	return await MAGPIE_ENTITY._hive_setEntity(this)
}
/**
 * 
 * @param {String} method 
 * @param {[]} args 
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._updateSync = function updateSync(method = null, args = [])
{
	if(method)
		this[method](...args)
	return MAGPIE_ENTITY._hive_setEntitySync(this)
}
/**
 * 
 * @param {String} method 
 * @param {[]} args
 * @returns {database_result} 
 */
MAGPIE_ENTITY.prototype._target_update = function _target_update(method = null, args = [])
{
	const target = this._get_target()
	if(!target) return
	return target._updateSync(method, args);
}

// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link MAGPIE_ENTITY.meta}
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
// #region - REFRESH
//========================================================================
/**
 * @desc 
 * @todo how to switch between POVART/orbital?
 * @param {Number} switchID 
 * @param {duration} dt in s
 * @param {Number} layer_frame
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.refresh = function refresh(switchID, dt, layer_frame)
{
	const ePrefix = `[ENTITY-${this.ID}].refresh: `;
	try
	{
		if(isNaN(switchID))
			throw new Error(`${switchID} is invalid switchID`);
		if(isNaN(dt))
			throw new Error(`${dt} is invalid dT`);
		// MAGPIE_SYSTEM._logging_debug(dt);
		this.updated = Date.now();
		if(this.type < MAGPIE.KEY.ENTITY.TYPE.get("MATERIA").type)
			return true
		const input = this.processExp(switchID, dt, layer_frame);
		const key = this.processKeys(input);
		const emote = this.processEmote(switchID, dt, input, key);
		const { exp: state, target } = this.processStates(switchID, dt, emote?.exp || input);
		this.processAgency(switchID, dt, state, input?.keys || []);
		const { At, Tt } = emote?.target ? emote.target : target;
		const POVART0 = this._get_POVART();
		const C = this._get_celestial(POVART0[MAGPIE.KEY.POVART.P_C]);
		const { output, POVART1 } = this.updatePhysics(switchID, dt, At, Tt, C, POVART0);
		if(!output)
			throw new Error(`${output} is invalid output`)
		MAGPIE_ENTITY.__socketEmit(output, input, this, C, POVART1, dt);
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return false
	}
}
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Socket
//------------------------------------------------------------------------
/**
 * 
 * @param {Float64Array} output 
  * @param {MAGPIE_EXP} exp
  * @param {MAGPIE_ENTITY} entity
  * @param {MAGPIE_ENTITY} P_C
  * @param {POVART} POVART1
  * @param {duration} dt
 */
MAGPIE_ENTITY.__socketEmit = function __socketEmit(output, exp, entity, P_C, POVART1, dt)
{
	//
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region exp
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} switchID 
 * @param {duration} dt 
 * @param {Number} layer_frame
 * @returns {MAGPIE_EXP}
 */
MAGPIE_ENTITY.prototype.processExp = function processExp(switchID, dt, layer_frame)
{
	const ePrefix = `[ENTITY-${this.ID}].processExp: `;
	const exps = this._get_array_expID();
	// return MAGPIE_SYSTEM._logging_debug(layer_frame)
	if(exps.length < 1) return
	const expID = this._get_nextExpID(layer_frame);
	if(!expID) 
		throw new Error(`${expID} is invalid EXP.ID`)
	try
	{
		const exp = MAGPIE_ENTITY._hive_getExp(expID)
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`${exp} is invalid EXP`);
		return exp
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * @returns {expID[]}
 */
MAGPIE_ENTITY.prototype._get_array_expID = function getArrayExpID()
{
	// MAGPIE_SYSTEM._logging_debug(this.exps)
	return this.exps;
}
/**
 * @param {Number} layer_frame
 * @returns {expID}
 */
MAGPIE_ENTITY.prototype._get_nextExpID = function getNextExpID(layer_frame)
{
	const exps = this._get_array_expID();
	if(!Array.isArray(exps) || exps.length < 1)
		throw new Error(`${exps} is invalid EXP array`)
	if(layer_frame >= exps.length)
		layer_frame = layer_frame % exps.length
	const expID = exps[layer_frame];
	if(isNaN(expID))
		throw new Error(`[ENTITY-${this.ID}].getNextExpID: ${expID} is invalid expID`)
	return expID;
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region emote
//------------------------------------------------------------------------

/**
 * 
 * @param {Number} switchID 
 * @param {duration} dt 
 * @param {MAGPIE_EXP} exp 
 * @param {MAGPIE_KEY} key
 * @returns {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}}
 */
MAGPIE_ENTITY.prototype.processEmote = function processEmote(switchID, dt, exp, key)
{
	const ePrefix = `[ENTITY-${this.ID}].processEmote: `;
	if(!exp) return
	try
	{
		if(!(exp instanceof MAGPIE_EXP)) 
			throw new Error(`${exp} is invalid MAGPIE_EXP`)
		if(key instanceof MAGPIE_KEY && key.label) 
			return this._act_emote(MAGPIE.KEY.EMOTE.INDEX[key.label], exp)
		const emote = MAGPIE_EMOTE.INDEX.get(exp.emoteID);
		if(!emote) 
		{
			return {exp: exp}
		}
		const output = emote.onAction(exp, this);
		if(!output?.exp)
			throw new Error(`${output} is invalid emote output`);
		const stateIndex = 0; //@todo how do we figure out stateIndex from emote?
		this.addState([output.addState, stateIndex]);
		this.removeState([output.removeState, stateIndex]);
		this.switchState([output.switchState[0]], stateIndex, output.switchState[1]);
		return output.exp
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return {exp: exp}
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
// #region states
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} switchID 
 * @param {duration} dt 
 * @param {MAGPIE_EXP} exp
 * @return {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}} 
 */
MAGPIE_ENTITY.prototype.processStates = function processStates(switchID, dt, exp)
{
	const ePrefix = `[ENTITY-${this.ID}].processStates: `;
	const target = {At: [0,0,0], Tt: [0,0,0]}
	try
	{
		const states = this._get_states();
		if(states.length < 1) return
		states.sort((a, b) => b - a);
		const standardSwitch = 2;
		for(const stateID of states)
		{
			try
			{
				const state = MAGPIE_STATE.INDEX.get(stateID);
				if(!(state instanceof MAGPIE_STATE))
					throw new Error(`${stateID} is invalid MAGPIE_STATE`);
				const process = switchID >= standardSwitch ? true : false;
				const output = state.onUpdate(exp, this, process);
				if(output?.keyID)
					exp.keys.push(keyID)
				if(output?.target)
				{
					if(output.target?.At)
						target.At = output.target.At;
					if(output.target?.Tt)
						target.Tt = output.target.Tt;
				}
			}
			catch(e)
			{
				MAGPIE_SYSTEM.error(ePrefix + e.message, e)
			}
		}
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
	finally
	{
		return { exp, target }
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
// #region agency
//------------------------------------------------------------------------

/**
 * 
 * @param {Number} switchID 
 * @param {duration} dt 
 * @param {MAGPIE_EXP} exp 
 * @param {MAGPIE_KEY[]}
 */
MAGPIE_ENTITY.prototype.processAgency = function processAgency(switchID, dt, exp, keys)
{
	const ePrefix = `[ENTITY-${this.ID}].processAgency: `;
	if(!exp) return
	try
	{
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`${exp} is invalid MAGPIE_EXP`)
		if(!keys || keys.length < 1)
			return
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
// #region physics
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} switchID 
 * @param {duration} dt 
 * @param {vector3} Ax
 * @param {bivector} Tx
 * @param {MAGPIE_ENTITY} C
 * @param {POVART} POVART0
 * @returns {{
 * output: [lat,lon,ASL,radius: distance,Fg: acceleration,...force[]],
 * POVART1: POVART
 * }}
 */
MAGPIE_ENTITY.prototype.updatePhysics = function updatePhysics(switchID, dt, Ax, Tx, C, POVART0)
{
	const ePrefix = `[ENTITY-${this.ID}].updatePhysics: `;
	let update = { 
		STATS: this.STATS, 
		geodetic: { lat: NaN, lon: NaN, ASL: NaN, forces: new Float64Array(8)} 
	}
	try
	{
		let { P0, orbit, O0, V0, A0, R0, T0, E_ID } = MAGPIE_ENTITY._get_decomp_POVART(POVART0);
		A0 = [0,0,0];
		T0 = [0,0,0];
		const CB = MAGPIE_PHYSICS._calculate_collisionBox(this);
		const r = MAGPIE_ENTITY._get_celestialRadius(C);
		let C0 = MAGPIE_PHYSICS.cartesianToGeodetic(P0, r);
		const floor = MAGPIE_PHYSICS._geod_clampToGround(r, C0, POVART0, dt);
		if(floor.clamped)
		{
			P0 = floor.Pg;
			O0 = floor.Og;
			V0 = floor.Vg;
			C0 = MAGPIE_PHYSICS.cartesianToGeodetic(P0, r);
		}
		// @todo entity.updatePhysics check obstacles and calculate Ac/Tc
		const { At, Tt } = MAGPIE_PHYSICS._POVART_applyTargetAT(this, dt, Ax, Tx, O0);
		const forcesData = { dt, r, P0, V0, At, C0, CB, STATS: this.STATS };
		const { Af, Tf, forces } = MAGPIE_PHYSICS._apply_forces(forcesData);
		const dA = MAGPIE_PHYSICS.scaleVector(MAGPIE_PHYSICS.addVectors(At, Af), dt)
		update.dA = dA;
		const dT = MAGPIE_PHYSICS.scaleVector(MAGPIE_PHYSICS.addVectors(Tf, Tt), dt);
		update.dT = dT;
		const T1 = MAGPIE_PHYSICS.addVectors(T0, dT);
		const R1 = MAGPIE_PHYSICS.addVectors(R0, T1);
		const dO = MAGPIE_PHYSICS.rotorFromBivector(R1, dt);
		const Ocomp = MAGPIE_PHYSICS.rotorCompose(dO, O0);
		const O1 = MAGPIE_PHYSICS.rotorNormalize(Ocomp);
		//
		const A1 = MAGPIE_PHYSICS.addVectors(A0, dA);
		const dV = MAGPIE_PHYSICS.addVectors(V0, A1);
		const V1 = MAGPIE_PHYSICS.mag(dV) > 1e-9 ? dV : [0,0,0];
		//
		const dP = MAGPIE_PHYSICS.scaleVector(V1, dt);
		const P1 = MAGPIE_PHYSICS.addVectors(P0, dP);
		const C1 = MAGPIE_PHYSICS.cartesianToGeodetic(P1, r);
		const [lat,lon,ASL] = C1;
		const output = new Float64Array([lat,lon,ASL,r,...forces])
		//
		this._set_POVART({P1, O1, V1, A1, R1, T1 });
		// const dist = MAGPIE_PHYSICS.distanceTo(P0, this._get_P0());
		// MAGPIE_SYSTEM._logging_debug(`dP: ${MAGPIE_PHYSICS.mag(dP)}, dist: ${dist}, dt: ${dt}`)
		return { output, POVART1: this._get_POVART() }
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return null
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
// #region > Eval
//------------------------------------------------------------------------
/**
 * 
 * @param {String} label 
 * @param {MAGPIE_EXP} exp
 * @returns {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}}
 */
MAGPIE_ENTITY.prototype._key_processEmote = function _key_processEmote(label, exp)
{
	const { At, Tt } = this[`_emote_${label}`](exp);
	// MAGPIE_SYSTEM._logging_debug(`At: ${MAGPIE_PHYSICS.mag(At)}`)
	if(!MAGPIE_PHYSICS.isValidVector(At) || !MAGPIE_PHYSICS.isValidVector(Tt))
		return { exp }
	return { exp, target: { At, Tt }}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region helpers
//------------------------------------------------------------------------

/**
 * @todo processKeys
 * @param {MAGPIE_EXP} exp 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_ENTITY.prototype.processKeys = function processKeys(exp)
{
	const ePrefix = `[ENTITY-${this.ID}].processKeys: `;
	if(!exp) return
	try
	{
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`${exp} is invalid MAGPIE_EXP`)
		const keyList = exp.keys;
		if(keyList.length < 1) return
		const keys = exp.getKeys();
		if(keys.length < 1) return
		const key = keys.find(key => key.type === MAGPIE.KEY.TYPE.EMOTE)
		if(key)
			return key
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
// #region - SYMBOLS
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Getters
//------------------------------------------------------------------------
/**
 * 
 * @returns {MAGPIE_SYMBOL}
 */
MAGPIE_ENTITY.prototype._get_type = function getType()
{
	return MAGPIE_ENTITY._database_Sync("loadSymbolSync", this.type)
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
// #region - TRAITS
//========================================================================
/**
 * 
 * @param {stateID} stateID 
 * @returns {fitness_index} fitness_index
 */
MAGPIE_ENTITY.prototype._trait_blockState = function blockTraitForState(stateID)
{
	const ePrefix = `[ENTITY-${this.ID}].blockTraitForState: `;
	try
	{
		//
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
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
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - EMOTES
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Eval
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @returns {() => {}}
 */
MAGPIE_ENTITY.prototype._emote_eval = function _emote_eval(exp)
{
	const ePrefix = `[ENTITY-${this.ID}]._emote_eval: `;
	try
	{
		const key = exp.getKeys()
			.find(key => key.type === MAGPIE.KEY.TYPE.EVAL)
		if(!key) return
		eval(`${key.label.replace("$", exp.value)}`);
		key.set("type", MAGPIE.KEY.TYPE.EXP)
		return { At: [0,0,0], Tt: [0,0,0] }
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message,e)
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
// #region > Seek
//------------------------------------------------------------------------

/**
 * 
 * @param {MAGPIE_EXP} exp 
 */
MAGPIE_ENTITY.prototype._emote_seekTarget = function _emote_seekTarget(exp)
{
	const ePrefix = `[ENTITY-${this.ID}]._emote_seekTarget: `;
	const output = { At: [0,0,0], Tt: [0,0,0] }
	try
	{
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`${exp} is invalid EXP`)
		const POVART0 = this._get_POVART();
		const { P0 } = MAGPIE_ENTITY._get_decomp_POVART(POVART0)
		const targetID = exp.targetID
		if(isNaN(targetID))
			throw new Error(`${targetID} is invalid targetID`)
		const target = MAGPIE_ENTITY.__hiveSync("_get_entity", [targetID]);
		if(!target)
			throw new Error(`${target} is invalid target`)
		const Pt = target._get_P0();
		const dist = this._target_getDistance(P0, Pt)
		const contact = this._target_isSensed(target, dist);
		if(!contact)
			return 
		const tolerance = 1; //@todo dynamic seekTarget tolerance
		const pR = 1; //@todo dynamic seekTarget priority ratio
		const intensity = exp.value;
		const keys = exp.getKeys();
		const options = {
			intensity: intensity,
			fwd: MAGPIE.KEY.POVART.FWD,
			agility: this.STATS[MAGPIE.KEY.STATS.DEX],
			tolerance: tolerance
		}
		const overrideVspeed = exp._key_mapVspeeds();
		const speeds = this._get_speeds(overrideVspeed);
		Object.entries(speeds).forEach(entry => {
			const key = entry[0];
			const value = entry[1];
			options[key] = value;
		})
		// MAGPIE_SYSTEM._logging_debug(options.Vcruise)
		const output = MAGPIE_PHYSICS
			._emote_seekTarget(POVART0, Pt, this.STATS, options);
		const { At, Tt, arrived, proximity, braking } = output;
		if(arrived)
			return this._emote_onTarget(exp)
		if(proximity)
			return this._emote_reachTarget(exp)
		if(braking)
			return this._emote_approachTarget(exp)
		output.At = At;
		output.Tt = Tt;		
 	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
	finally
	{
		return output
	}
}
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @returns {{At: vector3, Tt: bivector}}
 */
MAGPIE_ENTITY.prototype._emote_onTarget = function _emote_onTarget(exp)
{
	const ePrefix = `[ENTITY-${this.ID}].reachTarget: `;
	try
	{
		const next = exp._emote_onTarget();
		const states = this._get_states();
		if(states.length < 1) return
		const stateA_ID = STATE.INDEX.APPROACHING_TARGET;
		const stateA_index = states.findIndex(n => n === stateA_ID)
		if(!stateA_index)
			throw new Error(`unable to get index for [STATE-${stateA_ID}]`)
		const stateA = [stateA_ID, stateA_index]
		this.switchState(stateA, next 
			? STATE.INDEX.SEEKING_TARGET 
			: STATE.INDEX.ON_TARGET);
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
// #region > schedule
//------------------------------------------------------------------------
/**
 * @todo update _emote_schedule key handling to 0.23.0
 * @param {MAGPIE_EXP} exp 
 * @returns 
 */
MAGPIE_ENTITY.prototype._emote_schedule = function _emote_schedule(exp)
{
    const ePrefix = `[ENTITY-${this.ID}].schedule: `;
	try
	{
		const keys = exp.getKeys()
		const trigger = keys.find(key => key.type === MAGPIE.KEY.TYPE.TRIGGER)
		if(!trigger) return
		const triggered = Date.now() > trigger.ID;
		MAGPIE_SYSTEM._logging_debug(triggered)
		if(!triggered) return
		exp.removeKey(MAGPIE.KEY.EMOTE.INDEX.SCHEDULE);
		const result = trigger.set("type", MAGPIE.KEY.TYPE.EMOTE);
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
	finally
	{
		return { At: [0,0,0], Tt: [0,0,0] }
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
// #region - KEYS
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Utilities
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_EXP} exp 
 * @param {Number} keyIndex 
 * @returns {keyID}
 */
MAGPIE_ENTITY.prototype._exp_keyPluck = function expKeyPluck(exp, keyIndex)
{
	const key = exp.keys[keyIndex];
	exp.keys[keyIndex] = exp.keys[exp.keys.length - 1];
	exp.keys.pop();
	return key
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
 * @param {MAGPIE_KEY} key 
 * @returns {Promise<database_result>}
 */
MAGPIE_ENTITY._set_key = async function setKey(key)
{
	return MAGPIE_ENTITY._database("saveKey", key);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Getters
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} keyID 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_ENTITY._get_key = function getKey(keyID)
{
	return MAGPIE_ENTITY._database_Sync("loadKeySync", keyID)
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
// #region - STATE
//========================================================================
/**
 * 
 * @param {[stateID, Number]} state [stateID, index]
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.addState = function addState(state)
{
	const ePrefix = `[ENTITY-${this.ID}].addState: `;
	try
	{
		const valid = MAGPIE_STATE.validateChange(state);
		if(!valid) return
		const [stateID, index] = valid;
		const slot = this.fitness[index];
		if(slot === stateID) return
		if(slot) 
			throw new Error(`fitness[${index}] is occupied by [STATE-${slot}]`)
		this.fitness[index] = stateID
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {[stateID, Number]} state [stateID, index] 
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.removeState = function removeState(state)
{
	const ePrefix = `[ENTITY-${this.ID}].removeState: `;
	try
	{
		const valid = MAGPIE_STATE.validateChange(state);
		if(!valid) return
		const [stateID, index] = valid;
		const slot = this.fitness[index];
		if(isNaN(slot))
			throw new Error(`fitness[${index}] is already empty`)
		this.fitness[index] = NaN;
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {[stateID, Number]} stateA 
 * @param {stateID} stateB 
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype.switchState = function switchState(stateA, stateB)
{
	const ePrefix = `[ENTITY-${this.ID}].switchState: `;
	try
	{
		const validA = MAGPIE_STATE.validateChange(stateA);
		const validB = MAGPIE_STATE.validate(stateB);
		if(!validA || !validB) return
		const [stateA_ID, index] = validA;
		const stateB_ID = validB;
		const slot = this.fitness[index];
		if(isNaN(slot))
			throw new Error(`fitness[${index}] is empty`)
		this.fitness[index] = stateB_ID;
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
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
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - EXP
//========================================================================
MAGPIE_ENTITY.exp = {};
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > getters
//------------------------------------------------------------------------
/**
 * 
 * @returns {MAGPIE_EXP[]}
 */
MAGPIE_ENTITY.prototype._get_exps = function _get_exps()
{
	const exps = this._get_array_expID();
	if(exps.length < 1) return []
	let list = [];
	for(const expID of exps)
	{
		const exp = MAGPIE_ENTITY._hive_getExp(expID);
		if(exp instanceof MAGPIE_EXP)
			list.push(exp)
	}
	return list
}
/**
 * 
 * @param {Number} expID 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_exp_target = function _get_exp_target(expID)
{
	const exp = MAGPIE_ENTITY._hive_getExp(expID);
	const targetID = typeof exp.targetID === "number" 
		? exp.targetID
		: exp.targetID[MAGPIE.KEY.POVART.E_ID]
	return MAGPIE_ENTITY.__hiveSync("_get_entitySync", [targetID])
}
/**
 * 
 * @returns {MAGPIE_ENTITY}
 */
MAGPIE_ENTITY.prototype._get_target = function _get_target()
{
	return MAGPIE_ENTITY.__hiveSync("_get_entity", [this._get_exps()[0].targetID])
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > setters
//------------------------------------------------------------------------
/**
 * 
 * @param {Number} expID 
 * @param {Number} targetID 
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._set_exp_targetID = function _set_exp_targetID(expID, targetID)
{
	const exp = MAGPIE_ENTITY._hive_getExp(expID);
	if(typeof exp.targetID === "number")
		exp.targetID = targetID;
	else exp.targetID[MAGPIE.KEY.POVART.E_ID] = targetID
	return MAGPIE_ENTITY._hive_setExpSync(exp);
}
/**
 * 
 * @param {Number} expID 
 * @param {Number} value 
 * @returns {database_result}
 */
MAGPIE_ENTITY.prototype._set_exp_value = function _set_exp_value(expID, value)
{
	const exp = MAGPIE_ENTITY._hive_getExp(expID)
	exp.value = Number(value);
	return MAGPIE_ENTITY._hive_setExpSync(exp);
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link MAGPIE_ENTITY.exp}
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
// #region - ACTION
//========================================================================
/**
 * 
 * @param {emoteID} emoteID 
 * @param {MAGPIE_EXP} exp
 * @returns {{exp: MAGPIE_EXP, target: {At: vector3, Tt: bivector}}} 
 */
MAGPIE_ENTITY.prototype._act_emote = function _act_emote(emoteID, exp)
{
	const ePrefix = `[ENTITY-${this.ID}].actEmote: `;
	try
	{
		if(isNaN(emoteID))
			throw new Error(`${emoteID} is invalid emoteID`)
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`${exp} is invalid EXP`)
		const emote = MAGPIE_EMOTE.INDEX.get(emoteID);
		if(!emote) 
			throw new Error(`unable to find [EMOTE-${emoteID}]`)
		return emote.onAction(exp, this)
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
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
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - TARGET
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
/**
 * 
 * @param {vector3} P0 
 * @param {vector3} Pt 
 * @returns {distance}
 */
MAGPIE_ENTITY.prototype._target_getDistance = function getDistanceToTarget(P0, Pt)
{
	return MAGPIE_PHYSICS.distanceTo(P0, Pt);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Check
//------------------------------------------------------------------------
/**
 * 
 * @param {MAGPIE_ENTITY} target 
 * @param {distance} dist 
 * @returns {Boolean}
 */
MAGPIE_ENTITY.prototype._target_isSensed = function isTargetSensed(target, dist)
{
	return true
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
module.exports = { MAGPIE_ENTITY }
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================