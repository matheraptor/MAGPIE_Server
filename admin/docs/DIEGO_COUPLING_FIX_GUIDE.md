---
type: Implementation Guide
project: MAGPIE Physics System
fix: Diego coupling root cause resolution
status: Ready to Implement
---

# Diego Coupling Fix - Implementation Guide

## Recommended Fix: Option A (Extract Euler Angles)

Why this option:

- ✓ Cleanest separation of concerns
- ✓ Each axis controlled independently
- ✓ Easiest to debug and verify
- ✓ Most intuitive for single-axis torque control

---

## Step 1: Add Helper Function

In `core/physics.js`, add this after the existing rotor helper functions (around line 100):

```javascript
/**
 * Convert rotor [yz, xz, xy, w] to Euler angles [roll, pitch, heading] in radians
 * @param {Array} rotor - [yz, xz, xy, w]
 * @returns {Array} [roll_rad, pitch_rad, heading_rad]
 */
_rotor_toEulerRadians(rotor) {
  const [yz, xz, xy, w] = rotor;
  
  // Roll (X-axis rotation)
  const roll = Math.atan2(2*(w*xz + yz*xy), 1 - 2*(xz**2 + yz**2));
  
  // Pitch (Y-axis rotation) - clamp to [-π/2, π/2]
  const pitch = Math.asin(Math.max(-1, Math.min(1, 2*(w*yz - xy*xz))));
  
  // Heading (Z-axis rotation)
  const heading = Math.atan2(2*(w*xy + yz*xz), 1 - 2*(xy**2 + yz**2));
  
  return [roll, pitch, heading];
}
```

---

## Step 2: Refactor _emote_seekTarget

Find the section where `dR` is computed (around line 760-780):

**BEFORE:**

```javascript
const dO = Ot.map((x, i) => /* Ot * O0^-1 computation */);
const dR = this._getDeltaR(dO);
const tTarget = this._getTt(dR, R0, O0, { surface: options?.surface });
return { acceleration: pTarget, torque: tTarget };
```

**AFTER:**

```javascript
// Compute delta orientation rotor
const dO = Ot.map((x, i) => /* Ot * O0^-1 computation */);

// Convert to Euler angles (independent axes)
const dEuler_rad = this._rotor_toEulerRadians(dO);
const dEuler_deg = dEuler_rad.map(x => x * 180 / Math.PI);

// Compute torque for each axis independently
const torque = [
  this._getTtAxis(dEuler_rad[0], R0[0], O0, 0, { surface: options?.surface }),  // Roll
  this._getTtAxis(dEuler_rad[1], R0[1], O0, 1, { surface: options?.surface }),  // Pitch
  this._getTtAxis(dEuler_rad[2], R0[2], O0, 2, { surface: options?.surface })   // Heading
];

return { acceleration: pTarget, torque: torque };
```

---

## Step 3: Update _getTtAxis Signature (if needed)

Current `_getTtAxis()` expects bivector components. Update it to handle Euler delta:

**BEFORE:**

```javascript
_getTtAxis(dR_component, R0_value, O0, axis) {
  // dR_component is [yz], [xz], or [xy] from bivector
  // ...
}
```

**AFTER:**

```javascript
_getTtAxis(dEuler_delta_rad, R0_value, O0, axis, options) {
  // dEuler_delta_rad is angle change in radians (pure single value)
  const dt = 0.016; // tick duration (adjust if different)
  const angularRate = dEuler_delta_rad / dt;  // rad/s
  
  // Compute torque to reach target angular rate
  // ... existing getTtAxis logic, but now working with pure single-axis ...
}
```

---

## Step 4: Add Live Logging (for Verification)

In `_emote_seekTarget`, after computing dEuler:

```javascript
// DEBUG: Verify axis decomposition
if (this.id === 1773811141134) {  // Diego's ID
  if (typeof DIEGO_FINAL_TEST === 'undefined') {
    DIEGO_FINAL_TEST = { samples: 0 };
  }
  
  if (DIEGO_FINAL_TEST.samples < 20) {
    console.log(`[Diego] dEuler = [roll: ${dEuler_deg[0].toFixed(2)}°, pitch: ${dEuler_deg[1].toFixed(2)}°, head: ${dEuler_deg[2].toFixed(2)}°]`);
    console.log(`[Diego] torque = [${torque.map(x => x.toFixed(4)).join(', ')}]`);
    DIEGO_FINAL_TEST.samples++;
  }
}
```

---

## Step 5: Testing Checklist

After implementing the fix:

- [ ] Diego seeks heading correctly (head torque dominates, roll/pitch ≈ 0)
- [ ] Surface constraint still works (pitch/roll stay clamped when surface=true)
- [ ] Other entities don't show new issues (spot-check 3+ entities)
- [ ] Performance is unchanged (run benchmark)
- [ ] Live logging shows single-axis dominance in dEuler

---

## Verification Commands

Run these after implementation:

```bash
# 1. Verify physics.js compiles with new function
node -c core/physics.js

# 2. Run existing tests (if any)
npm test

# 3. Load scratchpad and test Diego seeking
node
> const scratchpad = require('./plugins/scratchpad.js');
> const PHYSICS = require('./core/physics.js');
> // Load Diego and set up target...
> // Seek and observe console logging
```

---

## Fallback: Option B (If Option A Breaks Existing Code)

If Option A causes regressions in other entities, fall back to Option B (weighted bivectors):

```javascript
// In _getTtAxis, handle compound bivectors
const dR_magnitude = Math.sqrt(dR[0]**2 + dR[1]**2 + dR[2]**2);
if (dR_magnitude > 0.001) {
  const axis_weight = Math.abs(dR[axis]) / dR_magnitude;
  return base_torque * axis_weight * (dR[axis] > 0 ? 1 : -1);
} else {
  return 0;  // No rotation needed
}
```

This keeps the existing pipeline but adds proportional weighting.

---

## If Neither Works: Debug Path

If both options don't resolve the issue:

1. **Verify logging is capturing real data**
   - Add console.log of O0, Ot BEFORE and AFTER surface clamping
   - Confirm values match expectations

2. **Check if dR is pre-processed elsewhere**
   - Search for all calls to `_getTtAxis()`
   - Check if dR is modified between `_getDeltaR()` and `_getTtAxis()`

3. **Verify surface clamping order**
   - Is O0 clamped, Ot clamped, or both?
   - Check `_geod_clampToGround()` is being called in right order

4. **Consider physics.js is not the source**
   - Check if torque is modified in `entityHandler.js` or `player.js`
   - Trace getTt output to actual applied torque

---

## Questions?

Refer to `DIEGO_COUPLING_DIAGNOSTIC_REPORT.md` for:

- Full technical analysis
- Why each solution works
- Test results showing root cause

---

*Implementation guide for Diego coupling fix*  
*Based on diagnostic tests executed 2025-01-15*
