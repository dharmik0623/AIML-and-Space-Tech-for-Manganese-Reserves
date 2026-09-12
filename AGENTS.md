# Antigravity Autonomous Engineering Rules: GSD + Ralph Loop + CodeRabbit

This workspace is governed by the combined **GSD + Ralph Loop + CodeRabbit** autonomous development framework. The agent must adhere to these directives on every task.

---

## 1. Get Shit Done (GSD) Engine
- **Spec-First**: Maintain `.planning/PROJECT.md`, `.planning/ROADMAP.md`, and `.planning/STATE.md`.
- **Phase Breakdown**: Break down complex requests into numbered phases with clear acceptance criteria.
- **Continuous Progress**: Execute phases systematically (Plan $\to$ Execute $\to$ Verify $\to$ Commit) and persist state across context resets.

---

## 2. Ralph Loop (Self-Correction & Test-Driven Convergence)
- **Zero Failure Halts**: Never stop or ask the user how to fix failing tests, syntax errors, or compiler warnings.
- **Autonomous Feedback Loop**:
  1. Detect test failure or runtime crash.
  2. Parse exact error traceback and failing assertion.
  3. Formulate and apply minimal, high-precision code patch.
  4. Re-run tests immediately.
  5. Repeat until 100% green (up to 5 iterations).
- **Definition of Done**: A phase is only finished when the test suite returns exit code 0.

---

## 3. CodeRabbit (Automated Quality & Security Gate)
- **Multi-Pillar Audit**: Before declaring work complete or preparing commits, audit changes for:
  - **Security (OWASP)**: Input validation, secret leakage, safe query parameters.
  - **Performance**: Non-blocking I/O, optimized algorithmic complexity, resource cleanup.
  - **Architecture**: Consistency with codebase conventions and strong type safety.
  - **Edge Cases**: Robust fallbacks for external failures or missing data.
- **Review Gate**: If any critical or high-severity defect is identified during review, trigger the Ralph Loop to resolve it before presenting the final result.
