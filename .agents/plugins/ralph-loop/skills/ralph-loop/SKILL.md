---
name: ralph-loop
description: Executes autonomous self-correcting iteration loops by running test commands, capturing failures, formulating patches, and repeating until 100% green.
---

# Ralph Loop Skill

Use this skill when developing complex features, refactoring, or resolving broken builds and failed test suites.

## Execution Steps

1. **Identify Test Command**:
   - Determine the project's test runner (e.g. `python -m pytest`, `npm test`, `cargo test`, `go test`).

2. **Execute Test Baseline**:
   - Run the test suite via `run_command`.
   - If return code is 0, exit immediately with success.

3. **Autonomous Diagnostic & Repair**:
   - Parse error messages, failed assertions, and line numbers.
   - Inspect the failing file using `view_file`.
   - Formulate a precise replacement using `replace_file_content` or `multi_replace_file_content`.
   - Re-run the test command.

4. **Verify Convergence**:
   - Verify that previous failures are resolved and no regressions were introduced.
   - Loop until all tests pass cleanly.
