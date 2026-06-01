/**
 * Debug script for _getDeltaR
 * 
 * Verifies that getDeltaR correctly converts a delta orientation rotor (dO)
 * into a delta rotation bivector (dR).
 * 
 * Key insight: A rotor [yz, xz, xy, w] represents a rotation.
 * When decomposed to a rotation vector (bivector), it should represent
 * the axis-angle form of that rotation.
 */

// Minimal geometric algebra functions
const mag = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

const _getDeltaR = (dO) => {
	let [yz, xz, xy, w] = dO;
	const sinHalfTheta = mag([yz, xz, xy]);
	if(sinHalfTheta < 1e-6)
		return [0, 0, 0];
	const halfTheta = Math.atan2(sinHalfTheta, w);
	const theta = halfTheta * 2;
	const multiplier = theta / sinHalfTheta;
	return [
		yz * multiplier,
		xz * multiplier,
		xy * multiplier
	]
};

console.log('\n=== getDeltaR Debug Suite ===\n');

// Test Case 1: Identity rotor (no rotation)
console.log('TEST 1: Identity Rotor (no rotation)');
const identity = [0, 0, 0, 1];
let dR = _getDeltaR(identity);
console.log(`  Input rotor:  [${identity.join(', ')}]`);
console.log(`  Output dR:    [${dR.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Expected:     [0, 0, 0] (magnitude ~0)`);
console.log(`  Magnitude:    ${mag(dR).toFixed(9)}`);
console.log(`  ✓ PASS: Should be near zero\n`);

// Test Case 2: Pure rotation around Z axis (heading)
// Rotation by angle θ around Z axis: [0, 0, sin(θ/2), cos(θ/2)]
console.log('TEST 2: Pure Z-axis rotation (heading)');
const angle_z = Math.PI / 4; // 45 degrees
const rot_z = [
  0,                      // yz component
  0,                      // xz component
  Math.sin(angle_z / 2),  // xy component
  Math.cos(angle_z / 2)   // w component
];
dR = _getDeltaR(rot_z);
console.log(`  Rotation angle:   ${(angle_z * 180 / Math.PI).toFixed(1)}° around Z`);
console.log(`  Input rotor:      [${rot_z.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Output dR:        [${dR.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Expected dR:      [0, 0, ${angle_z.toFixed(6)}] (pure Z rotation)`);
console.log(`  dR[0] (Y-Z plane): ${dR[0].toFixed(6)} (should be ~0)`);
console.log(`  dR[1] (X-Z plane): ${dR[1].toFixed(6)} (should be ~0)`);
console.log(`  dR[2] (X-Y plane): ${dR[2].toFixed(6)} (should be ~${angle_z.toFixed(6)})`);
console.log(`  ✗ If dR[0] or dR[1] are non-zero, there's crosstalk\n`);

// Test Case 3: Pure rotation around X axis (roll)
console.log('TEST 3: Pure X-axis rotation (roll)');
const angle_x = Math.PI / 6; // 30 degrees
const rot_x = [
  0,                      // yz component
  Math.sin(angle_x / 2),  // xz component
  0,                      // xy component
  Math.cos(angle_x / 2)   // w component
];
dR = _getDeltaR(rot_x);
console.log(`  Rotation angle:   ${(angle_x * 180 / Math.PI).toFixed(1)}° around X`);
console.log(`  Input rotor:      [${rot_x.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Output dR:        [${dR.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Expected dR:      [0, ${angle_x.toFixed(6)}, 0] (pure X rotation)`);
console.log(`  dR[0] (Y-Z plane): ${dR[0].toFixed(6)} (should be ~0)`);
console.log(`  dR[1] (X-Z plane): ${dR[1].toFixed(6)} (should be ~${angle_x.toFixed(6)})`);
console.log(`  dR[2] (X-Y plane): ${dR[2].toFixed(6)} (should be ~0)`);
console.log(`  ✗ If dR[0] or dR[2] are non-zero, there's crosstalk\n`);

