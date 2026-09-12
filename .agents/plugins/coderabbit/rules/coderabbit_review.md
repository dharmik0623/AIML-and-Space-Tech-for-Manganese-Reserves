# CodeRabbit Automated Code Review Rule

This rule enforces contextual, AST-level code review and strict quality gate standards.

## CodeRabbit Review Pillars

1. **Architectural & Design Coherence**:
   - Ensure modifications follow established repo patterns and clean separation of concerns.
   - Guard against circular dependencies and leaky abstractions.

2. **Security & Safety Audit (OWASP)**:
   - Check for hardcoded API keys, passwords, or sensitive credentials.
   - Validate and sanitize all external user/API inputs.
   - Prevent SQL injection, path traversal, and command injection vulnerabilities.

3. **Performance & Concurrency**:
   - Verify non-blocking asynchronous calls in API handlers.
   - Prevent unbounded memory allocations and unbounded loops.
   - Optimize mathematical models and database queries.

4. **Error Handling & Resilience**:
   - Ensure comprehensive try/catch blocks with structured HTTP status codes and error messages.
   - Guarantee robust fallbacks for external network or API outages.

5. **Type Safety & Documentation**:
   - Enforce Python type hints (`pydantic`, `typing`) or TypeScript strict typing.
   - Preserve comments and docstrings.
