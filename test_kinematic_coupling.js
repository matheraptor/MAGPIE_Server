const P = require('./core/physics.js').MAGPIE_PHYSICS;

function testCoupling() {
    console.log("╔═══════════════════════════════════════════════════════════╗");
    console.log("║ TEST: Kinematic Coupling of Simultaneous Local Rotations  ║");
    console.log("╚═══════════════════════════════════════════════════════════╝\n");

    // Initial state: Level flight, facing North
    const P0 = [0, 0, 1];
    const O0 = P._rotor_fromEulerAbs(0, 0, 0, P0);

    // Let's say we have independent PID controllers.
    // We want to Pitch UP by 45 degrees, and turn RIGHT (Heading) by 45 degrees.
    // We want ZERO roll.
    // If they were truly independent, we would end up at [Roll: 0, Pitch: 45, Heading: 45].
    
    // The PID outputs a local torque/angular velocity bivector.
    // Let's say it gives equal rates to Pitch and Heading, and 0 to Roll.
    // In our axes: pitch=yz(-X), roll=xz(Y), heading=xy(Z)
    // dR_pitch = 45 deg, dR_roll = 0, dR_heading = 45 deg
    const pitch_rad = -45 * Math.PI / 180; // Pitch up is negative X
    const heading_rad = 45 * Math.PI / 180; // Turn right is positive Z

    // Bivector [yz, xz, xy] -> [pitch, roll, heading]
    const R_local = [pitch_rad, 0, heading_rad];

    // Convert local angular velocity to a delta rotor
    // (Simulating dO = rotorFromBivector(R1, dt) where dt=1)
    const dO = P.rotorFromBivector(R_local, 1.0);

    // Apply the local rotation to O0 (O1 = O0 * dO)
    // In MAGPIE, entity.js uses rotorCompose(O0, dO)
    const O1 = P.rotorCompose(O0, dO);

    const initialEuler = P._rotor_toEulerAbs(O0, P0);
    const finalEuler = P._rotor_toEulerAbs(O1, P0);

    console.log("Expected Result (If axes were perfectly decoupled):");
    console.log("  Roll: 0.00°, Pitch: 45.00°, Heading: 45.00°\n");

    console.log("Actual Result of Simultaneous Rotation (Compound Bivector):");
    console.log(`  Roll:    ${finalEuler[0].toFixed(2)}°`);
    console.log(`  Pitch:   ${finalEuler[1].toFixed(2)}°`);
    console.log(`  Heading: ${finalEuler[2].toFixed(2)}°\n`);

    if (Math.abs(finalEuler[0]) > 0.1) {
        console.log("💥 BUG REPRODUCED: Roll changed even though Roll torque was ZERO!");
        console.log("This is 'Kinematic Coupling'. A simultaneous rotation around Pitch and Heading");
        console.log("axes creates a diagonal rotation axis that inherently induces Roll.");
    }
}

testCoupling();