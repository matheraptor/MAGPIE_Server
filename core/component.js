/**
 * @name INDEX
 * @desc 
 * 
 */
//========================================================================
// #region - INDEX
//========================================================================
const { MAGPIE } = require("./index");
const { MAGPIE_SYSTEM } = require("./system");
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
 * @param {{}} data
 * @returns {new MAGPIE_TRAIT} 
 */
function MAGPIE_TRAIT(data = {})
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
MAGPIE_SYMBOL.prototype._get_requirements = function getRequirements()
{
	const K = MAGPIE.KEY.INDEX;
	const start = this.STATS.indexOf(K.REQUIREMENTS);
	const end = this.STATS.indexOf(K.COMPOUNDS);
	return this.STATS.slice(start + 1, end);
}
MAGPIE_SYMBOL.prototype._get_compounds = function getCompounds()
{
	const K = MAGPIE.KEY.INDEX;
	const start = this.STATS.indexOf(K.COMPOUNDS);
	const end = this.STATS.indexOf(K.STATS);
	return this.STATS.slice(start + 1, end);
}
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
	return MAGPIE_COMPONENT.__get("loadKeySync", [keyID]);
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
	return await MAGPIE_COMPONENT.__set("saveSymbol", this);
}
/**
 * 
 * @returns {database_result}
 */
MAGPIE_SYMBOL.prototype.setSync = function setSync()
{
	return MAGPIE_COMPONENT.__setSync("saveSymbolSync", [this]);
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
		if(valid)
			return state
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
// #endregion - STATE
//========================================================================
/**
 * @name 
 * @desc 
 * @typedef {Number} emoteID
 * @typedef {import("./entity").entityID} entityID
 * @typedef {import(".").keyID} keyID
 */
//========================================================================
// #region - EXP
//========================================================================
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
 * 
 * @returns {Promise<database_result>} 
 */
MAGPIE_EXP.prototype.set = async function save()
{
	//
}
/**
 * 
 * 
 * @returns {database_result} 
 */
MAGPIE_EXP.prototype.setSync = function saveSync()
{
	//
}
/**
 * @param {keyID} keyID
 * @returns {MAGPIE_KEY}
 */
MAGPIE_EXP.prototype.getKey = function getKey(keyID)
{
	//
}
MAGPIE_EXP.__getKey = MAGPIE_EXP.prototype.getKey;
/**
 * 
 * @returns {STATS}
 */
MAGPIE_EXP.prototype._get_subjectSTATS = function _get_subjectSTATS()
{
	return MAGPIE_EXP.__hiveSync("_get_entity", [this.subjectID])?.STATS
}
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
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_EXP.prototype.getKeys = function getKeys()
{
	let keys = [];
	for(const keyID of this.keys)
	{
		keys.push(this.getKey(keyID))
	}
	return keys
}
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
/**
 * 
 * @param {keyID} keyID 
 */
MAGPIE_EXP.prototype.removeKey = function removeKey(keyID)
{
	const index = this.keys.findIndex(ID => ID === keyID);
	this.keys.splice(index, 1);
	MAGPIE_EXP.__saveSync(this);
	return keyID
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
 * 
 * @param {keyID} keyID 
 * @returns {Boolean}
 */
MAGPIE_EXP.prototype._get_hasKey = function hasKey(keyID)
{
	return this.keys.includes(keyID)
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
 * onAction: (...args) => {
 * exp: MAGPIE_EXP,
 * addState: [Number, Number],
 * removeState: [Number, Number],
 * switchState: [Number, Number, Number, Number],
 * value: Number
 * },
 * onPassive: Function
 * }} data 
 * @returns {new MAGPIE_EMOTE}
 */
MAGPIE_EMOTE.prototype.initialize = function initialize(data)
{
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
 * 
 */
//========================================================================
// #region - CONTEXT
//========================================================================
MAGPIE_CONTEXT.prototype.initialize = function initialize(data)
{
	//
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
 * @param {String} property 
 * @param {*} value 
 * @returns {database_result}
 */
MAGPIE_KEY.prototype.setSync = function setSync(property, value)
{
	//
}
/**
 * 
 * @param {String} property 
 * @param {*} value 
 * @returns {Promise<database_result>}
 */
MAGPIE_KEY.prototype.set = async function set(property, value)
{
	//
}
/**
 * 
 * @param {String} property 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_KEY.prototype.get = function get(property)
{
	//
}
/**
 * 
 * @returns {MAGPIE_KEY}
 */
MAGPIE_KEY.prototype.getOrigin = function getOrigin()
{
	return this.get(this.originID)
}
MAGPIE_KEY.prototype.setOrigin = function setOrigin(keyID)
{
	//
}
MAGPIE_KEY.prototype.removeOrigin = function removeOrigin()
{
	//
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