/** 
 * @namespace scratchpad
 * @author Matheraptor
 * @version 0.23.2
 * 
 * 
 * 
 * @description stuff below here is wiped after save
 */
const {  
    MAGPIE,
 } = require("../core/index");
 const {
    MAGPIE_PHYSICS
 } = require("../core/physics");
 const {
    MAGPIE_SYSTEM,
    MAGPIE_HIVE,
    MAGPIE_CALENDAR,
    MAGPIE_DATE,
    MAGPIE_IO,
    MAGPIE_LOG,
    MAGPIE_RUNTIME,
    MAGPIE_METASTATE
 } = require("../core/system")
 const {
    MAGPIE_COMPONENT,
    MAGPIE_SYMBOL,
    MAGPIE_EXP,
    MAGPIE_KEY,
    MAGPIE_EMOTE,
    MAGPIE_CONTEXT,
    MAGPIE_STATE,
    MAGPIE_TICKET
 } = require("../core/component")
 const {
    MAGPIE_ENTITY
 } = require("../core/entity")
//========================================================================
// #region - Scratchpad

// #endregion
//========================================================================
[
  [ 101, 'universe' ],
  [ 1773811061892, 'Terra' ],
  [ 1773811141134, "HTP A9805 'Diego Marea'" ],
  [ 1779288098611, "DIEGO context" ],
  [ 1779734993195, 'WP-249-06' ],
  [ 1778365115809, "WP-249-07" ],
  [ 1779734993194, 'WP-249-08' ],
  [ 1778493972858, 'WP-249-09' ],
  [ 1779732886641, 'WP-249-10' ],
  [ 1779732886642, 'undefined' ],
  [ 1779732928566, 'undefined' ],
  [ 1779732928567, 'undefined' ],
  [ 1779733071469, 'undefined' ],
  [ 1779733071470, 'undefined' ],
  [ 1779733399798, 'undefined' ],
  [ 1779733399799, 'undefined' ],
  [ 1779735513215, 'undefined' ],
  [ 1779735513216, 'undefined' ],
  [ 1779747270776, 'undefined' ],
  [ 1779749838615, 'undefined' ],
  [ 1779026345447, 'Milky Way' ],
  [ 1779026102091, 'Sol' ]
]
r.context.diego = r.context.HIVE._get_entity(1773811141134)
 diego._set_O1(PHYSICS._rotor_fromEulerAbs(180,0,0, diego._get_P0()))
r.context.diego._get_target()._set_C1([12.420031, 43.544629,0])
r.context.diego.exps.push(r.context.METASTATE.contents.exp)
r.context.exp = r.context.DATABASE
    .loadExpSync(r.context.METASTATE.contents.exp)
r.context.diego = r.context.DATABASE.loadEntitySync(1773811141134)
r.context.Terra = r.context.DATABASE
    .loadEntitySync(r.context.diego.STATS[MAGPIE.KEY.POVART.P_C])
r.context.diego.exps.pop()
r.context.diego.refresh(0,0.1)
r.context.diego = r.context.SERVER.HIVE._reg_entityByIndex(1);
r.context.Earth = r.context.SERVER.HIVE._reg_entityByIndex(0);
r.context.C = MAGPIE_SERVER.HIVE._reg_entityByIndex();
r.context.Er = r.context.C.radius();
r.context.exp = r.context.diego._vault.get("target");
r.context.exp.emoteID = 302;
r.context.P1 = MAGPIE_PHYSICS.getPosition(r.context.exp.targetPOVART);
r.context.params = r.context.diego._get_params();
r.context.options = {tolerance: 88.5, intensity: 1, fwd: [0,1,0], agility: 1, pR: 1};
r.context.diego.exps.push(r.context.exp)

r.context.diego._POVART_setAcceleration([0,0,0]);
r.context.diego._POVART_setVelocity([0,0,0]);
r.context.P0 = MAGPIE_PHYSICS.geodeticToCartesian(-12.268933531214913, 49.28800229173159, r.context.Er);
r.context.P1 = MAGPIE_PHYSICS.geodeticToCartesian(-12.261363012070085, 49.28468646190016, r.context.Er);
r.context.diego._play_moveLinearTo(r.context.P1, 1)
const Kp = MAGPIE.KEY.PARAMS;
const PAR = r.context.diego.PARAMS;
PAR[Kp.AMAX] = 0.036;
PAR[Kp.BMAX] = 0.036;
PAR[Kp.VMAX] = MAGPIE_PHYSICS._U_knotsToMPS(21);
PAR[Kp.GMAX] = 9.81 * 0.7;
PAR[Kp.MASSKG] = 9348 * 1000;
PAR[Kp.LENGTH] = 177;
PAR[Kp.HEIGHT] = 46;
PAR[Kp.WIDTH] = 24;
PAR[Kp.TMAX_X] = 0.01;
PAR[Kp.TMAX_Y] = 0.01;
PAR[Kp.TMAX_Z] = 0;
r.context.diego.PARAMS = PAR;

/**
 const { P0, V0 } = r.context.diego.decomp_POVART();
 * @desc everything below here stays forever
 * 
 */
//========================================================================
// 1772901482769