# @elementals/workspace
PNPM workspace for Elementals.

## Linting - Biome
Uses Biome for linting. Lock version to `1.9.3` in code editor settings so the settings are consistent across the workspace.

## Commitlint 
Uses Commitlint for commit message linting.

Format: `<type>(<scope>): <subject>`
Example: `feat(button): add new button component`
Types:
- build: Changes that affect the build system or external dependencies
- chore: Routine tasks, maintenance, or tooling changes
- ci: Changes to CI configuration files and scripts
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- revert: Reverts a previous commit
- style: Changes that do not affect the meaning of the code (formatting, etc)
- test: Adding missing tests or correcting existing tests

## Resources
- Frameworks usage stats: https://gist.github.com/tkrotoff/b1caa4c3a185629299ec234d2314e190 [React: ~40%, Vue: ~30%, Angular: ~20%]
