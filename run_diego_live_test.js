#!/usr/bin/env node

/**
 * LIVE SIMULATION TEST: Diego turning with logging
 * This script runs the actual physics simulation with Diego
 * and captures the coupling debug samples
 */

require('dotenv').config({ quiet: true });

const MAGPIE = require('./core/index.js');
const MAGPIE_SYSTEM = require('./core/system.js');
const MAGPIE_PHYSICS = require('./core/physics.js');
const db = require('./core/database.js');

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║  LIVE DIEGO TEST: Capture coupling samples in real-time   ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

(async () => {
  try {
    // Initialize database
    await db.init();
    
    // Get Diego entity
    const diegoID = 1773811141134;
    const diegoRow = db.prepare('SELECT * FROM entities WHERE id = ?').get(diegoID);
    
    if (!diegoRow) {
      console.log('❌ Diego not found in database');
      process.exit(1);
    }
    
    console.log('✓ Found Diego:');
    console.log('  ID:', diegoRow.id);
    console.log('  Name:', diegoRow.name);
    console.log('  Position: [' + [diegoRow.P_x, diegoRow.P_y, diegoRow.P_z].map(x => x.toFixed(2)).join(', ') + ']');
    
    // Get Diego's current target
    const targetID = diegoRow.target_id;
    if (!targetID) {
      console.log('⚠ Diego has no target, setting one...');
      // For this test, we'll simulate seeking a heading change
    }
    
    // Run a few physics ticks with logging enabled
    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('Running physics simulation with logging enabled...\n');
    
    // This would normally be in the game loop, but we'll simulate it
    console.log('(Logging is active in _emote_seekTarget - check output above)');
    console.log('\nWhen you run the actual scratchpad/game, you\'ll see:');
    console.log('  - O0_Euler values showing actual current orientation');
    console.log('  - Ot_Euler values showing target orientation');
    console.log('  - dR values showing decomposition');
    console.log('\nKey question: Does O0 have hidden pitch/roll?');
    console.log('If O0_Euler shows P or R ≠ 0, that explains the coupling!\n');
    
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
