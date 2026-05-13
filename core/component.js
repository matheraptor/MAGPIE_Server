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
 * 
 * @param {exp_data} data 
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
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @typedef {import("./system").database_result} database_result
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
 * @typedef {Number} stateID
 */
//------------------------------------------------------------------------
// #region > state
//------------------------------------------------------------------------
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
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * @param {exp_data} data
 * @returns {new MAGPIE_EXP}
 * 
 * @typedef {{
 * subject: entityID,
 * target: entityID,
 * emoteID: emoteID,
 * keys: keyID[]
 * }} exp_data
 * @typedef {import(".").keyID} keyID
 * @typedef {Number} emoteID
 * @typedef {import("./entity").entityID} entityID
 */
//------------------------------------------------------------------------
// #region > exp
//------------------------------------------------------------------------
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
 * @returns {MAGPIE_KEY[]}
 */
MAGPIE_EXP.prototype.getKeys = function getKeys()
{
	//
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {Promise<database_result>} 
 */
MAGPIE_EXP.__save = async function save(exp)
{
	//
}
/**
 * 
 * @param {MAGPIE_EXP} exp
 * @returns {database_result} 
 */
MAGPIE_EXP.__saveSync = function saveSync(exp)
{
	//
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
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > emote
//------------------------------------------------------------------------
MAGPIE_EMOTE.meta = {};
MAGPIE_EMOTE.INDEX = new Map();
MAGPIE_EMOTE.setup = function()
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
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > context
//------------------------------------------------------------------------
MAGPIE_CONTEXT.prototype.initialize = function initialize(data)
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
// #region > ticket
//------------------------------------------------------------------------
MAGPIE_TICKET.prototype.initialize = function initialize(data)
{
	//
}
// #endregion
//------------------------------------------------------------------------
/**
 * @typedef {import("./index").key_type} key_type
 * @typedef {String} key_label
 * 
 * @name 
 * @desc 
 * @param {Object} data
 * @returns {new MAGPIE_KEY}
 */
//------------------------------------------------------------------------
// #region > key
//------------------------------------------------------------------------
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
 * 
 * @param {String} property 
 * @param {*} value 
 * @returns {database_result}
 */
MAGPIE_KEY.prototype.set = function set(property, value)
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
 * @typedef {Number} symbol_type
 * @param {Object} data 
 */
MAGPIE_SYMBOL.prototype.initialize = function initialize(data)
{
	this._firmware = "MAGPIE_SYMBOL";
	this.ID = Number(data?.ID) || Date.now();
	this.type = Number(data?.type) || 0;
	this.name = String(data?.name) || "";
	this.desc = String(data?.desc) || "";
	this.requirementID = Number(data?.requirementID) || 0;
	this.compoundID = Number(data?.compoundID) || 0;
	this.STATS = new Float64Array(data?.STATS || 0);
}
/**
 * 
 * @returns {{ "Number": Number }}
 */
MAGPIE_SYMBOL.prototype.mapStats = function mapStats()
{
	if(this.STATS.length < 1) return
	const arr = this.STATS;
	return Object.fromEntries(
		arr.reduce((acc, curr, i) => {
			if(i % 2 === 0) acc.push([curr, arr[i + 1]]);
			return acc;
		}, [])
	)
}
/**
 * 
 * @returns {{Vmax: Number, Vsafe: Number, Vcruise: Number, Vcreep: Number}}
 */
MAGPIE_EXP.prototype._key_mapVspeeds = function mapVspeeds()
{
	const K = MAGPIE.KEY.INDEX;
	const keys = this.getKeys();
	if(keys.length < 1) return
	const Vmax = Number(keys.find(key => key.originID === K.VMAX)?.label);
	const Vsafe = Number(keys.find(key => key.originID === K.VSAFE)?.label);
	const Vcruise = Number(keys.find(key => key.originID === K.VCRUISE)?.label);
	const Vcreep = Number(keys.find(key => key.originID === K.VCREEP)?.label);
	return { Vmax, Vsafe, Vcruise, Vcreep }
}
/**
 * 
 * @returns {{Vmax: Number, Vsafe: Number, Vcruise: Number, Vcreep: Number }}
 */
MAGPIE_SYMBOL.prototype.getVspeeds = function getVspeeds()
{
	const map = this.mapStats();
	const V = MAGPIE.KEY.INDEX;
	const Vmax = map[V.VMAX];
	const Vsafe = map[V.VSAFE];
	const Vcruise = map[V.VCRUISE];
	const Vcreep = map[V.VCREEP];
	return { Vsafe, Vcruise, Vcreep }
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