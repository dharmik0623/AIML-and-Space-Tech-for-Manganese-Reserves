# Ralph Loop Self-Correction Protocol

This rule governs continuous, autonomous self-correction and test-driven repair.

## Core Directives

1. **Zero-Stop on Failure**:
   - When code produces a traceback, syntax error, failed test, or compiler error, **DO NOT** stop and ask the user how to fix it.
   - Enter the **Ralph Loop** immediately.

2. **The Ralph Iteration Cycle**:
   ```
   [Execution / Test Failure] 
               │
               ▼
   [Isolate Root Cause from Traceback/Logs]
               │
               ▼
   [Apply Targeted Code Patch]
               │
               ▼
   [Re-Run Test Suite / Compiler]
         │                   │
      [Fails]             [Passes]
         │                   │
         └────◄ Repeat ◄─────┘──► [Proceed to Next Phase]
   ```

3. **Maximum Iteration Guardrail**:
   - Continue the self-correction cycle up to 5 iterations.
   - Never repeat the exact same patch if it produced the same error; adjust hypothesis and inspect dependencies or data types.

4. **100% Green Verification Standard**:
   - Code is only considered complete when all unit tests, integration tests, and verification checks exit with code 0.
