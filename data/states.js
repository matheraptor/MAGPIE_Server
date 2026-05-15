const { MAGPIE } = require("../core/index");
/**
 * @typedef {{
 * ID: Number,
 * type: state_type, 
 * name: String,
 * description: String,
 * stack: Number,
 * onUpdate: (...args) => {},
 * onApply: (...args) => {},
 * onRemove: (...args) => {},
 * onExpire: (...args) => {}
 * }} state_data
 */
const INDEX = {};
/** 
 * @typedef {Enumerator<Number>} state_type
 *  
 * */
const TYPE = {};
//PERMANENT STATES
/** @type {state_type} @desc permanent state type */
TYPE.PERMANENT = 0;
/** @type {state_type} @desc growth level state type */
TYPE.G_LVL = TYPE.PERMANENT + 1;
/** @type {state_type} @desc accumulator state type */
TYPE.ACCUMULATOR = TYPE.G_LVL + 1;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM = TYPE.ACCUMULATOR + 1;
//TEMPORARY STATES (1 turn)
/** @type {state_type} @desc temporary state type */
TYPE.TEMP = 100;
// INDEX
const effect = {
	expire: true,
	purge: true,
	stats: [],
	pushStates: [],
	popStates: []
}
/** @type {state_data[]}  */
const states = [];

/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - 0 to 100
//========================================================================
/**
 * @name Permanents
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Template
//------------------------------------------------------------------------
const TEMPLATE = {
	ID: 0,
	type: 0,
	name: "TEMPLATE",
	description: "",
	stack: 0,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(TEMPLATE)
/** @type {Enumerator<Number>}  */
INDEX.TEMPLATE = TEMPLATE.ID;
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
 * @name GrowthLevels
 * @desc 
 * 
 */
//========================================================================
// #region - 101 to 200
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > 
//------------------------------------------------------------------------

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
 * @name Accumulators
 * @desc 
 * 
 */
//========================================================================
// #region - 201 to 300
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Fat
//------------------------------------------------------------------------
const FAT = {
	ID: 219,
	type: TYPE.ACCUMULATOR,
	name: "FAT",
	description: "",
	stack: 99,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(FAT);
/** @type {Enumerator<Number>}  */
INDEX.FAT = FAT.ID
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
 * @name FSM
 * @desc 
 * 
 */
//========================================================================
// #region - 301 to 400
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > seek
//------------------------------------------------------------------------

const SEEKING_TARGET = {
	ID: 302,
	type: TYPE.FSM,
	name: "SEEKING_TARGET",
	description: "FSM state that, while tolerance area is not reached, "
		+ "looks for a EXP with a KEY_TARGET to inject its targetPOVART.P1, until ",
	stack: 1,
	onApply: () => {},
	onUpdate: (exp, entity, process) => {
		const ePrefix = "[SEEKING_TARGET].onUpdate: ";
		try
		{
			if(exp?.keys || exp?.targetPOVART) 
				throw new Error(`${exp} is invalid MAGPIE_EXP`);
			if(!exp.keys.find(key => key.originID === MAGPIE.KEY.INDEX.TARGET))
				return
			if(!entity?.ID || isNaN(entity.ID))
				throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
			const POVART0 = exp.subjectID.slice(0,30);
			const P1 = exp.targetID.slice(0,3);
			const STATS = exp.subjectID;
			const toler = exp.keys.find(key => key.originID === MAGPIE.KEY.INDEX.PROXIMITY) ? 1 : 0;
			const options = {intensity: exp.value, tolerance: toler}
			const output = entity._emote_seekTarget(exp);
			const purge = true;
			if(output.arrived) entity.removeState(302, 1, purge);
			if(output.proximity) entity.switchState(302, 303);
			if(output.braking) entity.switchState(302,304);
			const stats = [];
			stats.forEach((stat, index) => {
				if(stat !== 0)
					entity._PARAMS[index] += stat
			})
			const pushStates = [];
			pushStates.forEach(ID => {
				entity.addState(ID);
			})
			const popStates = [];
			popStates.forEach(ID => {
				entity.removeState(ID)
			});
			return output
		}
		catch(e)
		{
			return new Error(ePrefix + e.message);
		}
	},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(SEEKING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.SEEKING_TARGET = SEEKING_TARGET.ID;
//------------------------------------------------------------------------
const APPROACHING_TARGET = {
	ID: 303,
	type: TYPE.FSM,
	name: "APPROACHING_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: (exp, entity) => {
		if(!exp.keys.find(key => key.originID === MAGPIE.KEY.INDEX.TARGET))
			return console.log(`state302: skip`)
		const purge = true;
		const output = entity._seekTarget(exp);
		if(output.arrived) entity.removeState(303, 1, purge);
		if(!output.proximity) entity.switchState(303, 304);
		entity.exps.push(output.exp);
		console.log("state302: true | recycling exp")
		return output
	},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(APPROACHING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.APPROACHING_TARGET = APPROACHING_TARGET.ID;
//------------------------------------------------------------------------
const ON_TARGET = {
	ID: 304,
	type: TYPE.FSM,
	name: "ON_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: (exp, entity) => {
		//
	},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(ON_TARGET)
/** @type {Enumerator<Number>}  */
INDEX.ON_TARGET = ON_TARGET.ID;
//------------------------------------------------------------------------
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
module.exports = { states, INDEX, TYPE } ;