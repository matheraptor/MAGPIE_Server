/** 
 * @namespace scratchpad
 * @author Matheraptor
 * @version 0.18.9 20260331
 * 
 * 
 * 
 * @description stuff below here is wiped after save
 */
const {  
    MAGPIE,
 } = require("../core/index");
//========================================================================
// #region - Scratchpad

// #endregion
//========================================================================
r.context.diego = r.context.HIVE._get_entity(1773811141134)
diego._set_O1(PHYSICS.rotorFromEuler(diego._get_P0(),0,0,10))
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