// Test Case 4: Pure rotation around Y axis (pitch)
console.log('TEST 4: Pure Y-axis rotation (pitch)');
const angle_y = Math.PI / 3; // 60 degrees
const rot_y = [
  Math.sin(angle_y / 2),  // yz component
  0,                      // xz component
  0,                      // xy component
  Math.cos(angle_y / 2)   // w component
];
dR = _getDeltaR(rot_y);
console.log(`  Rotation angle:   ${(angle_y * 180 / Math.PI).toFixed(1)}° around Y`);
console.log(`  Input rotor:      [${rot_y.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Output dR:        [${dR.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Expected dR:      [${angle_y.toFixed(6)}, 0, 0] (pure Y rotation)`);
console.log(`  dR[0] (Y-Z plane): ${dR[0].toFixed(6)} (should be ~${angle_y.toFixed(6)})`);
console.log(`  dR[1] (X-Z plane): ${dR[1].toFixed(6)} (should be ~0)`);
console.log(`  dR[2] (X-Y plane): ${dR[2].toFixed(6)} (should be ~0)`);
console.log(`  ✗ If dR[1] or dR[2] are non-zero, there's crosstalk\n`);

// Test Case 5: Compound rotation (Z then X)
console.log('TEST 5: Compound rotation (heading + roll)');
const angle_z2 = Math.PI / 6;
const angle_x2 = Math.PI / 4;
// This would require quaternion multiplication, which shows coupling
// For now, show what we'd expect vs what we get
const rot_compound = [
  Math.sin(angle_z2 / 2) * Math.cos(angle_x2 / 2) + Math.cos(angle_z2 / 2) * Math.sin(angle_x2 / 2),  // yz
  Math.sin(angle_x2 / 2) * Math.cos(angle_z2 / 2) - Math.cos(angle_x2 / 2) * Math.sin(angle_z2 / 2),  // xz
  Math.sin(angle_z2 / 2) * Math.cos(angle_x2 / 2) - Math.cos(angle_z2 / 2) * Math.sin(angle_x2 / 2),  // xy
  Math.cos(angle_z2 / 2) * Math.cos(angle_x2 / 2)   // w
];
dR = _getDeltaR(rot_compound);
console.log(`  Rotation 1: ${(angle_z2 * 180 / Math.PI).toFixed(1)}° around Z`);
console.log(`  Rotation 2: ${(angle_x2 * 180 / Math.PI).toFixed(1)}° around X`);
console.log(`  Input rotor:  [${rot_compound.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Output dR:    [${dR.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`  Note: Compound rotations show coupling between axes\n`);

// Test Case 6: Very small rotation
console.log('TEST 6: Very small rotation (near-identity)');
const tiny_angle = 0.001; // ~0.057 degrees
const rot_tiny = [
  0,
  0,
  Math.sin(tiny_angle / 2),
  Math.cos(tiny_angle / 2)
];
dR = _getDeltaR(rot_tiny);
console.log(`  Rotation angle:   ${(tiny_angle * 180 / Math.PI).toFixed(6)}° around Z`);
console.log(`  Input rotor:      [${rot_tiny.map(x => x.toFixed(9)).join(', ')}]`);
console.log(`  Output dR:        [${dR.map(x => x.toFixed(9)).join(', ')}]`);
console.log(`  Expected dR:      [0, 0, ${tiny_angle.toFixed(9)}]`);
console.log(`  Relative error:   ${(Math.abs(dR[2] - tiny_angle) / tiny_angle * 100).toFixed(3)}%\n`);

console.log('=== KEY INSIGHTS ===');
console.log('1. If single-axis rotations show non-zero output in OTHER axes, there\'s crosstalk');
console.log('2. Compound rotations WILL show all axes non-zero (this is expected)');
console.log('3. Check: Is your problem due to _getDeltaR, or how the rotor is being created?');
console.log('4. Check: Are you comparing dR from different time steps? If so, the rotor might be wrong.\n');
