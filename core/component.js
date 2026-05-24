/**
 * @name INDEX
 * @desc 
 * @version 0.22.26
 */
//========================================================================
// #region - INDEX
//========================================================================
const { MAGPIE } = require("./index");
const { 
	MAGPIE_SYSTEM,
	MAGPIE_DATE
 } = require("./system");
function MAGPIE_COMPONENT(data)
{
	this.initialize(data);
}
function MAGPIE_STATE(data)
{
	this.initialize(data)
}
/**
 * @class
 * @param {{
 * subject: entityID,
 * target: entityID,
 * emoteID: emoteID,
 * keys: keyID[]
 * }} data exp_data
 * @returns {new MAGPIE_EXP}
 */
function MAGPIE_EXP(data = {})
{
	this.initialize(data)
}
/**
 * 
 * @param {{
 * ID: Number,
 * name: String,
 * type: Enumerator<Number>,
 * description,
 * condition: (...args) => Boolean,
 * onAction: Function,
 * onPassive: Function
 * }} data 
 * @returns {new MAGPIE_EMOTE}
 */
function MAGPIE_EMOTE(data)
{
	this.initialize(data)
}
/**
 * 
 * @param {{
 * ID: contextID,
 * type: context_type,
 * updated: epoch_real,
 * entities: MAGPIE_ENTITY,
 * exps: MAGPIE_EXP[],
 * keys: MAGPIE_KEY[],
 * symbols: MAGPIE_SYMBOL[],
 * date: MAGPIE_DATE
 * }} data 
 * @returns {new MAGPIE_CONTEXT}
 */
function MAGPIE_CONTEXT(data)
{
	this.initialize(data)
}
function MAGPIE_TICKET(data)
{
	this.initialize(data);
}
/**
 * 
 * @param {{
 * ID: keyID,
 * type: key_type,
 * label: key_label,
 * originID: keyID,
 * compoundID: keyID,
 * symbolID: symbolID
 * }} data 
 * @returns {new MAGPIE_KEY}
 */
function MAGPIE_KEY(data)
{
	this.initialize(data)
}
/**
 * 
 * @param {{
 * ID: symbolID,
 * type: symbol_type,
 * name: String,
 * desc: String,
 * requirementID: symbolID,
 * compoundID: symbolID,
 * STATS: Float64Array
 * }} data 
 * @returns {new MAGPIE_SYMBOL}
 */
function MAGPIE_SYMBOL(data)
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
 * @typedef {import("./system").database_result} database_result
 * @typedef {import("./index").index} index
 * @typedef {Number} array_size
 * @typedef {import("./index").stamina_index} stamina_index
 * @typedef {import("./index").vector3} vector3
 * @typedef {import("./index").bivector} bivector
 * 
 * @name COMPONENT
 * @desc 
 * 
 */
//========================================================================
// #region - COMPON.
//========================================================================
MAGPIE_COMPONENT.meta = {};
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > proto
//------------------------------------------------------------------------
MAGPIE_COMPONENT.prototype.initialize = function initialize(data)
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
 * @param {String} method 
 * @param {*} value 
 * @returns {MAGPIE_COMPONENT}
 */
MAGPIE_COMPONENT.__get = function get(method, value)
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
// #region > Setters
//------------------------------------------------------------------------
/**
 * 
 * @param {String} method 
 * @param {*} value
 * @returns {Promise<database_result>} 
 */
MAGPIE_COMPONENT.__set = async function set(method, value)
{
	//
} 
/**
 * 
 * @param {String} method 
 * @param {*} value
 * @returns {database_result} 
 */
