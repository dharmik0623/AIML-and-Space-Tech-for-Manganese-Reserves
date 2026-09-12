---
name: coderabbit-review
description: Performs an automated AI code review on modified files or git diffs, auditing security, performance, architecture, and correctness before shipping.
---

# CodeRabbit Automated Review Skill

Use this skill before shipping a feature, opening a pull request, or finalizing a phase.

## Review Workflow

### 1. Extract Changes
- Inspect the modified files or git diff:
  ```bash
  git status --short
  git diff HEAD~1
  ```

### 2. Multi-Pillar Analysis
Examine every changed line across:
- **Walkthrough / Summary**: Executive summary of what changed and why.
- **Critical Findings**: Bugs, security vulnerabilities, edge-case crashes.
- **Performance**: Inefficiencies, redundant recalculations, blocking I/O.
- **Actionable Suggestions**: Specific code improvements with drop-in diff snippets.

### 3. Quality Gate Determination
Assign a verdict:
- **APPROVED**: Code passes all quality, security, and performance bars.
- **CHANGES REQUESTED**: Severe flaws found; automatically trigger the **Ralph Loop** to patch them before user sign-off.
