/**
 * @name INDEX
 * @desc 
 * @param {{
 * name: String,
 * type: Enumerator<Number>,
 * birth: Number,
 * parents: Number[],
 * children: Number[],
 * orbit: orbit_data,
 * POVART: Number[],
 * STATS: entity_stats,
 * traits: Number[],
 * states: [ID,Count],
 * exps: MAGPIE_EXP[],
 * sensors: Number[],
 * emitters: Number[],
 * host: Number,
 * inventory: Number[],
 * equip: Number[],
 * deck: Number[],
 * vault: Number[]
 * }} data
 * @returns {new MAGPIE_ENTITY}
 * 
 */
//========================================================================
// #region - INDEX
//========================================================================
function MAGPIE_ENTITY(data = {})
{
    this.initialize(data)
}
const { MAGPIE } = require("./index");
const { 
    MAGPIE_STATE, 
    MAGPIE_EMOTE, 
    MAGPIE_EXP 
} = require("./component")

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
 * @typedef {Number} entityID Date.now()
 * @typedef {{
 * name: String,
 * type: Enumerator<Number>,
 * birth: Number,
 * parents: Number[],
 * children: Number[],
 * orbit: orbit_data,
 * POVART: Number[],
 * STATS: entity_stats,
 * traits: Number[],
 * states: [ID,Count],
 * exps: MAGPIE_EXP[],
 * sensors: Number[],
 * emitters: Number[],
 * host: Number,
 * inventory: Number[],
 * equip: Number[],
 * deck: Number[],
 * vault: Number[]
 * }} entity_data
 * @typedef {Float64Array<Number>} entity_stats
 * @typedef {Float64Array<Number>} entity_params
 * @typedef {Enumerator<Number>} entity_type {@link MAGPIE.KEY.ENTITY.TYPE}
 * 
 * @param {entity_data} data
 * @returns {new MAGPIE_ENTITY}
 * 
 */
//========================================================================
// #region - ENTITY
//========================================================================
MAGPIE_ENTITY.prototype.initialize = function initialize(data)
{
    const stamp = Date.now();
    /** @type {entityID} */
    this.ID = stamp;
    this["@"] = String(this.constructor.name);
    this.name = String(data?.name);
    /** @type {entity_type} */
    this.type = Number(data?.type || 0);
    this.updated = stamp;
    this.saved = stamp;
    this.metadate = NaN;
    this.birth = NaN;
    this.parents = [NaN];
    this.children = [NaN];
    this.orbit = new Float64Array(MAGPIE.KEY.ORBIT.ARRAY).fill(0);
    this.POVART = new Float64Array(MAGPIE.KEY.PHYSICS.POVART.ARRAY).fill(0);
    this.STATS = new Float64Array(MAGPIE.KEY.STATS.ARRAY).fill(0);
    this.traits = new Float64Array(MAGPIE.KEY.TRAIT.ARRAY).fill(0);
    this.states = [NaN];
    this.exps = [NaN];
    this.sensors = new Float64Array(MAGPIE.KEY.SENSOR.ARRAY).fill(0);
    this.emitters = new Float64Array(MAGPIE.KEY.EMITTER.ARRAY).fill(0);
    this.host = NaN;
    this.inventory = [NaN];
    this.equip = [NaN];
    this._PARAMS = new Float64Array(MAGPIE.KEY.STATS.ARRAY).fill(0);
    this._reserve = [];
    this._stamina = [];
    this._waste = [];
    this._permanent = [];
    this._injury = [];
    this._vault = new Map();
    setTimeout(() => {this.setup(data)}, 1000);
}
MAGPIE_ENTITY.prototype.isValid = function isValid()
{
    return true
}
/**
 * 
 * @param {entity_data} data 
 */
MAGPIE_ENTITY.prototype.setup = function setup(data)
{
    this.birth = Number(data?.birth) || 0;
    this.setupPOVART(data?.POVART)
    this.setupSTATS(data?.STATS);
    this.setupParents(data?.parents);
    this.setupChildren(data?.children);
    this.setupHost(data?.host || this.POVART[MAGPIE.KEY.PHYSICS.POVART.P_C]);
    this.setupInventory(data?.inventory);
    this.setupEquip(data?.equip);
    this.setupDeck(data?.deck);
}
MAGPIE_ENTITY.prototype.setupPOVART = function setupPOVART(POVART)
{
    //
}
MAGPIE_ENTITY.prototype.setupSTATS = function setupSTATS(STATS)
{
    //
}
MAGPIE_ENTITY.prototype.setupParents = function setupParents(parents)
{
    //
}
MAGPIE_ENTITY.prototype.setupChildren = function setupChildren(children)
{
    //
}
MAGPIE_ENTITY.prototype.setupHost = function setupHost(host)
{
    //
}
MAGPIE_ENTITY.prototype.setupInventory = function setupInventory(inventory)
{
    //
}
MAGPIE_ENTITY.prototype.setupEquip = function setupEquip(equip)
{
    //
}
MAGPIE_ENTITY.prototype.setupDeck = function setupDeck(deck)
{
    //
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = { MAGPIE_ENTITY }
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE
//========================================================================