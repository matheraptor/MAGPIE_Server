#!/usr/bin/env node

const PHYSICS = require('./core/physics.js');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  LIVE TURN TEST: Diego at 56° heading turning left/right  ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Create a minimal mock entity to test with PHYSICS methods
const mockEntity = {
  id: 1773811141134,
  O0: [0, 0, 0, 1],  // Will be set to heading 56°, pitch 0, roll 0
  V0: [0, 0, 0],
  P0: [0, 0, 0],
  
  // Mock the orientation setter
  _set_O1(rotor) {
    this.O1 = rotor;
  },
  _get_O1() {
    return this.O1 || this.O0;
  }
};

// Helper: Convert Euler angles (degrees) to rotor
function eulerToRotor(roll_deg, pitch_deg, heading_deg) {
  const roll = roll_deg * Math.PI / 180;
  const pitch = pitch_deg * Math.PI / 180;
  const heading = heading_deg * Math.PI / 180;
  
  const cy = Math.cos(heading / 2);
  const sy = Math.sin(heading / 2);
  const cp = Math.cos(pitch / 2);
  const sp = Math.sin(pitch / 2);
  const cr = Math.cos(roll / 2);
  const sr = Math.sin(roll / 2);
  
  return [
    sp * cr * cy + cp * sr * sy,  // yz
    sr * cp * cy - cr * sp * sy,  // xz
    cr * cp * sy - sr * sp * cy,  // xy
    cr * cp * cy + sr * sp * sy   // w
  ];
}

// Helper: Convert rotor to Euler angles (degrees)
function rotorToEuler(rotor) {
  const [yz, xz, xy, w] = rotor;
  
  const roll = Math.atan2(2*(w*xz + yz*xy), 1 - 2*(xz**2 + yz**2));
  const pitch = Math.asin(Math.max(-1, Math.min(1, 2*(w*yz - xy*xz))));
  const heading = Math.atan2(2*(w*xy + yz*xz), 1 - 2*(xy**2 + yz**2));
  
  return [roll * 180/Math.PI, pitch * 180/Math.PI, heading * 180/Math.PI];
}

// Set Diego's initial orientation: 56° heading, 0 pitch, 0 roll
mockEntity.O0 = eulerToRotor(0, 0, 56);
const [r0, p0, h0] = rotorToEuler(mockEntity.O0);
console.log('INITIAL STATE:');
console.log(`  O0 rotor: [${mockEntity.O0.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  O0 Euler: Roll=${r0.toFixed(2)}°, Pitch=${p0.toFixed(2)}°, Heading=${h0.toFixed(2)}°\n`);

// Test scenarios: Turn left (counterclockwise) and right (clockwise)
const testCases = [
  { name: 'TURN RIGHT (heading 56° → 45°)', targetHeading: 45 },
  { name: 'TURN LEFT (heading 56° → 67°)', targetHeading: 67 },
  { name: 'TURN RIGHT MORE (heading 56° → 30°)', targetHeading: 30 },
  { name: 'TURN LEFT MORE (heading 56° → 80°)', targetHeading: 80 }
];

console.log('═══════════════════════════════════════════════════════════\n');

testCases.forEach((testCase, idx) => {
  console.log(`TEST ${idx + 1}: ${testCase.name}`);
  console.log('─────────────────────────────────────────────────────────');
  
  // Set target: same pitch/roll as current, but different heading
  const Ot = eulerToRotor(0, 0, testCase.targetHeading);
  const [rTarget, pTarget, hTarget] = rotorToEuler(Ot);
  
  console.log(`  Target: Roll=${rTarget.toFixed(2)}°, Pitch=${pTarget.toFixed(2)}°, Heading=${hTarget.toFixed(2)}°`);
  
  // Simulate the PHYSICS calculation of dR
  // This mimics what _emote_seekTarget does:
  // 1. Invert O0
  const O0_inv = [
    -mockEntity.O0[0],
    -mockEntity.O0[1],
    -mockEntity.O0[2],
    mockEntity.O0[3]
  ];
  
  // 2. Compute dO = Ot * O0^-1 (quaternion multiplication)
  // q1 * q2 = [a1*a2 - b1*b2 - c1*c2 - d1*d2,
  //            a1*b2 + b1*a2 + c1*d2 - d1*c2,
  //            a1*c2 - b1*d2 + c1*a2 + d1*b2,
  //            a1*d2 + b1*c2 - c1*b2 + d1*a2]
  const dO = [
    Ot[0]*O0_inv[3] + Ot[1]*O0_inv[2] - Ot[2]*O0_inv[1] + Ot[3]*O0_inv[0],
    -Ot[0]*O0_inv[2] + Ot[1]*O0_inv[3] + Ot[2]*O0_inv[0] + Ot[3]*O0_inv[1],
    Ot[0]*O0_inv[1] - Ot[1]*O0_inv[0] + Ot[2]*O0_inv[3] + Ot[3]*O0_inv[2],
    -Ot[0]*O0_inv[0] - Ot[1]*O0_inv[1] - Ot[2]*O0_inv[2] + Ot[3]*O0_inv[3]
  ];
  
  console.log(`  dO rotor: [${dO.map(x => x.toFixed(6)).join(', ')}]`);
  
  // 3. Compute dR = getDeltaR(dO)
  const [yz, xz, xy, w] = dO;
  const sinHalfTheta = Math.sqrt(yz*yz + xz*xz + xy*xy);
  let dR = [0, 0, 0];
  
  if (sinHalfTheta > 1e-10) {
    const theta = 2 * Math.atan2(sinHalfTheta, w);
    const multiplier = theta / sinHalfTheta;
    dR = [yz * multiplier, xz * multiplier, xy * multiplier];
  }
  
  console.log(`  dR: [Y=${dR[0].toFixed(6)}, X=${dR[1].toFixed(6)}, Z=${dR[2].toFixed(6)}]`);
  
  // Analyze which axes are active
  const magnitudes = dR.map(Math.abs);
  const maxMag = Math.max(...magnitudes);
  const thresholdActive = 0.01;  // Anything > 0.01 rad is "active"
  
  const pitchActive = Math.abs(dR[0]) > thresholdActive;
  const rollActive = Math.abs(dR[1]) > thresholdActive;
  const headingActive = Math.abs(dR[2]) > thresholdActive;
  
  console.log(`  COUPLING CHECK:`);
  console.log(`    Pitch (Y):   ${pitchActive ? '✗ ACTIVE' : '✓ QUIET'} (${dR[0].toFixed(6)})`);
  console.log(`    Roll (X):    ${rollActive ? '✗ ACTIVE' : '✓ QUIET'} (${dR[1].toFixed(6)})`);
  console.log(`    Heading (Z): ${headingActive ? '✓ ACTIVE' : '✗ QUIET'} (${dR[2].toFixed(6)})`);
  
  if (pitchActive || rollActive) {
    console.log(`\n  ⚠ COUPLING DETECTED: Pitch/Roll are also changing!`);
  } else {
    console.log(`\n  ✓ DECOUPLED: Only heading is active, pitch/roll quiet!`);
  }
  
  console.log();
});

console.log('═══════════════════════════════════════════════════════════\n');
console.log('INTERPRETATION:\n');
console.log('If all tests show:');
console.log('  ✓ Pitch QUIET');
console.log('  ✓ Roll QUIET');
console.log('  ✓ Heading ACTIVE');
console.log('\nThen the math is correct and coupling is due to O0 values.');
console.log('\nIf any test shows:');
console.log('  ✗ Pitch ACTIVE or Roll ACTIVE');
console.log('\nThen there\'s still a coupling issue to investigate.');
