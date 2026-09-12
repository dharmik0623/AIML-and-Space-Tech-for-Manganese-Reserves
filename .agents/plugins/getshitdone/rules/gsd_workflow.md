# Get Shit Done (GSD) Workflow Rule

This rule governs structured, milestone-and-phase-driven project execution.

## Core Directives

1. **Spec & Planning First**:
   - Maintain the `.planning/` directory containing:
     - `PROJECT.md`: High-level vision, core requirements, architecture, and scope.
     - `ROADMAP.md`: Sequential phase breakdown with clear dependencies and deliverables.
     - `STATE.md`: Real-time tracking of active phase, completed tasks, roadblocks, and next actions.
   - Never write production code without identifying the target phase or task in the roadmap.

2. **Phase Execution Lifecycle**:
   - **Step 1: Discuss/Clarify**: Align on requirements, interfaces, and acceptance criteria.
   - **Step 2: Plan (PLAN.md)**: Detail exact files to create/modify, dependencies, and test conditions.
   - **Step 3: Execute**: Implement code with modular, well-structured components.
   - **Step 4: Verify**: Execute unit tests, integration tests, and UAT criteria.
   - **Step 5: Checkpoint**: Update `.planning/STATE.md` and create an atomic git commit.

3. **Context Resilience**:
   - Write persistent notes and handoffs into `.planning/` so any context reset or new session can resume instantly without asking repetitive questions.

4. **Guaranteed Delivery**:
   - When given broad project instructions, autonomously advance through the roadmap until the deliverable is fully verified and functional.
