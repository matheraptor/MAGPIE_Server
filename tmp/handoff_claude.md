> [!WARNING]
> DO NOT run global `grep`, `find`, or `ls` commands to search for context.
> All necessary context has been explicitly provided in this document. Execute the stated objective immediately.

# Handoff: MAGPIE_Server S0 Refresh Loop — M-02 Execution

## 1. Objective Overview

The MAGPIE S0 World Server currently processes only one `MAGPIE_EXP` at a time per entity tick. We are overhauling this by introducing a `followRoute` emote type that creates a self-managing sequential waypoint State, and a lean `MAGPIE_GEOMARKER` entity prototype to act as spatial marker objects. These two changes eliminate the rigid single-EXP queue limitation observed during Cargo Ship testing.

## 2. Achievements (This Session — Do NOT re-do these)

- **Friction 7 Resolved**: The S0 Architecture has formally transitioned from a "Queue Push" model to a **Carrier/Dial** model. Persistent States do not inject into the EXP queue; instead an EXP carrier flows through the `processStates` gate and absorbs additive modifiers.
- **The `followRoute` Pattern Defined**: An EXP payload containing `{ type: "followRoute", paths: [entityID, entityID, ...] }` is converted into a single persistent State. That State seeks `paths[0]`, on arrival calls `paths.shift()`, and self-discards when `paths.length === 0`.
- **MAGPIE_GEOMARKER Concept Defined**: Waypoints do not need the full overhead of `MAGPIE_ENTITY` (Traits, States, Stamina, etc). A `MAGPIE_GEOMARKER` needs only a `POVART` array (Position, Orientation, Velocity, Acceleration, Rotation, Thrust).
- **Mission M-02 Created**: Formal operational record at `projects/HASTRAL/06_DISPATCH/03_OP/OP_001/M-02/MISSION_M-02.md`.

## 3. Artifact Directory (All paths relative to workspace root `c:/Users/Marika/matheraptor/projects/`)

| File | Purpose |
|---|---|
| `MAGPIE_Server/main.js` | Root prototype declarations (`MAGPIE_ENTITY`, `MAGPIE_EXP`, `MAGPIE_STATE`, etc.) |
| `MAGPIE_Server/core/server.js` | Main server logic; prototype `.initialize()` implementations, heartbeat, `processStates` |
| `HASTRAL/06_DISPATCH/03_OP/OP_001/M-02/MISSION_M-02.md` | Formal mission spec for this task |
| `HASTRAL/06_DISPATCH/03_OP/OP_001/runtime_pipeline_mechanics.md` | Architectural consensus — Debate F and Edge Cases 1–4 |
| `HASTRAL/06_DISPATCH/03_OP/OP_001/friction_7_report.md` | Carrier/Dial model resolution and synthesis |

## 4. The Bleeding Edge

Execute the following two atomic tasks **in order**:

### STEP 1 — Define `MAGPIE_GEOMARKER` in `main.js`

Add the following prototype declaration to `main.js` alongside the other prototype function declarations (around line 119), and add it to the `module.exports` block:

```js
function MAGPIE_GEOMARKER() {
  this.initialize(...arguments);
}
```

Then define its prototype in `core/server.js` (or a new `core/geomarker.js` if you prefer isolation):

```js
MAGPIE_GEOMARKER.prototype.initialize = function initialize(data = {}) {
  this.ID = data.ID ?? Date.now();
  // POVART: [Position.x, Position.y, Orientation, Velocity, Acceleration, Rotation, Thrust]
  // Use the existing MAGPIE.KEY.PHYSICS.POVART key definition for Float64Array layout.
  this.POVART = data.POVART ?? new Float64Array(7);
};
```

**Constraint**: Do NOT add `.states`, `.traits`, `.currentHP`, `.currentSTA`, or any other rigid-body field to `MAGPIE_GEOMARKER`. It is a spatial anchor only.

---

### STEP 2 — Implement `followRoute` State Logic in `processStates`

Inside the entity refresh loop where States are processed, handle the `followRoute` type:

```js
// Pseudocode — adapt to the existing processStates structure in core/server.js
if (state.type === "followRoute") {
  if (!state.paths || state.paths.length === 0) {
    // No waypoints remain — discard the State
    state.resolved = true;
    continue;
  }
  const nextWaypointID = state.paths[0];
  const waypoint = RUNTIME.getEntity(nextWaypointID); // use existing entity lookup
  if (!waypoint) {
    // Invalid marker — skip and continue to next waypoint
    state.paths.shift();
    continue;
  }
  const dist = PHYSICS.distance(entity.POVART, waypoint.POVART); // existing PHYSICS method
  if (dist <= PHYSICS.ARRIVAL_TOLERANCE) {
    state.paths.shift(); // waypoint reached — tick it off
  } else {
    // Apply A/T targeting toward waypoint as a dial on the carrier EXP
    exp.dA += PHYSICS.angleToTarget(entity.POVART, waypoint.POVART);
    exp.dT += PHYSICS.thrustToTarget(entity.POVART, waypoint.POVART);
  }
}
```

**Constraint**: Invalid `waypoint` (bad ID) → skip via `paths.shift()` and continue. Do NOT hard-fail into Fatigue.

---

### STEP 3 — Write a Dummy Integration Test

Create a minimal standalone script `MAGPIE_Server/tests/followRoute_test.js` that:
1. Instantiates 3 `MAGPIE_GEOMARKER` objects at distinct positions.
2. Creates one entity with a `followRoute` State pointing to those 3 geomarkers in sequence.
3. Simulates 300 ticks of `processStates`.
4. Asserts: markers are resolved **in order**, `paths.length === 0` at end, no queue parsing occurred.
