const { MAGPIE_PHYSICS } = require("./core/physics");
const { MAGPIE } = require("./core/index");
const { MAGPIE_SYSTEM } = require("./core/system");

// Mock logging to avoid spam
MAGPIE_SYSTEM._logging_debug = () => {};
MAGPIE_SYSTEM.error = (msg, e) => { console.error("MAGPIE ERROR:", msg, e); };

// Setup initial state matching the Cargo Ship
let P0 = [1760565.22, 6046369.06, 965180.90];
let P1 = [1770000.0, 6040000.0, 965000.0];

let up = MAGPIE_PHYSICS.normalizeVector(P0);
let North = MAGPIE.KEY.POVART.UP;
let localNorth = MAGPIE_PHYSICS.normalizeVector(MAGPIE_PHYSICS.subVectors(North, MAGPIE_PHYSICS.scaleVector(up, MAGPIE_PHYSICS.dotProduct(North, up))));
let O0 = MAGPIE_PHYSICS.rotorFromFrame(localNorth, up);

let V0 = [0, 0, 0];
let R0 = [0, 0, 0];
let T0 = [0, 0, 0];
let A0 = [0, 0, 0];

// Mock decomp_POVART
MAGPIE_PHYSICS.decomp_POVART = () => ({ P0, O0, V0, A0, R0, T0 });

let STATS = new Float64Array(30);
STATS[MAGPIE.KEY.STATS.AMAX] = 5.0;
STATS[MAGPIE.KEY.STATS.VMAX] = 8.653;
STATS[MAGPIE.KEY.STATS.BMAX] = 2.0;
STATS[MAGPIE.KEY.STATS.DEX]  = 1.0;
STATS[MAGPIE.KEY.STATS.MASS] = 10000;
STATS[MAGPIE.KEY.STATS.LENGTH] = 100;

let options = {
    surfaceBound: true,
    surface: true, // covering both namings
    Rmax: 1.0,
    intensity: 1.0,
    tolerance: 1.0
};

console.log("Starting Simulation...");
let dt = 1.0 / 60.0;

for(let i=0; i<600; i++) {
    let result = MAGPIE_PHYSICS._emote_seekTarget(new Float64Array(22), P1, STATS, options);

    let At = result.At || [0,0,0];
    let Tt = result.Tt || [0,0,0];

    // Euler Integration
    V0 = MAGPIE_PHYSICS.addVectors(V0, MAGPIE_PHYSICS.scaleVector(At, dt));
    R0 = MAGPIE_PHYSICS.addVectors(R0, MAGPIE_PHYSICS.scaleVector(Tt, dt));
    R0 = MAGPIE_PHYSICS.vector_clamp_mag(R0, options.Rmax);

    P0 = MAGPIE_PHYSICS.addVectors(P0, MAGPIE_PHYSICS.scaleVector(V0, dt));

    let dO = MAGPIE_PHYSICS.rotorFromBivector(R0, dt);
    O0 = MAGPIE_PHYSICS.rotorNormalize(MAGPIE_PHYSICS.rotorCompose(dO, O0));

    if (i % 60 === 0 || i < 5) {
        let hdg = MAGPIE_PHYSICS._rotor_toHeadingAbs(O0, P0);
        let roll = MAGPIE_PHYSICS._rotor_toRollAbs(O0, P0);
        let pitch = MAGPIE_PHYSICS._rotor_toPitchAbs(O0, P0);
        let dist = MAGPIE_PHYSICS.distanceTo(P0, P1);
        console.log(`t=${(i/60).toFixed(2)}s | Hdg: ${hdg.toFixed(2)} | Pitch: ${pitch.toFixed(2)} | Roll: ${roll.toFixed(2)} | Tt: [${Tt.map(n=>n.toFixed(3)).join(', ')}] | R0: [${R0.map(n=>n.toFixed(3)).join(', ')}]`);
    }
}
