# Contributing Rules

## Mandatory quality gate

For every new module, service, repository, controller, component, DTO, entity, or route:
- Add automated tests in the same change.
- Minimum coverage target is 90% for emergency-only scenarios.
- Required default target is 100% coverage for changed scope and current repository baseline.
- Add/update documentation (`README.md` and module docs when behavior changes).
- Run quality gate before continuing to the next task:
  - `make quality`
  - `make build`

## Stop rule

Do not proceed to next implementation step unless all checks are green:
- No test failures.
- No quality command failures.
- No build failures.
- No warnings accepted in CI-quality commands.

## Commit discipline

Use small atomic commits and include tests + docs in the same commit.
