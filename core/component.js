/**
 * @name INDEX
 * @desc 
 * 
 */
//========================================================================
// #region - INDEX
//========================================================================
const { MAGPIE } = require("./index");
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
 * 
 */
//------------------------------------------------------------------------
// #region > state
//------------------------------------------------------------------------
MAGPIE_STATE.prototype.initialize = function initialize(data)
{
    //
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
    this.subject = data?.subject || NaN;
    this.target = data?.target || NaN;
    this.emoteID = data?.emoteID || NaN;
    this.keys = data?.keys || [];
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
 * onAction: Function,
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