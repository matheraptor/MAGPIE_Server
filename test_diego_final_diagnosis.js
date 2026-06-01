/**
 * Final Diagnosis: Testing O0 with both pitch AND roll active
 * 
 * User reported: Pitch: 0.1°, Roll: -0.0°
 * But "-0.0" might actually be a small negative value
 * Let's test combinations that could produce the observed dR
 */

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

const rotorInverse = (q) => [-q[0], -q[1], -q[2], q[3]];

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

const getDeltaR = (dO) => {
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

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║   FINAL DIAGNOSIS: Both Pitch & Roll in O0 Active         ║');
console.log('╚════════════════════════════════════════════════════════════╝');

const observed_dR = [0.00318, -0.00587, -0.00024];
console.log(`\n[TARGET] Diego's observed dR:`);
console.log(`  [${observed_dR.map(x => x.toFixed(6)).join(', ')}]`);

console.log(`\n[TESTING] Various O0 + Ot combinations:\n`);

// Generate test matrix: O0 has various roll/pitch, Ot is surface-clamped
const rollRange = [-0.05, -0.02, -0.01, 0, 0.01, 0.02, 0.05];
const pitchRange = [0.05, 0.08, 0.10, 0.12, 0.15];

let bestMatch = { error: Infinity };

// Test a focused set
const focusedTests = [
	{ O0: [-0.02, 0.10, 55.6], Ot: [0, 0, 55.6], name: 'Roll -0.02° correcting to 0°' },
	{ O0: [-0.035, 0.10, 55.6], Ot: [0, 0, 55.6], name: 'Roll -0.035° correcting to 0°' },
	{ O0: [-0.05, 0.10, 55.6], Ot: [0, 0, 55.6], name: 'Roll -0.05° correcting to 0°' },
	{ O0: [-0.04, 0.08, 55.6], Ot: [0, 0, 55.6], name: 'Roll -0.04°, Pitch 0.08°' },
	{ O0: [-0.045, 0.09, 55.6], Ot: [0, 0, 55.6], name: 'Roll -0.045°, Pitch 0.09°' },
	{ O0: [-0.036, 0.095, 55.6], Ot: [0, 0, 55.6], name: 'Roll -0.036°, Pitch 0.095°' },
	{ O0: [-0.04, 0.095, 55.6], Ot: [0, 0, 55.65], name: 'Roll -0.04°, slight heading change' },
	{ O0: [-0.038, 0.10, 55.59], Ot: [0, 0, 55.60], name: 'All three slightly active' },
];

focusedTests.forEach(test => {
	const O0 = eulerToRotor(test.O0[0], test.O0[1], test.O0[2]);
	const Ot = eulerToRotor(test.Ot[0], test.Ot[1], test.Ot[2]);
	const dO = mulQuat(Ot, rotorInverse(O0));
	const dR = getDeltaR(dO);
	const dR_mag_calc = mag(dR);
	
	const error = Math.sqrt(
		(dR[0] - observed_dR[0]) ** 2 +
		(dR[1] - observed_dR[1]) ** 2 +
		(dR[2] - observed_dR[2]) ** 2
	);
	
	console.log(`[O0: R=${test.O0[0].toFixed(3)}°, P=${test.O0[1].toFixed(3)}°, H=${test.O0[2].toFixed(3)}°]`);
	console.log(`  ${test.name}`);
	console.log(`  Predicted dR: [${dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`  Error: ${error.toFixed(6)} ${error < 0.002 ? '★ CLOSE MATCH' : ''}`);
	
	if (error < bestMatch.error) {
		bestMatch = { error, test, O0, Ot, dO, dR };
	}
});

console.log(`\n${'='.repeat(70)}`);
console.log('BEST MATCH FOUND');
console.log(`${'='.repeat(70)}`);

if (bestMatch.error < 0.005) {
	console.log(`\n✓ MATCH FOUND with error ${bestMatch.error.toFixed(6)}`);
	console.log(`\nO0 (current orientation):`);
	console.log(`  Roll: ${bestMatch.test.O0[0]}°`);
	console.log(`  Pitch: ${bestMatch.test.O0[1]}°`);
	console.log(`  Heading: ${bestMatch.test.O0[2]}°`);
	
	console.log(`\nOt (target orientation after surface clamping):`);
	console.log(`  Roll: ${bestMatch.test.Ot[0]}°`);
	console.log(`  Pitch: ${bestMatch.test.Ot[1]}°`);
	console.log(`  Heading: ${bestMatch.test.Ot[2]}°`);
	
	console.log(`\nProduced dR: [${bestMatch.dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`Observed dR: [${observed_dR.map(x => x.toFixed(6)).join(', ')}]`);
} else {
	console.log(`\n✗ No close match found. Best error: ${bestMatch.error.toFixed(6)}`);
	console.log(`\nThis suggests:`);
	console.log(`1. O0 might have very different pitch/roll values`);
	console.log(`2. Ot might not be surface-clamped to [0,0,heading]`);
	console.log(`3. There might be additional rotations in the pipeline`);
	console.log(`4. The dR might be from a different computation`);
}

console.log(`\n${'='.repeat(70)}`);
console.log('ACTIONABLE NEXT STEP');
console.log(`${'='.repeat(70)}`);

console.log(`
To solve this mystery, add this logging to physics.js in _emote_seekTarget:

    // After computing dO and dR, log them
    const O0_euler = rotorToEuler(O0);  // Need to implement this
    const Ot_euler = rotorToEuler(Ot);
    
    console.log('[_emote_seekTarget]');
    console.log('  O0 (current): R=' + O0_euler[0].toFixed(2) + 
                '°, P=' + O0_euler[1].toFixed(2) + 
                '°, H=' + O0_euler[2].toFixed(2) + '°');
    console.log('  Ot (target):  R=' + Ot_euler[0].toFixed(2) + 
                '°, P=' + Ot_euler[1].toFixed(2) + 
                '°, H=' + Ot_euler[2].toFixed(2) + '°');
    console.log('  dO: [' + dO.map(x => x.toFixed(6)).join(', ') + ']');
    console.log('  dR (raw): [' + dR.map(x => x.toFixed(6)).join(', ') + ']');

Then compare the logged O0/Ot with what you see in the display.
If they don't match, that's where the coupling is coming from.
`);

console.log(`${'='.repeat(70)}\n`);
