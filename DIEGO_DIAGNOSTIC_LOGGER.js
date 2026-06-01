/**
 * Diego Coupling - Diagnostic Logger Template
 * 
 * Copy-paste this into physics.js _emote_seekTarget to capture the actual
 * O0, Ot, dO, and dR being used. Then run your test and we can diagnose.
 */

// PASTE THIS into physics.js, in the _emote_seekTarget function, 
// right after the dR computation:

/*
	// ============= DIAGNOSTIC LOGGING START =============
	// Add this right after: const dR = this._getDeltaR(dO);
	
	if (typeof DIEGO_COUPLING_DEBUG === 'undefined') {
		DIEGO_COUPLING_DEBUG = {
			samples: [],
			maxSamples: 100
		};
	}
	
	// Extract Euler angles from rotor (simplified for diagnostics)
	const rotorToEulerDegrees = (rotor) => {
		// This is a simplified extraction. For full accuracy, use the actual method.
		const [yz, xz, xy, w] = rotor;
		const mag = Math.sqrt(yz*yz + xz*xz + xy*xy);
		if (mag < 1e-8) return [0, 0, 0];
		
		const angle = 2 * Math.atan2(mag, w);
		const axis = [yz/mag, xz/mag, xy/mag];
		
		// Rough approximation: axis direction maps to angle contribution
		return [
			axis[1] * angle * 180 / Math.PI,  // Roll (X axis)
			axis[0] * angle * 180 / Math.PI,  // Pitch (Y axis)
			axis[2] * angle * 180 / Math.PI   // Heading (Z axis)
		];
	};
	
	const sample = {
		timestamp: Date.now(),
		O0: O0,
		Ot: Ot,
		O0_euler: rotorToEulerDegrees(O0),
		Ot_euler: rotorToEulerDegrees(Ot),
		dO: dO,
		dR: dR,
		dR_mag: this.mag(dR)
	};
	
	DIEGO_COUPLING_DEBUG.samples.push(sample);
	
	// Log to console every 10 calls
	if (DIEGO_COUPLING_DEBUG.samples.length % 10 === 1) {
		const s = sample;
		console.log('[DIEGO_COUPLING] Sample #' + DIEGO_COUPLING_DEBUG.samples.length);
		console.log('  O0 (rotor):    [' + s.O0.map(x => x.toFixed(6)).join(', ') + ']');
		console.log('  O0 (euler):    [R=' + s.O0_euler[0].toFixed(2) + '°, P=' + s.O0_euler[1].toFixed(2) + '°, H=' + s.O0_euler[2].toFixed(2) + '°]');
		console.log('  Ot (rotor):    [' + s.Ot.map(x => x.toFixed(6)).join(', ') + ']');
		console.log('  Ot (euler):    [R=' + s.Ot_euler[0].toFixed(2) + '°, P=' + s.Ot_euler[1].toFixed(2) + '°, H=' + s.Ot_euler[2].toFixed(2) + '°]');
		console.log('  dO (rotor):    [' + s.dO.map(x => x.toFixed(6)).join(', ') + ']');
		console.log('  dR (bivector): [' + s.dR.map(x => x.toFixed(6)).join(', ') + ']');
		console.log('  dR_mag:        ' + s.dR_mag.toFixed(6) + ' rad (' + (s.dR_mag * 180 / Math.PI).toFixed(3) + '°)');
		console.log('');
	}
	
	// Store for later analysis
	if (DIEGO_COUPLING_DEBUG.samples.length >= 100) {
		console.log('[DIEGO_COUPLING] Reached 100 samples. Global variable available:');
		console.log('  Run: DIEGO_COUPLING_DEBUG.samples[i] to inspect any sample');
		console.log('  Or copy to file with: JSON.stringify(DIEGO_COUPLING_DEBUG.samples[i], null, 2)');
	}
	
	// ============= DIAGNOSTIC LOGGING END =============
*/

// ============================================================================
// ANALYSIS SCRIPT - Run this AFTER logging to console
// ============================================================================

function analyzeDiegoCouplingDebug(samples) {
	console.log('\n╔════════════════════════════════════════════════════════════╗');
	console.log('║        DIEGO COUPLING - LOGGED DATA ANALYSIS              ║');
	console.log('╚════════════════════════════════════════════════════════════╝\n');
	
	if (!samples || samples.length === 0) {
		console.log('No samples to analyze. Run the logging code first.');
		return;
	}
	
	console.log(`Analyzing ${samples.length} samples...\n`);
	
	// Analyze first sample
	const first = samples[0];
	console.log('FIRST SAMPLE:');
	console.log(`  O0 rotor: [${first.O0.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`  Ot rotor: [${first.Ot.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`  dR:       [${first.dR.map(x => x.toFixed(6)).join(', ')}]`);
	
	// Check if O0/Ot are changing
	const O0_changes = new Set(samples.map(s => JSON.stringify(s.O0)));
	const Ot_changes = new Set(samples.map(s => JSON.stringify(s.Ot)));
	
	console.log(`\nVARIABILITY:`);
	console.log(`  O0 has ${O0_changes.size} unique values (${samples.length} samples)`);
	console.log(`  Ot has ${Ot_changes.size} unique values (${samples.length} samples)`);
	
	if (Ot_changes.size === 1) {
		console.log(`  → Ot is STATIC (no change over time)`);
	} else {
		console.log(`  → Ot is DYNAMIC (changing)`);
	}
	
	// Compare with expected surface-clamped Ot
	const first_Ot_euler = first.Ot_euler;
	console.log(`\nFIRST Ot EULER ANGLES:`);
	console.log(`  [R=${first_Ot_euler[0].toFixed(2)}°, P=${first_Ot_euler[1].toFixed(2)}°, H=${first_Ot_euler[2].toFixed(2)}°]`);
	
	if (Math.abs(first_Ot_euler[0]) < 0.5 && Math.abs(first_Ot_euler[1]) < 0.5) {
		console.log(`  ✓ Pitch & Roll are near zero (consistent with surface clamping)`);
	} else {
		console.log(`  ✗ Pitch or Roll are NOT near zero (NOT surface-clamped as expected!)`);
	}
	
	// Analyze dR patterns
	const dR_samples = samples.map(s => s.dR);
	const dR_mag_avg = samples.reduce((sum, s) => sum + s.dR_mag, 0) / samples.length;
	
	console.log(`\ndR ANALYSIS:`);
	console.log(`  Average dR magnitude: ${dR_mag_avg.toFixed(6)} rad`);
	console.log(`  First dR:  [${first.dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`  Last dR:   [${samples[samples.length-1].dR.map(x => x.toFixed(6)).join(', ')}]`);
	
	return {
		first: first,
		O0_unique: O0_changes.size,
		Ot_unique: Ot_changes.size,
		dR_avg: dR_mag_avg
	};
}

// Export for use
module.exports = { analyzeDiegoCouplingDebug };
