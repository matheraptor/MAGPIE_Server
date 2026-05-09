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
function MAGPIE_KEY(data)
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
		MAGPIE_EMOTE.INDEX.set(emote_data.ID, new MAGPIE_EMOTE(emote_data))
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
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > key
//------------------------------------------------------------------------
MAGPIE_KEY.prototype.initialize = function initialize(data)
{
	this.ID = Date.now();
	this.type = data?.type || 0;
	this.label = data?.label || "";
	this.originID = data?.originID || 0;
	this.compoundID = data?.compoundID || 0;
	this.symbolID = data?.symbolID || 0;
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
	MAGPIE_TICKET
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================