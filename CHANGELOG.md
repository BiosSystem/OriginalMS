# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-08-08
### Added
- `docs/v62_FEATURE_AUDIT_REPORT.md` documenting the v62 feature parity audit, including Cygnus Knights, Aran, boss gates, and party quests.

### Fixed
- Localized English dialogue strings in Party Quest NPC scripts that were originally in Portuguese:
  - `9020000.js` (Kerning PQ Entry - Clott)
  - `2040034.js` (Ludibrium PQ Entry - Red Sign)
  - `2012001.js` (Orbis Boat Loader)
  - `2013000.js` (Orbis PQ Entry - Wonky The Fairy)
  - `GuildQuest.js` (Guild PQ Event Script)

## [1.0.0] - 2026-08-07
### Added
- Initial setup and base server codebase.
- Rebuilt v62 authentic Gachapon tables embedded within NPC logic scripts.
- Implemented `src/client/MapleJob.java` enums and packet decoding logic for Cygnus Knights (IDs 1000-1511) and Aran (IDs 2000-2112).
- Server-side multi-phase boss gating for Zakum (`ZakumBattle.js`), Horntail (`HontaleSquad.js`), and Papulatus (`PapulatusPQ.js`).
