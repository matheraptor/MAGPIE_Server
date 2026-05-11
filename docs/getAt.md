# MAGPIE_Server Physics Seeking Behavior Refactor

## Problem Statement

Entity was moving AWAY from target instead of toward it when using the `_seekTarget` emote. The new implementation failed to replicate the working behavior from v0.18's `_move_linearTo`.

## Root Cause Analysis

Compared old `_move_linearTo` (v0.18) with new `_getAt` implementation:

### Old Implementation (WORKED)

- **Three-phase logic**: Arrival → Braking → Transit
- **Arrival phase** (D0 ≤ toler): Called `getBrakingA(P0, P1, V0, 0)` for intelligent deceleration
- **Braking phase** (D0 ≤ Bdist + toler): Called `getBrakingA(P0, P1, V0, toler)` to decelerate while steering toward target
- **Transit phase** (D0 > Bdist + toler): Accelerated to cruise velocity in target direction

### New Implementation (BROKEN)

- Had three-phase structure but arrival case was **WRONG**:
  
  ```javascript
  // BAD: negates current velocity regardless of target direction
  const scalar = this.scaleVector(V0, -1);
  const At = this.vector_clamp_mag(scalar, Bmax);
  ```

- Didn't use `getBrakingA()` at all
- Result: Entity decelerated in wrong direction, insufficient At (0.018 m/s²) to overcome momentum

### Additional Bug in `_seekTarget` wrapper

- Signature: `_seekTarget(P0, P1, params, options)`
- Code tries to use undefined `POVART0` parameter
- Looks like incomplete refactoring

## Solution Proposed

Replace `_getAt` in `core/physics.js` (lines 787-834) with modular version that:

1. **Restores braking logic** from old `_move_linearTo`
   - Uses `getBrakingA(P0, P1, V0, stopDistance)` for intelligent deceleration
   - Maintains three-phase approach: Arrival → Braking → Transit

2. **Adds options-based fine-tuning**
   - `enableBraking` (default: true) — use smart braking phases
   - `dumb` (default: false) — skip distance logic, just accelerate (for less intelligent entities)
   - `tolerance` (default: 0.5m) — arrival threshold
   - `brakingThreshold` — override braking distance calculation
   - `brakingHook` — callback when entering braking phase

3. **Supports waypoint chaining**
   - Hook fires before braking phase starts: perfect for "switch to next waypoint" logic
   - Entity remains in seek state, switches target automatically

## Code Changes Required

**File**: `c:\Users\Marika\matheraptor\projects\MAGPIE_Server\core\physics.js`  
**Lines**: 787-834 (entire `_getAt` function)

Replace with the suggested implementation that:

- Validates inputs (same as before)
- Extracts options with defaults
- Routes to DUMB mode or SMART mode
- SMART mode: 3-phase logic with `getBrakingA()` calls
- Returns: `{ At, arrived, proximity, braking }`

## Architecture

- **Baseline**: `_getAt` is the core smart-seeking calculator
- **Wrapper**: `_seekTarget` calls `_getAt`, adds rotation/torque logic, blends with options
- **Entity interface**: `_emote_seekTarget` in entity.js calls `_seekTarget`
- **Fine-tuning**: Options cascade down through wrappers

## Next Steps

1. Update `_getAt` in physics.js with provided implementation
2. Test basic seeking behavior (entity should move toward target)
3. Verify braking works (entity decelerates when approaching)
4. Test arrival behavior (entity stops within tolerance)
5. Implement brakingHook for waypoint chaining
6. Test dumb mode for less intelligent entities

## Files Involved

- `c:\Users\Marika\matheraptor\projects\MAGPIE_Server\core\physics.js` — `_getAt` function (needs update)
- `c:\Users\Marika\MAGPIE_Server\SERVER_0_19_3.js` — reference implementation of old `_move_linearTo` (lines 4165-4196)
- `c:\Users\Marika\MAGPIE_Server\core\system.js` — newer version of `_getAt` with same issues (for reference)

## Key Insight

The refactoring isn't fundamentally broken—it's just incomplete. The braking logic and arrival case were removed for testing, but the rest of the three-phase architecture is sound. Restoring `getBrakingA` calls and fixing the arrival case fixes everything.
