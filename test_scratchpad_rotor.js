/**
 * Sandbox Test: Classify the rotor from scratchpad.js line 83
 * 
 * Line 83: diego._set_O1(PHYSICS._rotor_fromEulerAbs(300,0,0, diego._get_P0()))
 * 
 * This computes what that rotor should be and classifies it.
 */

// Geometric algebra utilities
const mag = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

// Convert Euler angles to rotor
// Using ZYX convention (heading, pitch, roll applied in that order)
// But scratchpad uses (roll, pitch, heading) = (300, 0, 0)
const eulerToRotor = (rollDeg, pitchDeg, headingDeg) => {
	const roll = rollDeg * Math.PI / 180;
	const pitch = pitchDeg * Math.PI / 180;
	const heading = headingDeg * Math.PI / 180;

	// Compute individual rotors for each axis
	// Roll (X-axis): [0, sin(θ/2), 0, cos(θ/2)]
	const q_roll = [
		0,
		Math.sin(roll / 2),
		0,
		Math.cos(roll / 2)
	];

	// Pitch (Y-axis): [sin(θ/2), 0, 0, cos(θ/2)]
	const q_pitch = [
		Math.sin(pitch / 2),
		0,
		0,
		Math.cos(pitch / 2)
	];

	// Heading (Z-axis): [0, 0, sin(θ/2), cos(θ/2)]
	const q_heading = [
		0,
		0,
		Math.sin(heading / 2),
		Math.cos(heading / 2)
	];

	// Quaternion multiply: q_roll * q_pitch * q_heading
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
	if (absAxis[0] === maxAxis) dominantAxis = 'Y (yz) — PITCH';
	else if (absAxis[1] === maxAxis) dominantAxis = 'X (xz) — ROLL';
	else if (absAxis[2] === maxAxis) dominantAxis = 'Z (xy) — HEADING';

	const purity = maxAxis;

	return {
		angle: angle,
		axis: axis,
		dominantAxis: dominantAxis,
		purity: purity,
		isPure: isPure,
		classification: isPure ? 'PURE SINGLE-AXIS' : 'COMPOUND MULTI-AXIS'
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
	console.log(`  Axis purity: ${(purity * 100).toFixed(1)}%`);
	console.log(`  Classification: ${classification}`);

	if (isPure) {
		console.log(`\n✓ PURE ROTATION — This rotor affects only ONE rotation axis.`);
		console.log(`  When decomposed to bivector, only one component will be non-zero.`);
	} else {
		console.log(`\n✗ COMPOUND ROTATION — This rotor combines multiple rotation axes.`);
		console.log(`  When decomposed to bivector, all three components will be non-zero.`);
	}

	// Show bivector decomposition
	const sinHalfTheta = mag([rotor[0], rotor[1], rotor[2]]);
	const halfTheta = Math.atan2(sinHalfTheta, rotor[3]);
	const theta = halfTheta * 2;
	const multiplier = theta / sinHalfTheta || 0;

	const dR = [
		rotor[0] * multiplier,
		rotor[1] * multiplier,
		rotor[2] * multiplier
	];

	console.log(`\nBivector decomposition (dR when getDeltaR is applied):`);
	console.log(`  dR = [${dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`  [0] Y-component (yz/Pitch): ${dR[0].toFixed(6)} ${Math.abs(dR[0]) > 0.01 ? '← active' : '← quiet'}`);
	console.log(`  [1] X-component (xz/Roll):  ${dR[1].toFixed(6)} ${Math.abs(dR[1]) > 0.01 ? '← active' : '← quiet'}`);
	console.log(`  [2] Z-component (xy/Head):  ${dR[2].toFixed(6)} ${Math.abs(dR[2]) > 0.01 ? '← active' : '← quiet'}`);

	console.log(`\nFor getTtAxis processing:`);
	if (isPure) {
		console.log(`  ✓ Call getTtAxis ONCE for the active axis`);
		console.log(`  ✓ Other two axes will naturally produce ~0 torque`);
	} else {
		console.log(`  ✗ getTtAxis will see ALL THREE axes as active`);
		console.log(`  ✗ Need to decide: process compound, or decompose first`);
	}

	return { rotor, classification, dR, angle, axis };
};

// ============================================================================
// TEST: From scratchpad.js line 83
// ============================================================================

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  SANDBOX TEST: Rotor from scratchpad.js line 83           ║');
console.log('║  diego._set_O1(PHYSICS._rotor_fromEulerAbs(300,0,0, ...)) ║');
console.log('╚════════════════════════════════════════════════════════════╝');

const testRotor = eulerToRotor(300, 0, 0);
analyzeRotor(testRotor, 'TEST: Euler(300°, 0°, 0°) → Pure Roll');

console.log(`\n${'='.repeat(70)}`);
console.log('INTERPRETATION FOR YOUR CODE:');
console.log(`${'='.repeat(70)}`);
console.log(`
This rotor sets Diego's orientation to:
  - Roll: 300° (pure X-axis rotation)
  - Pitch: 0°
  - Heading: 0°

Since ONLY roll is active, this is a PURE SINGLE-AXIS rotation.

When you call getTtAxis() three times (for roll, pitch, heading):
  ✓ Roll axis will see the target change
  ✗ Pitch and Heading will see NO change (dR[0] and dR[2] ≈ 0)

If you're seeing OTHER axes change when correcting roll,
the problem is NOT in this rotor—the problem is likely that
you're applying compound rotations elsewhere.
`);
console.log(`${'='.repeat(70)}\n`);
