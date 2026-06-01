---
type: Quick Reference
status: Complete
---

# _getDeltaR Debug — Quick Reference Card

## The Question

> "Why does correcting one rotation axis (e.g., heading) cause the other axes to also show different values?"

## The Investigation

✓ Created 6 mathematical test cases  
✓ Verified `_getDeltaR` with known inputs  
✓ Confirmed zero cross-talk for pure rotations  
✓ Identified compound rotor behavior  

## The Verdict

| Finding                                   | Status     | Evidence                                  |
|-------------------------------------------|------------|-------------------------------------------|
| `_getDeltaR` has a bug                    | ✗ False    | All pure rotations output pure            |
| `_getDeltaR` is doing cross-talk          | ✗ False    | Single-axis rotation → single-axis output |
| Bivector components should be independent | ✗ False    | They're coupled by 3D geometry            |
| The problem is elsewhere                  | ✓ **TRUE** | Compound rotors naturally couple          |

## Test Results Summary

```markdown
Pure Z: [0, 0, 0.785398] ✓ (expected [0, 0, 0.785398])
Pure X: [0, 0.523599, 0] ✓ (expected [0, 0.523599, 0])
Pure Y: [1.047198, 0, 0] ✓ (expected [1.047198, 0, 0])
Compound: [1.185283, 0.254140, -0.254140] ✓ (expected all non-zero)
```

## Root Cause

Your rotor likely represents a **compound 3D rotation**, not a pure single-axis change:

```markdown
If you only changed heading:
  Pure heading rotor:    dR = [0, 0, angle] ← only Z
  Your actual rotor:     dR = [a, b, c]    ← all three

Why? Because O0 and O1 are complex orientations.
When you compute O1 * O0_inv, the result is a single
3D rotation that naturally couples all axes.
```

## The Three Possible Scenarios

### Scenario A: "My rotor SHOULD be pure"

```markdown
Diagnosis: COMPOUND (but shouldn't be)
Fix: Check O0/O1 generation or quaternion math
```

### Scenario B: "My rotor SHOULD be compound"

```markdown
Diagnosis: COMPOUND (and that's correct)
Fix: Change getTtAxis to work with compound bivectors
      OR extract Euler angles first
```

### Scenario C: "The rotor is pure, but getTtAxis still couples axes"

```markdown
Diagnosis: PURE (but getTtAxis shows coupling)
Fix: Problem is in getTtAxis state machine, not getDeltaR
```

## Diagnostic Commands

```bash
# Verify getDeltaR math
node debug_getDeltaR.js

# Classify a rotor
node rotor_diagnostic.js

# Monitor in real-time (needs physics.js integration)
RotorMonitor.js (see CONCLUSION.md for integration)
```

## Files in Order of Usefulness

1. **CONCLUSION.md** ← Start here for action items
2. **DEBUG_SUMMARY.md** ← Overview & recommendations  
3. **ANALYSIS_getDeltaR.md** ← Deep technical analysis
4. **debug_getDeltaR.js** ← Run tests yourself
5. **rotor_diagnostic.js** ← Classify your rotors
6. **RotorMonitor.js** ← Monitor during simulation

## Remember

```markdown
getDeltaR converts rotors to bivectors.
If you feed it pure input, it gives pure output. ✓
If you feed it compound input, all components couple. ✓

The question isn't "is getDeltaR broken?"
The question is "why is my rotor compound?" ← *This* is what to investigate.
```

---

**Status:** Debug complete. Investigation focused on O0/O1 generation next.
