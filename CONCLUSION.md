---
status: Complete
type: Debug Conclusion
date: 2026-06-01
---

# _getDeltaR Debug — Conclusion & Action Items

## TL;DR

**`_getDeltaR` is working correctly.** The mathematical issue you suspected
doesn't exist.

Your observation (other rotation axes change when correcting one) is
**real but expected**. It's caused by **compound rotors**, not a bug
in bivector decomposition.

---

## What We Verified

### ✓ Confirmed: `_getDeltaR` Produces Pure Outputs for Pure Inputs

| Input Rotor   | Output         | Status    |
|:--------------|:---------------|:----------|
| Pure Z (45°)  | [0, 0, 0.785]  | ✓ Perfect |
| Pure X (30°)  | [0, 0.524, 0]  | ✓ Perfect |
| Pure Y (60°)  | [1.047, 0, 0]  | ✓ Perfect |
| Tiny rotation | Error < 0.001% | ✓ Perfect |

**Conclusion:** If your input is a pure single-axis rotation, output will be pure
single-axis. **Zero cross-talk.**

### ✓ Confirmed: Compound Rotations Show Coupled Bivector Components

When a rotor represents a multi-axis rotation (which is common in 3D), all bivector components become non-zero. This is **mathematically correct**, not a bug.

---

## Why Your Observation Happens

### The Scenario

When you correct one axis (e.g., heading), you're computing:

```javascript
O1 = targetOrientation;
O0 = currentOrientation;
deltaO = O1 * O0_inv;
dR = getDeltaR(deltaO);
```

If **both** O0 and O1 are complex orientations (roll ≠ 0, pitch ≠ 0, heading ≠ target), then `deltaO` is not a pure heading change—it's a single 3D rotation that affects multiple axes simultaneously.

### Why This Matters

A rotor encodes **one 3D rotation**. When decomposed to bivector form [yz, xz, xy]:

- These are the three components of ONE rotation vector
- They're coupled by geometry, not a bug
- Processing them independently in `getTtAxis` assumes they're independent (they're not)

---

## Diagnostic Tools Provided

Four tools to help you troubleshoot further:

### 1. `debug_getDeltaR.js` — Verify Math

```bash
node debug_getDeltaR.js
```

**When to use:** Confirm that `_getDeltaR` itself is correct (already done)

### 2. `rotor_diagnostic.js` — Classify Any Rotor  

```bash
node rotor_diagnostic.js
```

**When to use:** Check if a specific rotor is PURE or COMPOUND

### 3. `RotorMonitor.js` — Real-Time Monitoring

Add to physics.js to track rotor composition during simulation:

```javascript
this._rotorMonitor = new RotorMonitor();
this._rotorMonitor.sample(dO, `getTt_axis(axis=${axis})`);
this._rotorMonitor.report();
```

**When to use:** Monitor what's actually happening in your simulation

### 4. `ANALYSIS_getDeltaR.md` — Full Technical Report

Complete mathematical analysis with test results and recommendations.

---

## Your Next Action: Determine the Root Cause

### Question: Is Your Problem Rotor PURE or COMPOUND?

**If PURE:**

- Your rotor should only affect one axis
- Problem is elsewhere (likely in `getTtAxis` state machine)
- Review the HOLD/FACE/DRIFT/ALIGNING logic

**If COMPOUND:**

- Your O0→O1 naturally couples axes
- Expected behavior for many scenarios
- Choose a solution below

---

## Solutions by Root Cause

### Solution 1: Extract Euler Angles

If you need axis-independent control, convert rotor → Euler angles first:

```javascript
// Instead of bivector components
const euler = rotorToEuler(deltaO);  // [roll, pitch, heading]
const Tt_roll = getTtAxis(euler[0], R0[0], options, 0);
const Tt_pitch = getTtAxis(euler[1], R0[1], options, 1);
const Tt_heading = getTtAxis(euler[2], R0[2], options, 2);
```

**Pros:** True axis independence  
**Cons:** Requires rotor-to-Euler conversion (can have singularities)

### Solution 2: Accept Compound Bivectors

Design `getTtAxis` to work with coupled bivectors:

```javascript
// Process full bivector, not per-component
const Tt_vector = computeTorqueFromBivector(dR, R0, options);
// dR stays as [yz, xz, xy], not decomposed
```

**Pros:** Simpler, mathematically pure  
**Cons:** Changes your control loop architecture

### Solution 3: Decouple Pre-Processing

Add a layer that decomposes compound rotors into sequential single-axis rotations:

```javascript
const [euler_angles] = rotorToEuler(deltaO);
// Now process each axis independently with getTtAxis
```

**Pros:** Keeps axis-independent semantics  
**Cons:** Adds computational step

### Solution 4: Verify O0/O1 Generation

Check if your orientations are accidentally COMPOUND when they should be PURE:

```javascript
// Use rotor_diagnostic to check O0 and O1 separately
const O0_analysis = classifyRotor(O0);
const O1_analysis = classifyRotor(O1);
const deltaO_analysis = classifyRotor(deltaO);

if (O1_analysis.isPure && O0_analysis.isPure && !deltaO_analysis.isPure) {
    console.error('Unexpected compound rotor from pure inputs!');
}
```

---

## How to Proceed

### Step 1: Capture Real Data (15 min)

Add logging to physics.js:

```javascript
const dO = this._getDeltaO(O0, O1);
console.log('dO:', dO);
// Import RotorMonitor at top
this._rotorMonitor?.sample(dO, `getTt_axis(axis=${axis})`);
```

Run your simulation and capture the dO values.

### Step 2: Diagnose (5 min)

Use `rotor_diagnostic.js` to classify each dO:

- PURE? → Problem is in `getTtAxis` logic
- COMPOUND? → Problem is likely expected behavior or O0/O1 construction

### Step 3: Choose Solution (depends on your needs)

Pick one of the four solutions above based on your findings.

---

## Summary Deliverables

You now have:

| File | Purpose |
| :--- | :--- |
| `debug_getDeltaR.js` | Mathematical verification (confirms `_getDeltaR` is correct) |
| `rotor_diagnostic.js` | Rotor classifier tool |
| `RotorMonitor.js` | Real-time monitoring utility |
| `ANALYSIS_getDeltaR.md` | Full technical report |
| `DEBUG_SUMMARY.md` | Quick reference guide |

All tools are self-contained and can be run independently.

---

## Key Insight for Future Reference

When debugging rotation systems:

1. **Verify the math first** (done ✓)
2. **Classify inputs** (PURE vs COMPOUND)
3. **Match solution to classification**

A bivector with all three components non-zero isn't a bug—it's geometry. The question is: *did I want that geometry, or did I create it by accident?*
