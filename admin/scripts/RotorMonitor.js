/**
 * Real-Time Rotor Monitor for getTtAxis Debugging
 * 
 * Drop this into physics.js and use it to monitor rotor composition
 * as getTtAxis is called during simulation.
 * 
 * Usage:
 *   const monitor = new RotorMonitor();
 *   monitor.sample(dO, label);
 *   monitor.report();
 */

class RotorMonitor {
	constructor() {
		this.samples = [];
		this.enabled = true;
	}

	sample(rotor, label = '', axis = null) {
		if (!this.enabled) return;

		const [yz, xz, xy, w] = rotor;
		const mag = Math.sqrt(yz ** 2 + xz ** 2 + xy ** 2);
		const theta = 2 * Math.atan2(mag, w);
		
		const components = [Math.abs(yz), Math.abs(xz), Math.abs(xy)];
		const maxComponent = Math.max(...components);
		
		// Classify purity
		let dominantAxis = 'COMPOUND';
		let purity = 0;
		if (mag > 1e-8) {
			if (components[0] === maxComponent) {
				dominantAxis = 'Y-only';
				purity = yz / mag;
			} else if (components[1] === maxComponent) {
				dominantAxis = 'X-only';
				purity = xz / mag;
			} else if (components[2] === maxComponent) {
				dominantAxis = 'Z-only';
				purity = xy / mag;
			}
		}

		this.samples.push({
			timestamp: Date.now(),
			rotor: rotor,
			label: label,
			axis: axis,
			theta: theta * 180 / Math.PI,
			dominantAxis: dominantAxis,
			purity: purity,
			components: [yz, xz, xy],
			isCompound: purity < 0.9
		});
	}

	enable() { this.enabled = true; }
	disable() { this.enabled = false; }
	clear() { this.samples = []; }

	report(options = {}) {
		const {
			verbose = false,
			limit = 10,
			showCompoundOnly = false
		} = options;

		if (this.samples.length === 0) {
			console.log('[RotorMonitor] No samples collected');
			return;
		}

		console.log(`\n${'═'.repeat(70)}`);
		console.log(`[RotorMonitor] ${this.samples.length} samples collected`);
		console.log(`${'═'.repeat(70)}`);

		const samplesToShow = this.samples.slice(-limit);
		let compoundCount = 0;

		samplesToShow.forEach((sample, idx) => {
			if (showCompoundOnly && !sample.isCompound) return;

			const purityPercent = (sample.purity * 100).toFixed(1);
			const type = sample.isCompound ? '✗ COMPOUND' : '✓ PURE';
			const theta = sample.theta.toFixed(2);

			console.log(`\n[${idx + 1}] ${sample.label || '(unlabeled)'}${sample.axis !== null ? ` [axis ${sample.axis}]` : ''}`);
			console.log(`    Type: ${type} | Angle: ${theta}° | Purity: ${purityPercent}%`);
			console.log(`    Rotor: [${sample.rotor.map(x => x.toFixed(4)).join(', ')}]`);
			console.log(`    Components: Y=${sample.components[0].toFixed(4)}, X=${sample.components[1].toFixed(4)}, Z=${sample.components[2].toFixed(4)}`);

			if (verbose) {
				console.log(`    Dominant: ${sample.dominantAxis}`);
			}

			if (sample.isCompound) compoundCount++;
		});

		console.log(`\n${'─'.repeat(70)}`);
		console.log(`Summary: ${compoundCount}/${samplesToShow.length} rotors are COMPOUND`);
		console.log(`${'═'.repeat(70)}\n`);
	}

	getStats() {
		if (this.samples.length === 0) return null;

		const compoundCount = this.samples.filter(s => s.isCompound).length;
		const avgTheta = this.samples.reduce((sum, s) => sum + s.theta, 0) / this.samples.length;
		
		return {
			total: this.samples.length,
			compound: compoundCount,
			pure: this.samples.length - compoundCount,
			compoundPercent: (compoundCount / this.samples.length * 100).toFixed(1),
			avgRotation: avgTheta.toFixed(2)
		};
	}
}

// ============================================================================
// Integration Example for physics.js
// ============================================================================
/*

In physics.js, add this near the top:

	// Create monitor (once, at initialization)
	if (!this._rotorMonitor) {
		this._rotorMonitor = new RotorMonitor();
	}

In the getTt_axis function, after computing dO:

	const dO = this._getDeltaO(O0, O1);
	this._rotorMonitor.sample(dO, `getTt_axis(axis=${axis})`, axis);
	const dR = this._getDeltaR(dO);

At the end of a frame/update cycle, report:

	this._rotorMonitor.report({ limit: 5 });

Or collect silently and report periodically:

	this._rotorMonitor.enable();
	// ... run simulation ...
	console.log('Stats:', this._rotorMonitor.getStats());
	this._rotorMonitor.report({ showCompoundOnly: true });

*/

// ============================================================================
// Command-line usage (for testing)
// ============================================================================

if (require.main === module) {
	const monitor = new RotorMonitor();

	// Pure rotations
	const pure_z = [0, 0, Math.sin(Math.PI / 4 / 2), Math.cos(Math.PI / 4 / 2)];
	const pure_x = [0, Math.sin(Math.PI / 6 / 2), 0, Math.cos(Math.PI / 6 / 2)];
	const pure_y = [Math.sin(Math.PI / 3 / 2), 0, 0, Math.cos(Math.PI / 3 / 2)];

	// Compound rotation
	const compound = [0.3, 0.4, 0.5, 0.7];

	monitor.sample(pure_z, 'Test: Pure Z heading');
	monitor.sample(pure_x, 'Test: Pure X roll');
	monitor.sample(pure_y, 'Test: Pure Y pitch');
	monitor.sample(compound, 'Test: Compound multi-axis');

	monitor.report({ verbose: true });
	console.log('Stats:', monitor.getStats());
}

module.exports = { RotorMonitor };
