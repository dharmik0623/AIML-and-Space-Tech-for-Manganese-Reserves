---
name: gsd-runner
description: Orchestrates Get Shit Done (GSD) project lifecycle from initial roadmap to autonomous multi-phase execution, state tracking, and delivery.
---

# GSD Project Runner

Use this skill when starting a new project or advancing an existing project through GSD phases.

## Workflow

### 1. Project Initialization (`.planning/`)
- If `.planning/PROJECT.md` does not exist, analyze the project requirements and create:
  - `.planning/PROJECT.md`: Project scope, constraints, and architecture.
  - `.planning/ROADMAP.md`: Ordered phases (Phase 1, Phase 2, etc.) with explicit DoD (Definition of Done).
  - `.planning/STATE.md`: Active phase pointer, completed deliverables, and current blockers.

### 2. Phase Execution Protocol
For the active phase:
1. **Plan**: Formulate the implementation plan with concrete files and test strategies.
2. **Execute**: Implement the code, ensuring high architectural fidelity and performance.
3. **Trigger Ralph Loop**: Verify and auto-patch errors until all tests pass.
4. **Trigger CodeRabbit Review**: Audit code quality, security, and performance.
5. **Update State**: Mark phase completed in `.planning/STATE.md` and commit with `git commit -m "feat(phase-N): <summary>"`.

### 3. Autonomy
- Seamlessly transition from phase to phase until all roadmap milestones are satisfied.
