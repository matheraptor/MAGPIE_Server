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
	MAGPIE_EXP 
} = require("./component");
const { MAGPIE_PHYSICS } = require("./physics");
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
 * - ADDED: placeholder hive helpers @todo link helpers in SERVER.js 
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
	const stats = Object.keys(K).slice(1, K.ARRAY + 1);
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
 * @param {entityID} entityID
 * @returns {MAGPIE_ENTITY} 
 */
MAGPIE_ENTITY._hive_getEntitySync = function getEntitySync(entityID)
{
	//
}
/**
 * 
 * @param {entityID} entityID
 * @returns {Promise<MAGPIE_ENTITY>} 
 */
MAGPIE_ENTITY._hive_getEntity = async function getEntity(entityID)
{
	//
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {Boolean} 
 */
MAGPIE_ENTITY._hive_setEntitySync = function setEntitySync(entity)
{
	//
}
/**
 * 
 * @param {MAGPIE_ENTITY} entity
 * @returns {Promise<Boolean>} 
 */
MAGPIE_ENTITY._hive_setEntity = async function setEntity(entity)
{
	//
}
/**
 * 
 * @param {STATS} STATS 
 * @returns {Boolean}
 */
MAGPIE_ENTITY.isValidSTATS = function isValidSTATS(STATS)
{
	if(!STATS || STATS?.length !== MAGPIE.KEY.STATS.ARRAY || STATS.some(n => isNaN(n)))
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
		const entity = await MAGPIE_ENTITY._hive_getEntity(ID);
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
 * @typedef {Float64Array} STATS 
 * @typedef {Float64Array} entity_fitness [
 * E_ID, 
 * deckSize, 
 * ...traits, 
 * ...states, 
 * ...discard, 
 * ...injury,
 * host, 
 * ...equip,
 * ...stamina
 * ]
 * @typedef {Float64Array} entity_stats POVART + STATS
 * @typedef {Float64Array} entity_params
 * @typedef {Enumerator<Number>} entity_type {@link MAGPIE.KEY.ENTITY.TYPE}
 * @typedef {import("./index").orbit_data} orbit_data
 * @typedef {import("./index").orbit} orbit [a,e,i,raan,aop,nu,T0,M0]
 * @typedef {Float64Array} fitness
 * @typedef {import("./index").epoch_real_s} epoch_real_s time in s since epoch J2000
 * @typedef {{
 * name: String,
 * type: Enumerator<Number>,
 * parents: entityID[],
 * children: entityID[],
 * STATS: entity_stats,
 * fitness: entity_fitness,
 * exps: MAGPIE_EXP[],
 * host: entityID,
 * equip: entityID[]
 * }} entity_data
 * 
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
	/** @type {entityID[]} */
	this.parents = [NaN];
	/** @type {entityID[]} */
	this.children = [NaN];
	const POVART = MAGPIE.KEY.POVART.ARRAY;
	const STATS = MAGPIE.KEY.STATS.ARRAY;
	/** @type {STATS} @desc {@link MAGPIE.KEY.POVART} {@link MAGPIE.KEY.STATS} */
	this.STATS = new Float64Array(POVART + STATS).fill(0);
	const deckSize = data?.traits?.length || 1;
	/** @type {fitness} @desc {@link MAGPIE.KEY.TRAIT} {@link MAGPIE.KEY.ECG} */
	this.fitness = new Float64Array(2 + deckSize * 5 + this._stat_endurance())
	/** @type {MAGPIE_EXP[]} */
	this.exps = [];
	/** @type {entityID} */
	this.host = NaN;
	/** @type {entityID[]} */
	this.equip = [NaN];
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
	this.birth = Number(data?.birth) || 0;
	this.setupSTATS(data?.STATS);
	await this.setupParents(data?.parents);
	await this.setupChildren(data?.children);
	await this.setupHost(data?.host);
	await this.setupEquip(data?.equip);
	this.setupFitness(data?.fitness);
}
MAGPIE_ENTITY.prototype.setupSTATS = function setupSTATS(STATS)
{
	if(!STATS) return
	const ePrefix = `[ENTITY-${this.ID}].setupSTATS: `;
	try
	{
		const offset = MAGPIE.KEY.POVART.ARRAY + 1;
		const povart = STATS.slice(0, offset);
		const stats = STATS.slice(offset);
		if(!MAGPIE_ENTITY.isValidPOVART(povart))
			throw new Error(`${povart} is invalid POVART`)
		povart.forEach((value, index) => {
			this.STATS[index] = value;
		})
		if(!MAGPIE_ENTITY.isValidSTATS(stats))
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
/**
 * 
 * @param {entityID[]} parents 
 * @returns 
 */
MAGPIE_ENTITY.prototype.setupParents = async function setupParents(parents)
{
	if(!parents || parents.every(n => isNaN(n))) return
	const ePrefix = `[ENTITY-${this.ID}].setupParents: `;
	try
	{
		await MAGPIE_ENTITY._setDependency(parents, "parents", "children")
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID[]} children 
 * @returns 
 */
MAGPIE_ENTITY.prototype.setupChildren = async function setupChildren(children)
{
	if(!children || children.every(n => isNaN(n))) return
	const ePrefix = `[ENTITY-${this.ID}].setupChildren: `;
	try
	{
		await MAGPIE_ENTITY._setDependency(children, "children", "parents");
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID} host 
 */
MAGPIE_ENTITY.prototype.setupHost = async function setupHost(host)
{
	const ePrefix = `[ENTITY-${this.ID}].setupHost: `;
	if(isNaN(host)) return
	try
	{
		await MAGPIE_ENTITY._setDependency([host], "host", "equip");
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {entityID[]} equip 
 */
MAGPIE_ENTITY.prototype.setupEquip = async function setupEquip(equip)
{
	const ePrefix = `[ENTITY-${this.ID}].setupEquip: `;
	if(!equip || equip.every(n => isNaN(n))) return
	try
	{
		await MAGPIE_ENTITY._setDependency(equip, "equip", "host");
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.emssage, e);
	}
}
MAGPIE_ENTITY.prototype.setupFitness = function setupFitness(fitness)
{
	const deckSize = fitness?.length;
	if(!deckSize) return
	const ePrefix = `[ENTITY-${this.ID}].setupFitness: `;
	try
	{
		if(MAGPIE_ENTITY.isValidFitness(fitness))
			throw new Error(`${fitness} is invalid fitness`)
		this.fitness[0] = this.ID;
		this.fitness[1] = deckSize;
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
// #region > getters
//------------------------------------------------------------------------
MAGPIE_ENTITY.prototype._get_POVART = function getPOVART()
{
	return this.STATS.slice(0, MAGPIE.KEY.POVART.ARRAY);
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
	const K = MAGPIE.KEY.STATS;
	const offset = MAGPIE.KEY.POVART.ARRAY;
	this.STATS[K.MASSKG + offset] = mass;
	this.STATS[K.MASS + offset] = CMF;
	this.STATS[K.COM_X + offset] = axial;
	this.STATS[K.COM_Y + offset] = rotation;
	this.STATS[K.RT + offset] = albedo;
	this.STATS[K.CM + offset] = greenhouse;
	this.STATS[K.G_R + offset] = age;
	this.STATS[K.COM_Z + offset] = radius;
	this.STATS[K.GMAX + offset] = g;
	this.STATS[K.VMAX + offset] = Ve;
	this.STATS[K.PWR + offset] = surf_temp;
	this.STATS[K.VOLUME + offset] = atm;
	this.STATS[K.DENSITY + offset] = atmo_dens;
	this.STATS[K.FIT + offset] = atmo_comp;
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
// #region - REFRESH
//========================================================================
/**
 * @desc 
 * @param {Number} switchID 
 * @param {import("./index").duration} dt in s
 * @returns {Promise<Boolean>}
 */
MAGPIE_ENTITY.prototype.refresh = async function refresh(switchID, dt)
{
	const ePrefix = `[ENTITY-${this.ID}].refresh: `;
	try
	{
		if(isNaN(switchID))
			throw new Error(`${switchID} is invalid switchID`);
		if(isNaN(dt))
			throw new Error(`${dt} is invalid dT`);
		const state = this.processStates(switchID, dt);
		const inputExp = this.processExp(switchID, dt, state);
		const influence = this.processAgency(switchID, dt);
		const output = this.updatePhysics(switchID, dt);
		this._socketEmit(output);
		return true
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return false
	}
}
MAGPIE_ENTITY.prototype.processExp = function processExp(switchID, dt)
{
	const ePrefix = `[ENTITY-${this.ID}].processExp: `;
	if(this.exps.length < 1) return
	try
	{
		const exp = this.exps.shift()
		if(!(exp instanceof MAGPIE_EXP))
			throw new Error(`${exp} is invalid EXP`);
		const emote = MAGPIE_EMOTE.INDEX.get(exp.emoteID);
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
module.exports = { MAGPIE_ENTITY }
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================