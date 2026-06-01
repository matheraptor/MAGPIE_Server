/**
 * Rotor Composition Diagnostic
 * 
 * Helps identify whether a given rotor represents a pure single-axis rotation
 * or a compound multi-axis rotation.
 */

// Geometric algebra utilities
const mag = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

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
	
	// Dominance threshold: if one axis is > 0.95 of the magnitude, it's "pure"
	const purityThreshold = 0.95;
	const isPure = maxAxis > purityThreshold;
	
	// Identify dominant axis
	let dominantAxis = 'COUPLED';
	if (absAxis[0] === maxAxis) dominantAxis = 'Y (yz)';
	else if (absAxis[1] === maxAxis) dominantAxis = 'X (xz)';
	else if (absAxis[2] === maxAxis) dominantAxis = 'Z (xy)';
	
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
	console.log(`\n${'='.repeat(60)}`);
	console.log(`${label}`);
	console.log(`${'='.repeat(60)}`);
	
	console.log(`Input rotor: [${rotor.map(x => x.toFixed(6)).join(', ')}]`);
	
	const { angle, axis, dominantAxis, purity, isPure, classification } = classifyRotor(rotor);
	
	console.log(`\nRotation Analysis:`);
	console.log(`  Angle: ${(angle * 180 / Math.PI).toFixed(2)}°`);
	console.log(`  Axis: [${axis.map(x => x.toFixed(4)).join(', ')}]`);
	console.log(`  Dominant axis: ${dominantAxis}`);
	console.log(`  Axis purity: ${(purity * 100).toFixed(1)}%`);
	console.log(`  Classification: ${classification}`);
	
	if (isPure) {
		console.log(`\n✓ This is a PURE rotation. The other axes should show ~0 in bivector decomposition.`);
	} else {
		console.log(`\n✗ This is a COMPOUND rotation combining multiple axes.`);
		console.log(`  Each bivector component will be non-zero when decomposed.`);
		console.log(`  This is NOT a bug—it's mathematically correct.`);
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
	
	console.log(`\nBivector decomposition (dR):`);
	console.log(`  dR = [${dR.map(x => x.toFixed(6)).join(', ')}]`);
	console.log(`  Y-component (yz): ${dR[0].toFixed(6)} ${Math.abs(dR[0]) > 0.01 ? '← non-zero' : ''}`);
	console.log(`  X-component (xz): ${dR[1].toFixed(6)} ${Math.abs(dR[1]) > 0.01 ? '← non-zero' : ''}`);
	console.log(`  Z-component (xy): ${dR[2].toFixed(6)} ${Math.abs(dR[2]) > 0.01 ? '← non-zero' : ''}`);
	
	return { rotor, classification, dR, angle, axis };
};

// ============================================================================
// Example Cases
// ============================================================================

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║           ROTOR COMPOSITION DIAGNOSTIC TOOL                ║');
console.log('╚════════════════════════════════════════════════════════════╝');

// Case 1: Pure Z rotation (heading change only)
const pure_z = [
	0,
	0,
	Math.sin(Math.PI / 6 / 2),
	Math.cos(Math.PI / 6 / 2)
];
analyzeRotor(pure_z, 'CASE 1: Pure Z Rotation (Heading Only)');

// Case 2: Pure X rotation (roll change only)
const pure_x = [
	0,
	Math.sin(Math.PI / 4 / 2),
	0,
	Math.cos(Math.PI / 4 / 2)
];
analyzeRotor(pure_x, 'CASE 2: Pure X Rotation (Roll Only)');

// Case 3: Pure Y rotation (pitch change only)
const pure_y = [
	Math.sin(Math.PI / 3 / 2),
	0,
	0,
	Math.cos(Math.PI / 3 / 2)
];
analyzeRotor(pure_y, 'CASE 3: Pure Y Rotation (Pitch Only)');

// Case 4: Compound rotation (what you probably have)
// This represents a rotation that combines multiple axes
const compound = [
	Math.sin(Math.PI / 6 / 2) * Math.cos(Math.PI / 4 / 2),  // yz contribution
	Math.sin(Math.PI / 4 / 2) * Math.cos(Math.PI / 6 / 2),  // xz contribution
	Math.sin(Math.PI / 6 / 2) * Math.sin(Math.PI / 4 / 2),  // xy contribution
	Math.cos(Math.PI / 6 / 2) * Math.cos(Math.PI / 4 / 2)   // w component
];
analyzeRotor(compound, 'CASE 4: Compound Rotation (Multiple Axes)');

// Case 5: Nearly-pure with small coupling
const nearlyPure = [
	0.01,  // Small Y component (noise or coupling)
	0,
	Math.sin(Math.PI / 6 / 2),  // Dominant Z component
	Math.cos(Math.PI / 6 / 2)
];
analyzeRotor(nearlyPure, 'CASE 5: Nearly-Pure Z with Noise');

console.log(`\n${'='.repeat(60)}`);
console.log(`\nDIAGNOSTIC INTERPRETATION:`);
console.log(`${'='.repeat(60)}`);
console.log(`
If you're seeing "all axes changing when I only changed heading":

1. Check if your rotor is COMPOUND or PURE
   - PURE: Problem is elsewhere (getTtAxis implementation)
   - COMPOUND: Your O0→O1 naturally couples the axes (expected behavior)

2. If COMPOUND, consider:
   - Option A: Extract Euler angles instead of bivector components
   - Option B: Design getTtAxis to work with compound rotations
   - Option C: Add rotor decoupling pre-processing

3. Use this tool to monitor rotor composition in real-time:
   - Log O0, O1, and deltaO during simulation
   - Check if deltaO is accidentally COMPOUND when it should be PURE
`);
console.log(`${'='.repeat(60)}\n`);
