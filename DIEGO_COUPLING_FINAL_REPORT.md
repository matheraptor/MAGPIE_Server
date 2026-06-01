---
status: Complete
type: Diagnosis Report
date: 2026-06-01
entity: Diego Marea (ID 1773811141134)
---

# Diego Coupling Analysis — Final Report

## Executive Summary

You're observing **real coupling in dR**, but **`_getDeltaR` is not the problem**.

The coupling comes from **how the rotor delta is computed**, specifically from the difference between O0 (current orientation) and Ot (target orientation).

---

## What You're Seeing

**Diego's Current Observation:**

```markdown
Pitch: 0.1°
Roll: -0.0°  
Heading: 55.6°
Target: WP-249-28 (595km away)

dR: [+0.00318, -0.00587, -0.00024] rad
     ↑          ↑          ↑
  Pitch       Roll      Heading
  active      DOMINANT   tiny
```

**Expected:**

- Heading should dominate (she's trying to reach a far target)
- Pitch/Roll should be quiet (she's maintaining level flight)

**Actual:**

- Roll is dominating
- Heading is nearly zero

---

## Root Cause Investigation

### Step 1: Is `_getDeltaR` wrong?

**Result: NO** ✓

- Verified with 6 mathematical test cases
- Pure rotations → Pure output (zero cross-talk)
- Math is correct

### Step 2: Is the rotor from seekTarget compound?

**Result: UNKNOWN** — Depends on O0 and Ot values

- If O0 has pitch/roll and Ot is clamped differently, coupling is expected
- We tested scenarios but **observed dR doesn't match any simple scenario**
- This suggests O0 or Ot is different than expected

### Step 3: What would cause the observed dR?

**Possible causes:**

1. **O0 has hidden pitch/roll** — Display shows "0.0°" but actual rotor has non-zero components
2. **Ot is not surface-clamped** — It's being constructed differently than expected
3. **Post-processing** — Something in getTt or between _emote_seekTarget and getTtAxis modifies dR
4. **Heading is very small** — Meaning target is almost straight ahead, so pitch/roll corrections dominate

---

## Diagnostic Tools You Now Have

| File                                | Purpose                                           |
|-------------------------------------|---------------------------------------------------|
| `debug_getDeltaR.js`                | Verify getDeltaR math (already confirmed correct) |
| `rotor_diagnostic.js`               | Classify pure vs compound rotors                  |
| `test_scratchpad_rotor.js`          | Test scratchpad line 83 (already confirmed pure)  |
| `test_diego_coupling.js`            | Test coupling with Diego's values                 |
| `test_diego_reverse_engineering.js` | Try scenarios to match observed dR                |
| `test_diego_final_diagnosis.js`     | Extended scenario search (best error: 0.008)      |
| `DIEGO_DIAGNOSTIC_LOGGER.js`        | **[NEXT]** Logging template for physics.js        |

---

## Your Next Action: Capture Real Data

### Step 1: Add Logging to `physics.js`

In `_emote_seekTarget`, after `const dR = this._getDeltaR(dO);`, add this block:

```javascript
// ============= DIAGNOSTIC LOGGING START =============
if (typeof DIEGO_COUPLING_DEBUG === 'undefined') {
  DIEGO_COUPLING_DEBUG = { samples: [], maxSamples: 100 };
}

const sample = {
  timestamp: Date.now(),
  O0: O0,
  Ot: Ot,
  dO: dO,
  dR: dR,
  dR_mag: this.mag(dR)
};

DIEGO_COUPLING_DEBUG.samples.push(sample);

// Log every 10 calls
if (DIEGO_COUPLING_DEBUG.samples.length % 10 === 1) {
  const s = sample;
  console.log('[DIEGO_COUPLING] Sample #' + DIEGO_COUPLING_DEBUG.samples.length);
  console.log('  O0: [' + s.O0.map(x => x.toFixed(6)).join(', ') + ']');
  console.log('  Ot: [' + s.Ot.map(x => x.toFixed(6)).join(', ') + ']');
  console.log('  dR: [' + s.dR.map(x => x.toFixed(6)).join(', ') + ']');
}
// ============= DIAGNOSTIC LOGGING END =============
```

### Step 2: Run Your Test

Execute your scratchpad with Diego seeking the target:

```javascript
diego._emote_seekTarget(exp, fitness_index)
```

Diego will log 10+ samples to console every few iterations.

### Step 3: Inspect the Rotors

Look at the logged O0 and Ot values:

- **Check 1:** Is O0 what you expect (pitch≈0.1°, roll≈0°)?
- **Check 2:** Is Ot surface-clamped (pitch≈0°, roll≈0°)?
- **Check 3:** Is the heading difference large or tiny?

### Step 4: Send Me the Data

Once you have 3-5 logged samples, copy them here and we can:

- Reverse-engineer the exact O0/Ot that produces your dR
- Identify why pitch/roll are coupling
- Determine if it's a bug or expected behavior

---

## What the Data Will Tell Us

### If O0 and Ot match expectations

- Problem is in getDeltaR implementation (but we've ruled this out)
- OR problem is in getTt post-processing

### If O0 or Ot are unexpected

- That's the root cause
- We'll know exactly how to fix it

### If Ot is not surface-clamped

- Fix: Apply surface constraint before computing dO
- This would prevent pitch/roll coupling from O0

---

## Three Possible Solutions (to consider after we have data)

### Solution 1: Clamp O0 First (Preventive)

```javascript
// Before computing dO, clamp O0 to heading-only for surface movement
const O0_hdg = this._rotor_toHeadingAbs(O0, P0);
const O0_clamped = this._rotor_fromEulerAbs(O0_hdg, 0, 0, P0);

// Now delta only includes heading change
const dO = this._getDeltaO(O0_clamped, Ot);
```

### Solution 2: Extract Euler Before Processing

```javascript
// Instead of bivector, work with Euler angles
const [roll, pitch, heading] = rotorToEuler(dO);
// Process each axis independently, avoiding coupling
```

### Solution 3: Accept Compound Bivector

```javascript
// If coupling is expected, design getTt to handle it
// Process full [y,x,z] bivector, not components
```

---

## Summary Table

| Aspect                      | Status    | Certainty |
|-----------------------------|-----------|-----------|
| `_getDeltaR` math correct?  | ✓ YES     | 100%      |
| Coupling from `_getDeltaR`? | ✗ NO      | 100%      |
| Root cause identified?      | ✗ NOT YET | 0%        |
| Need more data?             | ✓ YES     | 100%      |

---

## Files You Should Keep

```markdown
MAGPIE_Server/
├── ANALYSIS_getDeltaR.md           (Technical reference)
├── QUICK_REF.md                    (Quick diagnosis guide)
├── DIEGO_DIAGNOSTIC_LOGGER.js      (⭐ Use this for logging)
├── debug_getDeltaR.js              (Math verification)
├── rotor_diagnostic.js             (Rotor classifier)
├── test_diego_coupling.js          (Scenario testing)
└── [add DIEGO_COUPLING_DEBUG log samples here for analysis]
```

---

## Next Steps

1. **Today:** Add logging to physics.js (5 min)
2. **Today:** Run test, collect 10+ samples (5 min)
3. **Next:** Share logged O0/Ot/dR values
4. **Next:** We'll identify exact root cause
5. **Next:** Apply targeted fix

The mystery is solvable—we just need the real data from the pipeline.
