/**
 * Sandbox Test: Diego's Coupling Issue
 * 
 * Current state:
 * - Heading: 55.6°
 * - Pitch: 0.1°
 * - Roll: -0.0°
 * 
 * Seeking target at heading ≠ 55.6°
 * With surface=true, Ot is clamped to [heading_only, 0, 0]
 * 
 * HYPOTHESIS: dO is COMPOUND because:
 * O0 has [pitch≠0, roll≈0, heading=55.6°]
 * Ot has [pitch=0, roll=0, heading=target]
 * dO must correct BOTH pitch AND heading simultaneously
 */

// Geometric algebra utilities
const mag = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

const eulerToRotor = (rollDeg, pitchDeg, headingDeg) => {
	const roll = rollDeg * Math.PI / 180;
	const pitch = pitchDeg * Math.PI / 180;
	const heading = headingDeg * Math.PI / 180;

	const q_roll = [0, Math.sin(roll / 2), 0, Math.cos(roll / 2)];
	const q_pitch = [Math.sin(pitch / 2), 0, 0, Math.cos(pitch / 2)];
	const q_heading = [0, 0, Math.sin(heading / 2), Math.cos(heading / 2)];

	const mulQuat = (q1, q2) => {
		const [yz1, xz1, xy1, w1] = q1;
		const [yz2, xz2, xy2, w2] = q2;
		return [
			w1 * yz2 + yz1 * w2 + xz1 * xy2 - xy1 * xz2,
			w1 * xz2 + xz1 * w2 + xy1 * yz2 - yz1 * xy2,
			w1 * xy2 + xy1 * w2 + yz1 * xz2 - xz1 * yz2,
			w1 * w2 - yz1 * yz2 - xz1 * xz2 - xy1 * xy2
		];
	};

	const temp = mulQuat(q_roll, q_pitch);
	return mulQuat(temp, q_heading);
};

const rotorInverse = (q) => {
	// For unit quaternion, inverse = conjugate
	return [
		-q[0],
		-q[1],
		-q[2],
		q[3]
	];
};

const mulQuat = (q1, q2) => {
	const [yz1, xz1, xy1, w1] = q1;
	const [yz2, xz2, xy2, w2] = q2;
	return [
		w1 * yz2 + yz1 * w2 + xz1 * xy2 - xy1 * xz2,
		w1 * xz2 + xz1 * w2 + xy1 * yz2 - yz1 * xy2,
		w1 * xy2 + xy1 * w2 + yz1 * xz2 - xz1 * yz2,
		w1 * w2 - yz1 * yz2 - xz1 * xz2 - xy1 * xy2
	];
};

const rotorToAxisAngle = (rotor) => {
	let [yz, xz, xy, w] = rotor;
	const sinHalfTheta = mag([yz, xz, xy]);

	if (sinHalfTheta < 1e-8) {
		return { angle: 0, axis: [0, 0, 1], isPure: true };
	}

	const halfTheta = Math.atan2(sinHalfTheta, w);
	const theta = halfTheta * 2;

	const axis = [
		yz / sinHalfTheta,
		xz / sinHalfTheta,
		xy / sinHalfTheta
	];

	return {
		angle: theta,
		axis: axis,
		sinHalfTheta: sinHalfTheta,
		w: w
	};
};

const classifyRotor = (rotor) => {
	const { angle, axis } = rotorToAxisAngle(rotor);

	const [ax, ay, az] = axis;
	const absAxis = [Math.abs(ax), Math.abs(ay), Math.abs(az)];
	const maxAxis = Math.max(...absAxis);

	const purityThreshold = 0.95;
	const isPure = maxAxis > purityThreshold;

	let dominantAxis = 'COUPLED';
	if (absAxis[0] === maxAxis) dominantAxis = 'Y (yz/Pitch)';
	else if (absAxis[1] === maxAxis) dominantAxis = 'X (xz/Roll)';
	else if (absAxis[2] === maxAxis) dominantAxis = 'Z (xy/Heading)';

	const purity = maxAxis;

	return {
		angle: angle,
		axis: axis,
		dominantAxis: dominantAxis,
		purity: purity,
		isPure: isPure,
		classification: isPure ? 'PURE' : 'COMPOUND'
	};
};

