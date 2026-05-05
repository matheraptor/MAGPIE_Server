const { MAGPIE } = require("../core/index")
const { INDEX } = require("./states")
/** @type {import("../SERVER.js").exp_output} */
const defaults = { exp: null, At: [0,0,0], Tt: [0,0,0], keys: [], persist: null };
/** 
 * 
 * @typedef {{
 * ID: Number,
 * name: String,
 * type: Enumerator<Number>,
 * description,
 * condition: (...args) => Boolean,
 * onAction: Function,
 * onPassive: Function
 * }} emote_data
 * @type {emote_data[]} 
 * 
 * */
const data = [];
data.push(
	{
		ID: 302,
		name: "SEEK_TARGET",
		type: MAGPIE.KEY.EMOTE.TYPE.FSM,
		description: "pushes a target exp in queue and applies a 'seeking' "
			+ "perma state that queries the target exp for a target POVART to move to. "
			+ "This ensures that the entity can still process other exps, and that the "
			+ "target to seek can be updated with fresh info",
		condition: function(...args)
		{
			return true
		},
		/**
		 * 
		 * @param {import("../SERVER.js").exp_payload} exp 
		 * @param {import("./entity_types.js").entity_data} params 
		 * @returns {import("../SERVER.js").exp_output} results
		 */
		onAction: function seekTarget(exp, params) 
		{
			const ePrefix = `[EMOTE-302].seekTarget: `;
			try
			{
				const results = {};
				results.states = {
					add: [INDEX.SEEKING_TARGET]
				}
				results.exp = exp;
				results.exp.emoteID = 302;
				results.exp.keys.push(MAGPIE.KEY.INDEX.TARGET)
				results.persist = {};
				results.persist.condition = () => {return true};
				return results
			}
			catch(e)
			{
				return new Error(ePrefix + e.message);
			}
		},
		onPassive: function()
		{
			//
		}
	}
)
module.exports = data; 