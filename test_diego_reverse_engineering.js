/**
 * Detailed Diego Analysis - Checking the Full Pipeline
 * 
 * The previous test showed that IF target heading ≈ 70°, the dO would be
 * mostly pure Z (heading) with tiny Y/X components.
 * 
 * But Diego's observed dR shows:
 * - dR: [+0.00318, -0.00587, -0.00024]
 * - Heading component is TINY (-0.00024) - nearly zero!
 * - Pitch component is LARGER (+0.00318)
 * 
 * This suggests the target heading might be VERY close to current heading.
 * Let's test what happens when target heading ≈ current heading.
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

const classifyRotor = (rotor) => {
	let [yz, xz, xy, w] = rotor;
	const axis = [yz, xz, xy];
	const axisMag = mag(axis);
	
	if (axisMag < 1e-8) return { isPure: true, dominant: 'IDENTITY', purity: 1 };
	
	const absAxis = [Math.abs(yz), Math.abs(xz), Math.abs(xy)];
	const maxAxis = Math.max(...absAxis);
	const purity = maxAxis / axisMag;
	
	let dominant = 'Z (Heading)';
	if (absAxis[0] === maxAxis) dominant = 'Y (Pitch)';
	else if (absAxis[1] === maxAxis) dominant = 'X (Roll)';
	
	return {
		isPure: purity > 0.95,
		dominant: dominant,
		purity: purity
	};
};

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     DIEGO PIPELINE ANALYSIS - Reversed Engineering        ║');
console.log('╚════════════════════════════════════════════════════════════╝');

// Observed from Diego
const observed_dR = [0.00318, -0.00587, -0.00024];
const dR_mag = mag(observed_dR);

console.log('\n[OBSERVED FROM DIEGO]');
console.log(`dR: [${observed_dR.map(x => x.toFixed(6)).join(', ')}]`);
console.log(`dR_mag: ${dR_mag.toFixed(6)} rad (${(dR_mag * 180 / Math.PI).toFixed(3)}°)`);

// Which component dominates?
const absComps = observed_dR.map(Math.abs);
const maxComp = Math.max(...absComps);
let maxAxis = 'Z (Head)';
if (absComps[0] === maxComp) maxAxis = 'Y (Pitch)';
else if (absComps[1] === maxComp) maxAxis = 'X (Roll)';

console.log(`\nDominant component: ${maxAxis}`);
console.log(`  Y (Pitch): ${observed_dR[0].toFixed(6)} rad (${(observed_dR[0] * 180 / Math.PI).toFixed(3)}°)`);
console.log(`  X (Roll):  ${observed_dR[1].toFixed(6)} rad (${(observed_dR[1] * 180 / Math.PI).toFixed(3)}°)`);
console.log(`  Z (Head):  ${observed_dR[2].toFixed(6)} rad (${(observed_dR[2] * 180 / Math.PI).toFixed(3)}°)`);

// Test different scenarios
console.log('\n' + '='.repeat(70));
console.log('SCENARIO TESTING - Finding match to observed dR');
console.log('='.repeat(70));

const scenarios = [
	{
		name: 'Scenario A: Target heading ≈ current (small correction)',
		O0: [0, 0.1, 55.6],
		Ot: [0, 0, 55.65]  // Only 0.05° heading change
	},
	{
		name: 'Scenario B: Small pitch correction with heading',
		O0: [0, 0.1, 55.6],
		Ot: [0, -0.18, 55.58]  // Pitch 0.1 → -0.08, heading change
	},
	{
		name: 'Scenario C: Mixed rotations',
		O0: [-0.05, 0.1, 55.6],
		Ot: [0, 0, 55.6]  // Correct pitch/roll to zero, keep heading
	},
	{
		name: 'Scenario D: Current state as-is targeting flat orientation',
		O0: [-0.0, 0.1, 55.6],
		Ot: [0.03, -0.02, 55.65]  // Slight corrections
	}
];

scenarios.forEach((scenario, idx) => {
	console.log(`\n[${idx + 1}] ${scenario.name}`);
	console.log(`    O0: [${scenario.O0.map(x => x.toFixed(2)).join(', ')}]° (R,P,H)`);
	console.log(`    Ot: [${scenario.Ot.map(x => x.toFixed(2)).join(', ')}]° (R,P,H)`);
	
	const O0 = eulerToRotor(scenario.O0[0], scenario.O0[1], scenario.O0[2]);
	const Ot = eulerToRotor(scenario.Ot[0], scenario.Ot[1], scenario.Ot[2]);
	const dO = mulQuat(Ot, rotorInverse(O0));
	const dR = getDeltaR(dO);
	const dR_mag_calc = mag(dR);
	const classification = classifyRotor(dO);
	
	console.log(`    Predicted dR: [${dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`    Magnitude: ${dR_mag_calc.toFixed(6)} (${(dR_mag_calc * 180 / Math.PI).toFixed(3)}°)`);
	console.log(`    Type: ${classification.isPure ? 'PURE' : 'COMPOUND'} | Dominant: ${classification.dominant} (${(classification.purity * 100).toFixed(1)}%)`);
	
	// Calculate error vs observed
	const error = Math.sqrt(
		(dR[0] - observed_dR[0]) ** 2 +
		(dR[1] - observed_dR[1]) ** 2 +
		(dR[2] - observed_dR[2]) ** 2
	);
	console.log(`    Error vs observed: ${error.toFixed(6)} ${error < 0.001 ? '✓ MATCH!' : ''}`);
});

console.log(`\n${'='.repeat(70)}`);
console.log('KEY OBSERVATION');
console.log(`${'='.repeat(70)}`);

console.log(`
The pitch component (+0.00318) is the DOMINANT component in Diego's observed dR.
This is unusual if she's only correcting heading.

POSSIBLE EXPLANATIONS:

1. [LIKELY] O0 has pitch≠0 and target Ot is being created with
   different pitch than O0. This creates coupling where pitch
   correction dominates the dR.

2. [POSSIBLE] The getTt function is being called on a DIFFERENT dO
   than the one from _emote_seekTarget. There might be additional
   rotations being applied between seekTarget and getTtAxis.

3. [POSSIBLE] The current O0 orientation is not what we think it is.
   The display shows pitch=0.1° but the actual rotor might differ.

4. [POSSIBLE] There's an error in how surface clamping is working,
   and Ot is being constructed incorrectly.

RECOMMENDATION:
Add logging directly in _emote_seekTarget to capture:
- O0 (before dO calculation)
- Ot_abs (absolute target orientation)
- Ot (after surface clamping)
- dO (delta orientation)
- dR (delta rotation)

Compare each with what the rotor_diagnostic predicts.
`);

console.log(`${'='.repeat(70)}\n`);
