/**
 * Diego Coupling Diagnostic Test
 * 
 * This captures real O0, Ot, dO, dR data from Diego's _emote_seekTarget
 * and analyzes it to find the root cause of coupling.
 * 
 * Run this AFTER adding logging to physics.js _emote_seekTarget
 */

const mag = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

function analyzeRoutorData(samples) {
	if (!samples || samples.length === 0) {
		console.log('No samples collected');
		return;
	}

	console.log('\n╔════════════════════════════════════════════════════════════╗');
	console.log('║          DIEGO COUPLING ANALYSIS - REAL DATA              ║');
	console.log('╚════════════════════════════════════════════════════════════╝\n');

	console.log(`Analyzing ${samples.length} samples\n`);

	// Analyze first sample
	const first = samples[0];
	const last = samples[samples.length - 1];

	console.log('═ FIRST SAMPLE');
	console.log(`O0 (current):     [${first.O0.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`Ot (target):      [${first.Ot.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`Ot_abs (raw):     [${first.Ot_abs.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`dO (delta):       [${first.dO.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`dR (bivector):    [${first.dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`dR_mag:           ${first.dR_mag.toFixed(6)} rad (${(first.dR_mag * 180 / Math.PI).toFixed(3)}°)\n`);

	console.log('═ LAST SAMPLE');
	console.log(`O0:               [${last.O0.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`Ot:               [${last.Ot.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`dR:               [${last.dR.map(x => x.toFixed(6)).join(', ')}]\n`);

	// Check stability
	const O0_unique = new Set(samples.map(s => JSON.stringify(s.O0))).size;
	const Ot_unique = new Set(samples.map(s => JSON.stringify(s.Ot))).size;
	const dR_unique = new Set(samples.map(s => JSON.stringify(s.dR.map(x => x.toFixed(4))))).size;

	console.log('═ VARIABILITY');
	console.log(`O0 unique values: ${O0_unique}/${samples.length} ${O0_unique === 1 ? '(static)' : '(changing)'}`);
	console.log(`Ot unique values: ${Ot_unique}/${samples.length} ${Ot_unique === 1 ? '(static)' : '(changing)'}`);
	console.log(`dR unique values: ${dR_unique}/${samples.length}\n`);

	// Analyze dR patterns
	const absComps = first.dR.map(Math.abs);
	const maxIdx = absComps.indexOf(Math.max(...absComps));
	const labels = ['Y (Pitch)', 'X (Roll)', 'Z (Heading)'];
	
	console.log('═ dR COMPONENT ANALYSIS');
	console.log(`Y (Pitch):  ${first.dR[0].toFixed(6)} rad (${(first.dR[0] * 180 / Math.PI).toFixed(3)}°)`);
	console.log(`X (Roll):   ${first.dR[1].toFixed(6)} rad (${(first.dR[1] * 180 / Math.PI).toFixed(3)}°)`);
	console.log(`Z (Head):   ${first.dR[2].toFixed(6)} rad (${(first.dR[2] * 180 / Math.PI).toFixed(3)}°)`);
	console.log(`\nDominant: ${labels[maxIdx]} (magnitude: ${absComps[maxIdx].toFixed(6)})\n`);

	// Check if Ot is surface-clamped
	const Ot_isClipped = Math.abs(first.Ot[0]) < 0.01 && Math.abs(first.Ot[1]) < 0.01;
	console.log('═ SURFACE CLAMPING CHECK');
	console.log(`Ot[0] (pitch): ${first.Ot[0].toFixed(6)}`);
	console.log(`Ot[1] (roll):  ${first.Ot[1].toFixed(6)}`);
	console.log(`Status: ${Ot_isClipped ? '✓ Surface-clamped (pitch & roll ~0)' : '✗ NOT surface-clamped'}\n`);

	// Compare with Ot_abs
	const Ot_abs_different = !Ot_isClipped || mag([first.Ot[0], first.Ot[1]]) > 0.001;
	console.log('═ SURFACE vs RAW TARGET');
	console.log(`Ot (surface):     [${first.Ot.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`Ot_abs (raw):     [${first.Ot_abs.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`Difference: ${Ot_abs_different ? '✗ Different (surface clamping active)' : '✓ Same (no clamping)'}\n`);

	// Key insight
	console.log('═ KEY INSIGHT');
	if (maxIdx !== 2) {
		console.log(`✗ Expected Z (heading) to dominate, but ${labels[maxIdx]} dominates!`);
		console.log(`This suggests O0 has non-zero ${labels[maxIdx].split('(')[1]}`);
	} else {
		console.log(`✓ Heading dominates as expected`);
	}

	console.log(`\n═ NEXT STEPS`);
	console.log(`1. Check if O0 pitch/roll values match display (0.1° / -0.0°)`);
	console.log(`2. Check if Ot is actually surface-clamped`);
	console.log(`3. If Ot_abs differs from Ot, clamping is working`);
	console.log(`4. If pitch/roll components dominate dR, O0 has those components\n`);

	return {
		O0: first.O0,
		Ot: first.Ot,
		Ot_abs: first.Ot_abs,
		dR: first.dR,
		dominantAxis: labels[maxIdx],
		numSamples: samples.length
	};
}

// Export for use
module.exports = { analyzeRoutorData };

// If running standalone (after data is captured):
if (typeof DIEGO_COUPLING_DEBUG !== 'undefined' && DIEGO_COUPLING_DEBUG.samples.length > 0) {
	analyzeRoutorData(DIEGO_COUPLING_DEBUG.samples);
}
