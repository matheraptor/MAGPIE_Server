const { MAGPIE } = require("../core/index");
/**
 * @typedef {import("../core/entity").MAGPIE_ENTITY} MAGPIE_ENTITY
 * @typedef {import("../core/component").MAGPIE_EXP} MAGPIE_EXP
 * @typedef {import("../core/index").state_index} state_index
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
TYPE.G_LVL = 1;
/** @type {state_type} @desc accumulator state type */
TYPE.ACCUMULATOR = 2;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM = 10;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_STATUS = 11;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_POSTURE = 12;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_MOVEMENT = 13;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_MOOD = 14;
/** @type {state_type} @desc Finite-State-Machine type */
TYPE.FSM_ENERGY = 15;
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
	type: TYPE.FSM_POSTURE,
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
	 * @param {state_index} state_index
	 * @returns {state_output}
	 */
	onUpdate: (exp, entity, process, state_index) => {
		const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
		if(!target || !process) return {exp: exp}
		const output = entity._emote_seekTarget(exp);
		const reaching = 303;
		const approaching = 304;
		const onTarget = 305;
		if(output.arrived) entity.switchState(state_index, onTarget);
		if(output.proximity) entity.switchState(state_index, approaching);
		if(output.braking) entity.switchState(state_index, reaching);
		return output
	},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(SEEKING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.SEEKING_TARGET = SEEKING_TARGET.ID;
//------------------------------------------------------------------------
const REACHING_TARGET = {
	ID: 303,
	type: TYPE.FSM_POSTURE,
	name: "REACHING_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: (exp, entity, process, state_index) => {
		const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
		if(!target) return {exp: exp}
		const output = entity._emote_seekTarget(exp);
		const onTarget = 305;
		if(output.arrived) entity.switchState(state_index, onTarget);
		const approaching = 304
		if(!output.proximity) entity.switchState(state_index, approaching)
		return output
	},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(REACHING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.REACHING_TARGET = REACHING_TARGET.ID;
//------------------------------------------------------------------------
const APPROACHING_TARGET = {
	ID: 304,
	type: TYPE.FSM_POSTURE,
	name: "APPROACHING_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: (exp, entity, process, state_index) => {
		const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
		if(!target) return {exp: exp}
		const output = entity._emote_seekTarget(exp);
		const reaching = REACHING_TARGET.ID;
		if(output.proximity) entity.switchState(state_index, reaching)
		const coasting = SEEKING_TARGET.ID;
		if(!output.braking) entity.switchState(state_index, coasting);
		return output
	}
}
states.push(APPROACHING_TARGET);
/** @type {Enumerator<Number>}  */
INDEX.APPROACHING_TARGET = APPROACHING_TARGET.ID;
//------------------------------------------------------------------------
const ON_TARGET = {
	ID: 305,
	type: TYPE.FSM_POSTURE,
	name: "ON_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	/**
	 * 
	 * @param {MAGPIE_EXP} exp 
	 * @param {MAGPIE_ENTITY} entity 
	 * @param {state_index} state_index 
	 * @return {state_output}
	 */
	onUpdate: (exp, entity, process, state_index) => {
		const target = exp.keys.includes(MAGPIE.KEY.INDEX.TARGET);
		if(!target) return {exp: exp}
		const output = entity._emote_seekTarget(exp);
		const reaching = REACHING_TARGET.ID;
		if(!output.arrived) entity.switchState(state_index, reaching);
		//@todo onTarget effects
		return output
	},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(ON_TARGET)
/** @type {Enumerator<Number>}  */
INDEX.ON_TARGET = ON_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const IDLING = {
	ID: 306,
	type: TYPE.FSM_POSTURE,
	name: "IDLING",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(IDLING);
/** @type {Enumerator<Number>} */
INDEX.IDLING = IDLING.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const ALIGNING_TARGET = {
	ID: 311,
	type: TYPE.FSM_POSTURE,
	name: "ALIGNING_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(ALIGNING_TARGET);
/** @type {Enumerator<Number>} */
INDEX.ALIGNING_TARGET = ALIGNING_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const LOCKING_TARGET = {
	ID: 312,
	type: TYPE.FSM_POSTURE,
	name: "LOCKING_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(LOCKING_TARGET);
/** @type {Enumerator<Number>} */
INDEX.LOCKING_TARGET = LOCKING_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const FACING_TARGET = {
	ID: 313,
	type: TYPE.FSM_POSTURE,
	name: "FACING_TARGET",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(FACING_TARGET);
/** @type {Enumerator<Number>} */
INDEX.FACING_TARGET = FACING_TARGET.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const DRIFTING = {
	ID: 314,
	type: TYPE.FSM_POSTURE,
	name: "DRIFTING",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(DRIFTING);
/** @type {Enumerator<Number>} */
INDEX.DRIFTING = DRIFTING.ID;
//------------------------------------------------------------------------
/** @type {state_data} */
const SPOOFED = {
	ID: 315,
	type: TYPE.FSM_POSTURE,
	name: "SPOOFED",
	description: "",
	stack: 1,
	onApply: () => {},
	onUpdate: () => {},
	onRemove: () => {},
	onExpire: () => {}
}
states.push(SPOOFED);
/** @type {Enumerator<Number>} */
INDEX.SPOOFED = SPOOFED.ID
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