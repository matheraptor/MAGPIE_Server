const P = require('./core/physics.js').MAGPIE_PHYSICS;
const P0 = [0,0,1];
const O0 = P._rotor_fromEulerAbs(0,0,0,P0);

// If pitch increases by 10 degrees:
const O1_pitch = P._rotor_fromEulerAbs(0,10,0,P0);
const dO_pitch = P._getDeltaO(O0, O1_pitch);
console.log("Pitch UP 10° -> dR:", P._getDeltaR(dO_pitch).map(x=>x.toFixed(4)));

// If roll increases by 10 degrees:
const O1_roll = P._rotor_fromEulerAbs(0,0,10,P0);
const dO_roll = P._getDeltaO(O0, O1_roll);
console.log("Roll RIGHT 10° -> dR:", P._getDeltaR(dO_roll).map(x=>x.toFixed(4)));

// If heading increases by 10 degrees:
const O1_hdg = P._rotor_fromEulerAbs(10,0,0,P0);
const dO_hdg = P._getDeltaO(O0, O1_hdg);
console.log("Heading RIGHT 10° -> dR:", P._getDeltaR(dO_hdg).map(x=>x.toFixed(4)));