const analyzeRotor = (rotor, label = 'Rotor') => {
	console.log(`\n${'='.repeat(70)}`);
	console.log(`${label}`);
	console.log(`${'='.repeat(70)}`);

	console.log(`Input rotor: [${rotor.map(x => x.toFixed(6)).join(', ')}]`);

	const { angle, axis, dominantAxis, purity, isPure, classification } = classifyRotor(rotor);

	console.log(`\nRotation Analysis:`);
	console.log(`  Angle: ${(angle * 180 / Math.PI).toFixed(2)}°`);
	console.log(`  Axis: [${axis.map(x => x.toFixed(4)).join(', ')}]`);
	console.log(`  Dominant axis: ${dominantAxis}`);
	console.log(`  Purity: ${(purity * 100).toFixed(1)}%`);
	console.log(`  Classification: ${classification}`);

	// Show bivector
	const sinHalfTheta = mag([rotor[0], rotor[1], rotor[2]]);
	const halfTheta = Math.atan2(sinHalfTheta, rotor[3]);
	const theta = halfTheta * 2;
	const multiplier = theta / sinHalfTheta || 0;

	const dR = [
		rotor[0] * multiplier,
		rotor[1] * multiplier,
		rotor[2] * multiplier
	];

	console.log(`\nBivector decomposition (dR):`);
	console.log(`  dR = [${dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`  Y (Pitch): ${dR[0].toFixed(6)} ${Math.abs(dR[0]) > 0.001 ? '← active' : ''}`);
	console.log(`  X (Roll):  ${dR[1].toFixed(6)} ${Math.abs(dR[1]) > 0.001 ? '← active' : ''}`);
	console.log(`  Z (Head):  ${dR[2].toFixed(6)} ${Math.abs(dR[2]) > 0.001 ? '← active' : ''}`);

	return { rotor, dR, classification, purity };
};

// ============================================================================
// TEST: Diego's Current Scenario
// ============================================================================

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║        DIEGO COUPLING DIAGNOSIS                           ║');
console.log('║  HTP A9805 "Diego Marea" (ID: 1773811141134)              ║');
console.log('╚════════════════════════════════════════════════════════════╝');

// Current Diego state
const diego_current = {
	heading: 55.6,
	pitch: 0.1,
	roll: -0.0
};

// Target with surface=true clamping (pitch and roll → 0)
const diego_target = {
	heading: 70.0,  // Assume target is at different heading
	pitch: 0,       // Clamped by surface constraint
	roll: 0         // Clamped by surface constraint
};

console.log('\n[SCENARIO] Diego seeking WP-249-28 with surface=true\n');
console.log(`Current orientation (O0):`);
console.log(`  Roll: ${diego_current.roll}°`);
console.log(`  Pitch: ${diego_current.pitch}°`);
console.log(`  Heading: ${diego_current.heading}°`);

console.log(`\nTarget orientation (Ot) — surface-clamped:`);
console.log(`  Roll: ${diego_target.roll}°`);
console.log(`  Pitch: ${diego_target.pitch}°`);
console.log(`  Heading: ${diego_target.heading}°`);

// Build rotors
const O0 = eulerToRotor(diego_current.roll, diego_current.pitch, diego_current.heading);
const Ot = eulerToRotor(diego_target.roll, diego_target.pitch, diego_target.heading);

console.log(`\nO0 (current): [${O0.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`Ot (target):  [${Ot.map(x => x.toFixed(6)).join(', ')}]`);

// Compute delta: dO = Ot * O0^-1
const O0_inv = rotorInverse(O0);
const dO = mulQuat(Ot, O0_inv);

console.log(`O0_inv:       [${O0_inv.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`dO = Ot * O0^-1: [${dO.map(x => x.toFixed(6)).join(', ')}]`);

// Analyze dO
const analysis = analyzeRotor(dO, 'DELTA ORIENTATION (dO) FROM SEEKTARGET');

// Compare with what you're observing
console.log(`\n${'='.repeat(70)}`);
console.log('COMPARISON WITH DIEGO\'S OBSERVED dR');
console.log(`${'='.repeat(70)}`);

const observed_dR = [0.00318, -0.00587, -0.00024];
console.log(`\nObserved dR from getTt: [${observed_dR.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`Predicted dR from dO:   [${analysis.dR.map(x => x.toFixed(6)).join(', ')}]`);

console.log(`\n${'='.repeat(70)}`);
console.log('DIAGNOSIS');
console.log(`${'='.repeat(70)}`);

if (analysis.classification === 'COMPOUND') {
	console.log(`\n✗ COMPOUND ROTOR CONFIRMED`);
	console.log(`\nWhy is this happening?`);
	console.log(`\n1. Diego's current pitch is 0.1° (not zero)`);
	console.log(`2. Target has pitch clamped to 0°`);
	console.log(`3. dO must simultaneously:`);
	console.log(`   - Correct pitch: 0.1° → 0°`);
	console.log(`   - Change heading: 55.6° → 70.0°`);
	console.log(`4. These two corrections form ONE rotor, so it's COMPOUND`);
	console.log(`\n${analysis.purity * 100 > 50 ? '✗ PRIMARILY' : '✗ ROUGHLY EQUALLY'} driven by: ${analysis.dominantAxis}`);
	console.log(`   But other axes are definitely active (purity: ${(analysis.purity * 100).toFixed(1)}%)`);
} else {
	console.log(`\n✓ PURE ROTOR`);
	console.log(`This shouldn't happen with the current scenario.`);
}

console.log(`\n${'='.repeat(70)}`);
console.log('WHAT THIS MEANS FOR getTtAxis');
console.log(`${'='.repeat(70)}`);

console.log(`
When dR = [${analysis.dR.map(x => x.toFixed(5)).join(', ')}]:

getTtAxis(dR[0], ..., axis=0) sees pitch change of ${(analysis.dR[0] * 180 / Math.PI).toFixed(2)}°
getTtAxis(dR[1], ..., axis=1) sees roll change of ${(analysis.dR[1] * 180 / Math.PI).toFixed(2)}°
getTtAxis(dR[2], ..., axis=2) sees heading change of ${(analysis.dR[2] * 180 / Math.PI).toFixed(2)}°

✗ All three axes are active because dO is COMPOUND.
  This is NOT a bug—it's the mathematical consequence of O0 having
  pitch≠0 while Ot is clamped to pitch=0.

SOLUTION: Before surface clamping, correct the current pitch/roll
first, then extract heading for the clamped target.
`);

console.log(`${'='.repeat(70)}\n`);
