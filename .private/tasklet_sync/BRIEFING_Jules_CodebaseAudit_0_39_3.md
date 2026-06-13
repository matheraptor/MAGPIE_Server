---
type: briefing
target_agent: Jules (Google AI async)
task: Codebase audit + documentation reconciliation
priority: high
context: Preventing knowledge base rot, token waste, context decay
---

# Codebase Audit: MAGPIE_Server Prototype 0.39.3

## Objective
Map the actual implementation state of the prototype branch and reconcile it against:
1. `README.md` (branch root)
2. `.private/docs/prototype_0_40_0_plan.md`

## Expected Deliverable
**Detailed audit report** (`AUDIT_CodebaseMapping_0_39_3.md`) with:
- Tree of all modules/components and their state (complete, partial, stub, missing)
- Gap analysis (what README says vs. what code does)
- Gap analysis (what plan says vs. what code does)
- Recommendations to keep documentation in sync

## Why This Matters
- Rory's agents (me + boss's agent) waste tokens re-scanning the codebase each session
- Messy knowledge base causes high mental load and context rot
- One source of truth per branch = faster onboarding, cheaper queries

## Success Criteria
- Report is detailed enough that Tasklet agents can plan sprints from it without re-reading code
- Gaps are actionable (e.g., "README section X is stale, update to Y")
- Can be committed and reused across future sessions

Push the audit report to `.private/tasklet_sync/` when done.
