# OriginalMS Architecture & Branch Preservation

This document strictly logs the architectural rules and structural branch guidelines for the OriginalMS project. Future developers and AI assistants must strictly adhere to these rules.

## 1. Branch Structure
OriginalMS is uniquely segmented across multiple architectural branches rather than containing all versions in `master`.
- `main`: The core aggregation branch.
- `classic`: The v83 pre-BigBang emulator structure.
- `OdinMS`: The original v62 emulator structure.

**CRITICAL RULE: Never Delete Structural Branches.**
When executing pull requests or merging between these branches, **do not use the `--delete-branch` (`-d`) flag**. The repository relies on these branches existing permanently as they each compile into independent architectures and assets (`OriginalMS-Windows.zip`, etc.).

## 2. 2023-2024 Historical Integrity
The Git history from 2023-2024 was painstakingly reconstructed to align with the chronological development of OdinMS and Classic. 
- Do not attempt to squash these commits or "simplify" the git timeline. 
- All files belonging to these commits are intentionally staged to reflect the true historical state.

## 3. Continuous Integration
The `.github/workflows` pipelines are designed to compile and generate releases specific to the checked-out branch's architecture. 
- A release tagged from `classic` produces a distinct build from one tagged on `OdinMS`.
- Ensure that CI variables correctly identify the branch when publishing GitHub Releases to avoid cross-contamination of architectures.

## 4. Committer Identity
All automated commits, patches, and PRs must be authored under the `BiosSystem` identity (`63607038+BiosSystem@users.noreply.github.com`).
- No "Claude" or other AI signatures are permitted in commit messages, READMEs, or source code.
