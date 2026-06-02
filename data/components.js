/**
 * @namespace components
 * @author Matheraptor
 * @version 0.31.0
 * 
 * @typedef {Number} keyID
 */
const components = {};
const { MAGPIE } = require("../core/index")
const { MAGPIE_PHYSICS } = require("../core/physics")
const { MAGPIE_ENGINE } = require("../core/component")
/** 
 * 
 * @type {Map<String, keyID>} 
 * */
components.INDEX = new Map()
/**
 * @name 
 * @desc 
 * @typedef {{
 * ID: Number,
 * keyID: keyID,
 * onUse: () => {},
 * onUpdate: () => {}
 * }} component
 */
//========================================================================
// #region - ENGINEERING
//========================================================================
/** @type {component} */
const PISTON_ENGINE = {
    ID: MAGPIE.KEY.COMPONENT.PISTON_ENGINE,
    keyID: MAGPIE.KEY.COMPONENT.PISTON_ENGINE,
    onUse: () => {},
    onUpdate: () => {}
}
components.INDEX.set("PISTON_ENGINE", PISTON_ENGINE)
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = components