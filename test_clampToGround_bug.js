#!/usr/bin/env node

/**
 * TEST: Verify _geod_clampToGround bug
 * Check if Og returned is the clamped orientation or the unclamped O0
 */

// Read the source to analyze the bug directly
const fs = require('fs');
const path = require('path');

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║  BUG VERIFICATION: _geod_clampToGround Return Value       ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Read physics.js and find _geod_clampToGround
const physicsFile = fs.readFileSync(path.join(__dirname, 'core', 'physics.js'), 'utf8');
const clampMatch = physicsFile.match(/MAGPIE_PHYSICS\._geod_clampToGround = function[\s\S]*?return \{ clamped: true[^}]*\};/);

if (!clampMatch) {
  console.log('Could not find _geod_clampToGround function');
  process.exit(1);
}

const clampCode = clampMatch[0];
const lines = clampCode.split('\n');

console.log('FUNCTION CODE (relevant section):');
console.log('─────────────────────────────────\n');

// Show the last few lines which contain the return statement
lines.slice(-10).forEach((line, idx) => {
  console.log(line);
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('BUG ANALYSIS:');
console.log('═══════════════════════════════════════════════════════\n');

// Check for the bug
if (clampCode.includes('return { clamped: true, Pg, Vg: Vv, Og: O0 }')) {
  console.log('✗ BUG FOUND!\n');
  console.log('The return statement is:');
  console.log('  return { clamped: true, Pg, Vg: Vv, Og: O0 };');
  console.log('                                       ↑ This is WRONG');
  console.log('\nWhat\'s happening:');
  console.log('  1. Function creates clamped orientation: const Og = this._rotor_fromEulerAbs(hdg, 0, 0, Pg)');
  console.log('  2. This clamped Og sets pitch/roll to 0');
  console.log('  3. But then returns Og: O0 (the ORIGINAL unclamped value!)');
  console.log('\nResult in entity.js:');
  console.log('  O0 = floor.Og;  // Gets the unclamped O0, not the clamped Og!');
  console.log('\nFix required:');
  console.log('  return { clamped: true, Pg, Vg: Vv, Og: Og };');
  console.log('                                       ↑ Use the clamped value\n');
  console.log('This is why Diego has hidden pitch/roll in O0!');
  console.log('The clamping was created but never used.');
} else if (clampCode.includes('return { clamped: true, Pg, Vg: Vv, Og: Og }')) {
  console.log('✓ CORRECT: Og is the clamped orientation');
  console.log('\nThe return statement properly returns the clamped Og.');
  console.log('No bug found.\n');
} else {
  console.log('? Could not determine return value\n');
  console.log('Return line:', clampCode.match(/return \{[^}]*\}/)[0]);
}

console.log('═══════════════════════════════════════════════════════\n');
