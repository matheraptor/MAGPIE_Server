const { MAGPIE } = require("../core/index");
/**
 * @typedef {import("../core/entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("../core/component").MAGPIE_EXP} MAGPIE_EXP
 * @typedef {import("../core/index").stamina_index} stamina_index
 * @typedef {import("../core/physics").vector3} vector3
 * @typedef {import("../core/physics").bivector} bivector
 * @typedef {{
 * At: vector3,
 * Tt: bivector,
 * exp: MAGPIE_EXP
 * }} state_output
 */
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
	description: `exp.keys.find(keyID => {
			isTypeTARGET(keyID) ? seekTarget(exp) : return
		})`,
	stack: 1,
	onApply: () => {},
	/**
	 * 
	 * @param {MAGPIE_EXP} exp 
	 * @param {MAGPIE_ENTITY} entity 
	 * @param {Boolean} process 
	 * @param {stamina_index} stamina_index
	 * @returns {state_output}
	 */
	onUpdate: (exp, entity, process, stamina_index) => {
		const target = exp._key_isTypeTARGET();
		if(!target) return output = {exp: exp}

		const output = entity._emote_seekTarget(exp);
		const purge = true;
		if(output.arrived) entity.removeState(stamina_index, 1, purge);
		if(output.proximity) entity.switchState(stamina_index, 303);
		if(output.braking) entity.switchState(stamina_index,304);
		return output
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
	onUpdate: (exp, entity, stamina_index) => {
		const purge = true;
		const output = entity._seekTarget(exp);
		if(output.arrived) entity.removeState(303, 1, purge);
		if(!output.proximity) entity.switchState(303, 304);
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
	/**
	 * 
	 * @param {MAGPIE_EXP} exp 
	 * @param {MAGPIE_ENTITY} entity 
	 * @param {stamina_index} stamina_index 
	 * @return {state_output}
	 */
	onUpdate: (exp, entity, stamina_index) => {
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