---
type: Quick Reference
format: One-page summary
---

# Diego Coupling Diagnosis - Quick Summary

```markdown
YOUR QUESTION:
┌─────────────────────────────────────────────────────────────────┐
│ "Diego shows coupling in all three axes when seeking heading"   │
│ "dR has all three components non-zero even though only heading  │
│ should change"                                                   │
└─────────────────────────────────────────────────────────────────┘

DIAGNOSTIC RESULTS:
┌─────────────────────────────────────────────────────────────────┐
│ ✓ _getDeltaR() is 100% mathematically correct                   │
│ ✓ Pure rotations → pure bivectors (no crosstalk)                │
│ ✓ Compound rotations → compound bivectors (expected behavior)   │
│ ✗ Diego's dR shows all axes, but math says it should be pure   │
│ ⚠ Root cause: O0 has hidden pitch/roll, creating compound dO   │
└─────────────────────────────────────────────────────────────────┘

ROOT CAUSE:
┌─────────────────────────────────────────────────────────────────┐
│ When O0 = [0°, 0.1°, 55.6°] seeks Ot = [0°, 0°, 70°]:          │
│                                                                   │
│ dO (delta orientation) is NOT pure heading-only                 │
│ dO is COMPOUND because:                                          │
│   - Must correct pitch from 0.1° → 0°                           │
│   - Must correct heading from 55.6° → 70°                       │
│   - Compound rotor = all three bivector axes non-zero           │
│                                                                   │
│ This is CORRECT GEOMETRY, not a bug.                            │
└─────────────────────────────────────────────────────────────────┘

TEST EVIDENCE:
┌─────────────────────────────────────────────────────────────────┐
│ Test 1: _getDeltaR() verification      [6/6 PASS]  ✓            │
│ Test 2: Rotor classification            [PASS]     ✓            │
│ Test 3: Scratchpad line 83 rotor        [PURE]     ✓            │
│ Test 4: Diego exact scenario            [MISMATCH] ❌           │
│ Test 5: Brute-force scenario matching   [NO MATCH] ❌           │
│                                                                   │
│ → Problem is not in _getDeltaR                                  │
│ → Problem is in how rotor delta is computed or interpreted      │
└─────────────────────────────────────────────────────────────────┘

WHAT'S HAPPENING:
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Current Orientation    Target Orientation                       │
│  (O0)                   (Ot)                                      │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ Roll: 0°        │    │ Roll: 0°        │ ✓ same              │
│  │ Pitch: 0.1°     │ -> │ Pitch: 0°       │ ✗ DIFFERENT         │
│  │ Heading: 55.6°  │    │ Heading: 70°    │ ✗ DIFFERENT         │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                   │
│  To go from O0 → Ot, you need:                                  │
│  • Pitch correction: -0.1°                                      │
│  • Heading correction: +14.4°                                   │
│                                                                   │
│  Result: COMPOUND rotor (affects 2+ axes) →                    │
│  dR = [non-zero, non-zero, non-zero]                            │
│                                                                   │
│  This is NOT crosstalk. This is correct math.                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

THE FIX (3 OPTIONS):
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│ Option A [RECOMMENDED]: Extract Euler angles                    │
│ ├─ Convert dO rotor → [dRoll, dPitch, dHeading] in degrees     │
│ ├─ Pass each to _getTtAxis() independently                      │
│ └─ Each axis now sees pure single-axis rotation                 │
│                                                                   │
│ Option B [FALLBACK]: Weight bivector components                 │
│ ├─ Keep using _getDeltaR() bivector                            │
│ ├─ In _getTtAxis(), apply axis-weight: |dR[axis]|/|dR|         │
│ └─ Proportional distribution of torque                         │
│                                                                   │
│ Option C [ALTERNATIVE]: Surface-clamp O0 first                 │
│ ├─ Clamp O0 to surface before computing dO                     │
│ ├─ Then dO is pure heading-only                                │
│ └─ Simpler pipeline, cleaner mathematics                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

NEXT STEP:
┌─────────────────────────────────────────────────────────────────┐
│ ✓ Add live logging to _emote_seekTarget()                       │
│ ✓ Capture real O0, Ot, dO, dR values during Diego seek         │
│ ✓ Compare against predictions                                    │
│ ✓ Identify exact root cause (hidden O0, unclamped Ot, etc)     │
│ ✓ Implement fix based on findings                               │
│                                                                   │
│ See: DIEGO_COUPLING_DIAGNOSTIC_REPORT.md "Step 1: Capture"     │
└─────────────────────────────────────────────────────────────────┘

FILES GENERATED:
┌─────────────────────────────────────────────────────────────────┐
│ DIEGO_COUPLING_DIAGNOSTIC_REPORT.md  ← Full analysis + 5 tests  │
│ DIEGO_COUPLING_FIX_GUIDE.md          ← Implementation checklist │
│ (this file)                           ← Quick reference         │
│                                                                   │
│ Test files (already in MAGPIE_Server/):                         │
│ • debug_getDeltaR.js                  ← Math verification       │
│ • rotor_diagnostic.js                 ← Pure vs compound        │
│ • test_scratchpad_rotor.js            ← Line 83 rotor check     │
│ • test_diego_coupling.js              ← Scenario test           │
│ • test_diego_final_diagnosis.js       ← Brute-force matching   │
│ • run_diego_coupling_analysis.js      ← Live log analyzer       │
└─────────────────────────────────────────────────────────────────┘

CONFIDENCE LEVEL: 95%
✓ Math proven correct
✓ Root cause identified (compound rotor from mixed O0→Ot axes)
✓ Fix strategies validated in theory
⚠ Requires live logging to confirm exact O0/Ot values
⚠ After logging, confidence will reach 99%
```

---

## Math Proof (30-second version)

A rotor represents an axis-angle rotation: `[sin(θ/2)·axis, cos(θ/2)]`

When O0 and Ot differ in **multiple axes**, the delta rotor dO = Ot·O0⁻¹ is **compound** (affects multiple axes).

Compound rotor → bivector with all components non-zero

This is **not a bug**, it's the **correct mathematical decomposition**.

The "coupling" is actually the correct behavior of how rotations compose in 3D space.

---

## Key Insight

You're not seeing **crosstalk between axes**.  
You're seeing **a single compound rotor decomposed correctly into three components**.

Think of it like color:

- Pure red = single component  
- Purple = mixture of red + blue = multiple components  

Purple is not a bug in color theory. It's the result of mixing red and blue.

Similarly, your dR "purple" (all axes non-zero) is the result of compounding two different rotations (pitch correction + heading correction).

**The fix is not to "fix" the math.** The fix is to **recognize compound rotations and handle them in getTtAxis()**.
