const P = require('./core/physics.js').MAGPIE_PHYSICS;

function test() {
    // Start facing East (Heading = 90)
    const O0 = P._rotor_fromEulerAbs(90, 0, 0, [0,0,1]);
    
    // Command a pure Pitch up. 
    // Pitch is rotation in yz plane (X-axis).
    const R1 = [0.1745, 0, 0]; // 10 degrees Pitch
    
    // Convert to rotor
    const dO = P.rotorFromBivector(R1, 1.0);
    
    // How physics.js does it (Global apply: dO * O0)
    const O1_global = P.rotorCompose(dO, O0);
    const euler_global = P._rotor_toEulerAbs(O1_global, [0,0,1]);
    
    // How entity.js does it (Local apply: O0 * dO)
    const O1_local = P.rotorCompose(O0, dO);
    const euler_local = P._rotor_toEulerAbs(O1_local, [0,0,1]);
    
    console.log("Starting Orientation (Facing East):");
    console.log(`  Roll: 0°, Pitch: 0°, Heading: 90°\n`);
    
    console.log("Applying Pure Pitch Torque [10°, 0, 0]...\n");
    
    console.log("Result using current physics.js (rotorCompose(dO, O0)):");
    console.log(`  Roll:    ${euler_global[0].toFixed(2)}°`);
    console.log(`  Pitch:   ${euler_global[1].toFixed(2)}°`);
    console.log(`  Heading: ${euler_global[2].toFixed(2)}°\n`);
    
    console.log("Result using local apply (rotorCompose(O0, dO)):");
    console.log(`  Roll:    ${euler_local[0].toFixed(2)}°`);
    console.log(`  Pitch:   ${euler_local[1].toFixed(2)}°`);
    console.log(`  Heading: ${euler_local[2].toFixed(2)}°\n`);
}

test();