MAGPIE_COMPONENT.__setSync = function setSync(method, value)
{
	//
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
// #region - SYMBOL
//========================================================================
MAGPIE_SYMBOL.meta = "";
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------
/**
 * @typedef {Number} symbolID
 * @typedef {Number} symbol_type {@link MAGPIE.KEY.SYMBOL.TYPE.meta}
 * @typedef {import("./index").STAT} STAT aka static parameter
 * @typedef {import("./entity").STATS} STATS
 * @typedef {{ID: symbolID,
 * type: symbol_type,
 * name: String,
 * desc: String,
 * requirementID: symbolID,
 * compoundID: symbolID,
 * STATS: Float64Array
 * }} symbol_data
 * @param {symbol_data} data 
 */
MAGPIE_SYMBOL.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_SYMBOL";
	this.ID = Number(data?.ID) || Date.now();
	this.type = Number(data?.type) || 0;
	this.name = String(data?.name) || "";
	this.desc = String(data?.desc) || "";
	const K = MAGPIE.KEY.INDEX;
	const reqs = K.REQUIREMENTS;
	const comps = K.COMPOUNDS;
	const stats = K.STATS;
	this.STATS = new Float64Array(data?.STATS || [reqs,comps,stats])
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
 * @returns {String}
 */
MAGPIE_SYMBOL.prototype.getTypeName = function getTypeName()
{
	return Object.keys(MAGPIE.KEY.SYMBOL.TYPE).find(key => {
		key === MAGPIE.KEY.SYMBOL.TYPE[key]
	})
}
/**
 * 
 * @param {keyID} keyID
 * @returns {MAGPIE_KEY} 
 */
MAGPIE_SYMBOL.prototype.getKey = function getKey(keyID)
{
	return MAGPIE_COMPONENT.__get("_get_key", [keyID]);
}
/**
 * 
 * @returns {symbolID[]}
 */
MAGPIE_SYMBOL.prototype._get_requirementIDs = function getRequirementIDs()
{
	const K = MAGPIE.KEY.INDEX;
	const start = this.STATS.indexOf(K.REQUIREMENTS);
	const end = this.STATS.indexOf(K.COMPOUNDS);
	return this.STATS.slice(start + 1, end) || [];
}
MAGPIE_SYMBOL.prototype._get_all_requirements = function getAllRequirements()
{
	const requirementIDs = this._get_requirementIDs();
	if(requirementIDs.length < 1) return []
	return requirementIDs.map(ID => MAGPIE_COMPONENT.__get("_get_symbol", [ID]))
}
/**
 * 
 * @returns {symbolID[]}
 */
MAGPIE_SYMBOL.prototype._get_compoundIDs = function getCompoundIDs()
{
	const K = MAGPIE.KEY.INDEX;
	const start = this.STATS.indexOf(K.COMPOUNDS);
	const end = this.STATS.indexOf(K.STATS);
	return this.STATS.slice(start + 1, end);
}
MAGPIE_SYMBOL.prototype._get_all_compounds = function getAllCompounds()
{
	const compoundIDs = this._get_compoundIDs();
	if(compoundIDs.length < 1) return [];
	return compoundIDs.map(ID => MAGPIE_COMPONENT.__get("_get_symbol", [ID]))
}
/**
 * 
 * @returns {STAT[]}
 */
MAGPIE_SYMBOL.prototype._get_STATS = function getSTATS()
{
	const K = MAGPIE.KEY.INDEX;
	const start = this.STATS.indexOf(K.STATS);
	return this.STATS.slice(start + 1)
}
/**
 * 
 * @returns {{key: value}}
 */
MAGPIE_SYMBOL.prototype.mapStats = function mapStats()
{
	const ePrefix = `[SYMBOL-${this.ID}].mapStats: `;
	try
	{
		const map = this.STATS;
		const K = MAGPIE.KEY.INDEX;
		const STATS = {};
		map.forEach((keyID, index) => {
			if(index % 2 === 0)
			{
				const key = this.getKey(keyID)?.label;
				if(!key) 
					throw new Error(`unable to find [KEY-${keyID}]`)
				STATS[key] = map[index + 1];
			}
		})
		return STATS
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
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
 * }} Vspeeds Object{key: value}
 * @returns {Vspeeds} 
 */
MAGPIE_SYMBOL.prototype.getVspeeds = function getVspeeds()
{
	const ePrefix = `[SYMBOL-${this.ID}].getVspeeds: `;
	try
	{
		const map = this._get_STATS();
		const K = MAGPIE.KEY.INDEX;
		const keys = Array.from(K.VSPEEDS.values())
		const values = Array.from(K.VSPEEDS.keys());
		const Vspeeds = {};
		map.forEach((keyID, index) => {
			if(index % 2 === 0 && values.includes(keyID))
				Vspeeds[K.VSPEEDS.get(keyID)] = map[index + 1]
		})
		// MAGPIE_SYSTEM._logging_debug(Object.entries(Vspeeds))
		return Vspeeds
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * 
 * @returns {keyID[]}
 */
MAGPIE_SYMBOL.prototype.getKeys = function getKeys()
{
	return this.STATS.map((item, index) => {
		if(index % 2 === 0)
			item
	})
}
/**
 * 
 * @param {keyID} keyID
 * @returns {key_value} 
 */
MAGPIE_SYMBOL.prototype._get_keyID = function getKeyID(keyID)
{
	const index = this.STATS.indexOf(keyID);
	if(index % 2 !== 0)
		return 
	return this.STATS[index + 1]
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
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype.set = async function set()
{
	return await MAGPIE_COMPONENT.__set("_set_symbol", this);
}
/**
 * 
 * @returns {database_result}
 */
MAGPIE_SYMBOL.prototype.setSync = function setSync()
{
	return MAGPIE_COMPONENT.__setSync("_set_symbolSync", [this]);
}
/**
 * 
 * @param {String} element 
 * @param {symbolID} symbolID 
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addElement = async function addElement(element, symbolID)
{
	const ePrefix = `[SYMBOL-${this.ID}].addElement: `;
	try
	{
		if(!symbolID || isNaN(symbolID))
			throw new Error(`${symbolID} is invalid symbolID`)
		const key = MAGPIE.KEY.INDEX[`${element.toUpperCase()}S`];
		if(isNaN(key))
			throw new Error(`${key} is invalid element key`)
		const arr = new Array(...this.STATS);
		const index = arr.indexOf(key);
		if(isNaN(index))
			throw new Error(`${index} is invalid STATS index`)
		arr.splice(index, 0, symbolID);
		this.STATS = new Float64Array(arr);
		const result = this.set();
		if(!result)
			throw new Error(`unable to save [REQUIREMENT-${symbolID}]`)
		return await result
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @param {symbolID} symbolID 
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addRequirement = async function addRequirement(symbolID)
{
	return await this._addElement("requirement", symbolID);
}
/**
 * 
 * @param {symbolID} symbolID 
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addCompound = async function addCompound(symbolID)
{
	return await this._addElement("requirement", symbolID);
}
/**
 * 
 * @param {symbolID} symbolID 
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addRecipe = async function addRecipe(symbolID)
{
	const symbol = MAGPIE_SYMBOL.__get("_get_symbol", [symbolID])
	if(!(symbol instanceof MAGPIE_SYMBOL))
		return
	const result = symbol._addRequirement(this.ID);
	if(!result)
		return
	return await result
}
/**
 * 
 * @param {symbolID} symbolID 
 * @returns {Promise<database_result>}
 */
MAGPIE_SYMBOL.prototype._addComponent = async function addComponent(symbolID)
{
	const symbol = MAGPIE_SYMBOL.__get("_get_symbol", [symbolID])
	if(!(symbol instanceof MAGPIE_SYMBOL))
		return
	const result = symbol._addCompound(this.ID);
	if(!result)
		return
	return await result
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
MAGPIE_STATE.meta = {};
/** @type {Map<stateID, MAGPIE_STATE>} */
MAGPIE_STATE.INDEX = new Map();
MAGPIE_STATE.setup = function setup()
{
	const data = require("../data/states").states;
	for(const state_data of data)
	{
		MAGPIE_STATE.INDEX.set(state_data.ID, new MAGPIE_STATE(state_data))
	}
}
/**
 * 
 * @param {import("../data/states").state_data} data 
 * @returns {new MAGPIE_STATE}
 */
MAGPIE_STATE.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_STATE";
	this.ID = data.ID;
	this.type = data.type;
	this.name = data.name;
	this.description = data.description;
	this.stack = data.stack;
	this.onUpdate = data.onUpdate;
	this.onApply = data.onApply;
	this.onRemove = data.onRemove;
	this.onExpire = data.onExpire;
}
/**
 * 
 * @param {stateID} stateID 
 */
MAGPIE_STATE.validate = function validate(stateID)
{
	if(!stateID || isNaN(stateID))
		throw new Error(`${stateID} is invalid stateID`)
	const state = MAGPIE_STATE.INDEX.get(stateID);
	if(!state)
		throw new Error(`${stateID} is invalid state`);
	return true
}
MAGPIE_STATE.validateChange = function validateChange(state)
{
	const ePrefix = "[STATE].validateChange: ";
	try
	{
		if(!state || state?.length !== 2)
			throw new Error(`${state} is invalid state parameters`)
		const [stateID, index] = state;
		const valid = MAGPIE_STATE.validate(stateID)
		if(!isNaN(index))
			throw new Error(`${index} is invalid state index`);
		if(!valid)
			throw new Error(`${stateID} is invalid stateID`)
		return state
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
		return null
	}
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - STATE
//========================================================================
/**
 * @name 
 * @desc 
 * @typedef {Number} emoteID
 * @typedef {import("./entity").entityID} entityID
 * @typedef {import(".").keyID} keyID
 * @typedef {Number} key_value
 */
//========================================================================
// #region - EXP
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Proto
//------------------------------------------------------------------------

/**
 * @typedef {{
 * subject: entityID,
 * target: entityID,
 * emoteID: emoteID,
 * keys: keyID[]
 * }} exp_data
 * 
 * @param {exp_data} data 
 * @returns {new MAGPIE_EXP}
 */
MAGPIE_EXP.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_EXP";
	this.ID = Date.now();
	this.subjectID = data?.subject || NaN;
	this.targetID = data?.target || NaN;
	this.emoteID = data?.emoteID || NaN;
	this.value = data?.value || NaN;
	this.keys = data?.keys || [NaN];
}
/**
 * 
 * @param {String} method 
 * @param {[]} arguments
 * @returns {*} 
 */
MAGPIE_EXP.__hiveSync = function __hiveSync(method, arguments)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {[]} arguments
 * @returns {Promise<*>} 
 */
MAGPIE_EXP.__hive = function __hive(method, arguments)
{
	//
}
/**
 * 
 * 
 * @returns {Promise<database_result>} 
 */
MAGPIE_EXP.prototype.set = async function save()
{
	return await MAGPIE_EXP.__hive("_set_exp", [this])
}
/**
 * 
 * 
 * @returns {database_result} 
 */
MAGPIE_EXP.prototype.setSync = function saveSync()
{
	return MAGPIE_EXP.__hiveSync("_set_expSync", [this])
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Keys
//------------------------------------------------------------------------
/**
 * 
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_EXP.prototype.getKeys = function getKeys()
{
	return MAGPIE_EXP.__hiveSync("_get_expKeys", [this])
}
/**
 * 
 * @param {keyID} keyID 
 * @returns {keyID}
 */
MAGPIE_EXP.prototype._key_remove = function _key_remove(keyID)
{
	const index = this.keys.findIndex(ID => ID === keyID);
	if(isNaN(index) || index < 0)
		return
	this.keys.splice(index, 1);
	this.set();
	return keyID
}
/**
 * 
 * @param {keyID} keyID 
 * @returns {array_size}
 */
MAGPIE_EXP.prototype._key_add = function addKey(keyID)
{
	if(isNaN(keyID))
		return
	this.keys.push(keyID);
	this.set();
	return this.keys.length;
}
/**
 * 
 * @param {keyID} keyID 
 * @param {index} index 
 * @returns {array_size}
 */
MAGPIE_EXP.prototype._key_splice = function spliceInKey(keyID, index)
{
	if(isNaN(keyID))
		throw new Error(`${keyID} is invalid keyID`)
	if(isNaN(index) || index < 0)
		throw new Error(`${index} is invalid index`)
	const lastIndex = this.keys.length - 1;
	if(index > lastIndex)
		this.keys.push(keyID);
	else this.keys.splice(index, 0, keyID);
	this.set();
	return this.keys.length
}
/**
 * 
 * @param {keyID} keyID 
 * @returns {Boolean}
 */
MAGPIE_EXP.prototype._get_hasKey = function hasKey(keyID)
{
	return this.keys.includes(keyID)
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Subject
//------------------------------------------------------------------------
/**
 * 
 * @returns {STATS}
 */
MAGPIE_EXP.prototype._get_subjectSTATS = function _get_subjectSTATS()
{
	return MAGPIE_EXP.__hiveSync("_get_entity", [this.subjectID])?.STATS
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
 * 
 * @returns {STATS}
 */
MAGPIE_EXP.prototype._get_targetSTATS = function _get_targetSTATS()
{
	return MAGPIE_EXP.__hiveSync("_get_entity", [this.targetID])?.STATS
}
/**
 * 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_EXP.prototype._get_key_target = function getKeyTarget()
{
	return this.getKeys()?.find(key => {
		key.originID === MAGPIE.KEY.INDEX.TARGET
	});
}
/**
 * @returns {entityID} entityID
 */
MAGPIE_EXP.prototype._emote_onTarget = function _emote_onTarget()
{
	const ePrefix = `[EXP-${this.ID}].emoteArrived: `;
	try
	{
		const next = this._key_target_next()
		if(isNaN(next))
			return
		return this.targetID = next;
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}
/**
 * 
 * @returns {entityID} entityID
 */
MAGPIE_EXP.prototype._key_target_next = async function keyTargetNext()
{
	const ePrefix = `[EXP-${this.ID}].keyTargetNext`;
	try
	{
		const key = this._get_key_target();
		if(!key) return
		const result = await key.removeOrigin();
		if(!result) 
			throw new Error(`unable to remove 'target' origin from [KEY-${key.ID}]`)
		const next = this._get_key_target();
		if(!next) return
		return Number(next.label);
	}
	catch(e)
	{
		MAGPIE_SYSTEM(ePrefix + e.message, e)
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
// #region > Stamina
//------------------------------------------------------------------------
/**
 * @returns {stamina_index}
 */
MAGPIE_EXP.prototype._get_stamina_index = function getStaminaINdex()
{
	this.keys.forEach(keyID => {
		const index = MAGPIE.KEY.INDEX.STAMINA.get(keyID);
		if(index) return index
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
// #region > Utils
//------------------------------------------------------------------------

/**
 * 
 * @returns {import("./entity").entity_speeds}
 */
MAGPIE_EXP.prototype._key_mapVspeeds = function mapVspeeds()
{
	const K = MAGPIE.KEY.INDEX;
	const keys = this.getKeys();
	if(keys.length < 1) return
	const Vspeeds = {};
	for(const key of keys)
	{
		if(key.originID >= K.VMAX && key.originID <= K.TDOCK)
			Vspeeds[key.getOrigin()?.label] = Number(key.label)
	}
	return Vspeeds
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
// #region - EMOTE
//========================================================================
MAGPIE_EMOTE.meta = {};
/** @type {Map<emoteID, MAGPIE_EMOTE>} */
MAGPIE_EMOTE.INDEX = new Map();
MAGPIE_EMOTE.setup = async function()
{
	const data = require("../data/emotes");
	for(const emote_data of data)
	{
		MAGPIE_EMOTE.INDEX.set(emote_data.ID, new MAGPIE_EMOTE(emote_data));
	}
}
/**
 * 
 * @param {{
 * ID: Number,
 * name: String,
 * type: Enumerator<Number>,
 * description,
 * condition: (...args) => Boolean,
 * onAction: (
 * exp: MAGPIE_EXP, 
 * entity: MAGPIE_ENTITY, 
 * stamina_index: stamina_index
 * ) => {callback: Function},
 * onPassive: (exp: MAGPIE_EXP, entity: MAGPIE_ENTITY) => {}
 * }} data 
 * @returns {new MAGPIE_EMOTE}
 */
MAGPIE_EMOTE.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_EMOTE";
	this.ID = data.ID;
	this.name = data.name;
	this.type = data.type;
	this.description = data.description;
	this.condition = data.condition;
	this.onAction = data.onAction;
	this.onPassive = data.onPassive;
}
MAGPIE_EMOTE.prototype.condition = function condition(...args)
{
	return true
}
MAGPIE_EMOTE.prototype.onAction = function onAction(...args)
{
	// 
}
MAGPIE_EMOTE.prototype.onPassive = function onPassive(...args)
{
	//
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - EMOTE
//========================================================================
/**
 * @name 
 * @desc 
 * @typedef {Number} contextID
 * @typedef {Enumerator<Number>} context_type
 * @typedef {import("./system").epoch_real} epoch_real
 * @typedef {import("./entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("./index").urgency} urgency
 * @typedef {import("./index").gravity} gravity
 * @typedef {import("./index").ambiguity} ambiguity
 * @typedef {{
 * ID: contextID,
 * type: context_type,
 * updated: epoch_real,
 * entities: MAGPIE_ENTITY,
 * exps: MAGPIE_EXP[],
 * keys: MAGPIE_KEY[],
 * symbols: MAGPIE_SYMBOL[],
 * date: MAGPIE_DATE,
 * urgency: urgency,
 * graivty: gravity,
 * ambiguity: ambiguity
 * }} context_data
 */
//========================================================================
// #region - CONTEXT
//========================================================================
/**
 * 
 * @param {context_data} data 
 * @returns {new MAGPIE_CONTEXT}
 */
MAGPIE_CONTEXT.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_CONTEXT";
	this.ID = Number(data?.ID) || Date.now();
	this.type = Number(data?.type) || 0;
	this.updated = Number(data?.updated) || this.ID;
	this.entities = new Float64Array(data?.entities || 0);
	this.exps = new Float64Array(data?.exps || 0) 
	this.keys = new Float64Array(data?.keys || 0);
	this.symbols = new Float64Array(data?.symbols || 0);
	this.metadate = Number(data?.metadate) || 0;
	this.urgency = Number(data?.urgency || NaN);
	this.gravity = Number(data?.gravity || NaN);
	this.ambiguity = Number(data?.ambiguity || NaN);
}	
/**
 * 
 * @param {String} method 
 * @param {[]} arguments
 * @returns {*} 
 */
MAGPIE_CONTEXT.__hiveSync = function __hiveSync(method, arguments)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {[]} arguments
 * @returns {Promise<*>} 
 */
MAGPIE_CONTEXT.__hive = async function __hive(method, arguments)
{
	//
}
/**
 * 
 * @returns {database_result}
 */
MAGPIE_CONTEXT.prototype.setSync = function setSync()
{
	return MAGPIE_CONTEXT.__hiveSync("_set_databaseSync", ["saveContextSync", [this]])
}
/**
 * 
 * @returns {Promise<Boolean>}
 */
MAGPIE_CONTEXT.prototype._awake = async function _awake()
{
	return await MAGPIE_CONTEXT.__hive("_host_context", [this])
}
MAGPIE_CONTEXT.prototype._sleep = async function _sleep()
{
	return await MAGPIE_CONTEXT.__hive("_kick_context", [this, "context_sleep"])
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - CONTEXT
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - TICKET
//========================================================================
MAGPIE_TICKET.prototype.initialize = function initialize(data)
{
	//
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - TICKET
//========================================================================
/**
 * @typedef {import("./index").key_type} key_type
 * @typedef {String} key_label
 * @typedef {import("./index").velocity} velocity in m/s
 * @typedef {import("./index").acceleration} acceleration in m/s²
 * @typedef {import("./index").omega} omega (ω) angular velocity in rad/s
 * @typedef {import("./index").alpha} alpha (α) angular acceleration in rad/s²
 * @typedef {import("./index").key_data} key_data
 * 
 * @name 
 * @desc 
 * @param {Object} data
 * @returns {new MAGPIE_KEY}
 */
//========================================================================
// #region - KEY
//========================================================================
MAGPIE_KEY.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_KEY";
	this.ID = Number(data?.ID) || Date.now();
	this.type = Number(data?.type) || 0;
	this.label = String(data?.label) || "";
	this.originID = Number(data?.originID) || 0;
	this.compoundID = Number(data?.compoundID) || 0;
	this.symbolID = Number(data?.symbolID) || 0;
}
/**
 * @returns {Promise<Boolean>}
 */
MAGPIE_KEY.setup = async function setup()
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {[*]} arguments
 * @returns {Promise<*>} 
 */
MAGPIE_KEY.__hive = async function __hive(method, arguments)
{
	//
}
/**
 * 
 * @param {String} method 
 * @param {[]} arguments 
 * @returns {*}
 */
MAGPIE_KEY.__hiveSync = function __hiveSync(method, arguments)
{
	//
}
/**
 * 
 * @param {key_data} data 
 * @returns {database_result: new MAGPIE_KEY}
 */
MAGPIE_KEY._newKey = function newKey(data)
{
	const key = new MAGPIE_KEY(data);
	return key.setSync()
}
/**
 * 
 * 
 * @returns {Promise<database_result>}
 */
MAGPIE_KEY.prototype.set = async function set()
{
	return await MAGPIE_KEY.__hive("_set_database", ["saveKey", [this]])
}
/**
 * 
 * 
 * @returns {database_result}
 */
MAGPIE_KEY.prototype.setSync = function setSync()
{
	return  MAGPIE_KEY.__hiveSync("_set_databaseSync", ["saveKeySync", [this]])
}
/**
 * 
 * @param {key_type} key_type
 * @returns {Promise<database_result>} 
 */
MAGPIE_KEY.prototype._set_type = async function setType(key_type)
{
	const ePrefix = `[KEY-${this.ID}].setType: `;
	try
	{
		if(isNaN(key_type))
			throw new Error(`${key_type} is invalid key_type`)
		this.type = key_type
		return this.set();
	}
	catch(e)
	{
		MAGPIE_SYSTEM.error(ePrefix + e.message, e)
	}
}

/**
 * 
 * @param {keyID} keyID 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_KEY.prototype.getKey = async function getKey(keyID)
{
	return await MAGPIE_KEY.__hiveSync(`_get_key`, [keyID])
}
/**
 * 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_KEY.prototype.getOrigin = function getOrigin()
{
	return this.getKey(this.originID)
}
MAGPIE_KEY.prototype.setOrigin = async function setOrigin(keyID)
{
	this.originID = keyID;
	return this.set();
}
MAGPIE_KEY.prototype.removeOrigin = async function removeOrigin()
{
	this.originID = null;
	return this.set();
}
/**
 * 
 * @returns {String}
 */
MAGPIE_KEY.prototype._get_type = function getType()
{
	return MAGPIE.KEY.TYPES.get(this.type)
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - KEY
//========================================================================

module.exports = { 
	MAGPIE_COMPONENT,
	MAGPIE_STATE,
	MAGPIE_EMOTE,
	MAGPIE_EXP,
	MAGPIE_KEY,
	MAGPIE_CONTEXT,
	MAGPIE_TICKET,
	MAGPIE_SYMBOL
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================