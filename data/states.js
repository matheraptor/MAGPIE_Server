const { MAGPIE } = require("../core/index");
/** 
 * @type {Enumerator<Number>} 
 * @typedef {{
 * ID: Number,
 * type: state_type, 
 * name: String,
 * description: String,
 * stack: Number,
 * onUpdate: Function,
 * onApply: Function,
 * onRemove: Function,
 * onExpire: Function
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
const states = [
	null,
	{
		ID: 1,
		type: 0,
		name: "TEMPLATE",
		description: "",
		stack: 0,
		onApply: () => {},
		onUpdate: () => {},
		onRemove: () => {},
		onExpire: () => {}
	},
	{
		ID: 302,
		type: TYPE.FSM,
		name: "SEEKING_TARGET",
		description: "FSM state that, while tolerance area is not reached, "
			+ "looks for a EXP with a KEY_TARGET to inject its targetPOVART.P1, until ",
		stack: 1,
		onApply: () => {},
		onUpdate: (exp, entity) => {
			const ePrefix = "[SEEKING_TARGET].onUpdate: ";
			try
			{
				if(exp?.keys || exp?.targetPOVART) 
					throw new Error(`${exp} is invalid MAGPIE_EXP`);
				if(!exp.keys.find(key => key === MAGPIE.KEY.INDEX.TARGET))
					return
				if(!entity?.ID || isNaN(entity.ID))
					throw new Error(`${entity} is invalid MAGPIE_ENTITY`);
				const output = entity._seekTarget(exp);
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
	},
	{
		ID: 303,
		type: TYPE.FSM,
		name: "APPROACHING_TARGET",
		description: "",
		stack: 1,
		onApply: () => {},
		onUpdate: (exp, entity) => {
			if(!exp.keys.find(key => key === MAGPIE.KEY.INDEX.TARGET))
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
];
states.filter(state => state).forEach(s => {
	if(!isNaN(s?.ID))
		INDEX[s.name] = s.ID;
})
module.exports = { states, INDEX, TYPE } ;