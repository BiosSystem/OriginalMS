# OriginalMS - Development History

Cross-session log of audits, decisions, and active work items.
Format: chronological, newest entries at top.

---

## 2026-07-23 - GMS v62 Parity Audit

### Audit Summary

Conducted a full read-only audit of the `main` branch against GMS v62 (Pirate class release, 2008) specifications.

**README parity findings:**

- "Cygnus Knights fully functional" - INACCURATE. MapleJob enum has zero Cygnus job IDs (1000-1511). Characters cannot be created or advanced.
- "Aran class progression fully functional" - INACCURATE. LEGEND(2000) and all Aran tier IDs missing from MapleJob enum.
- "All Party Quests working" - PARTIAL. Monster Carnival PQ has Java handler (MonsterCarnival.java, MonsterCarnivalHandler.java) but no event JS lifecycle script.
- "Fully localized English UI" - PARTIAL. NPC scripts contain Portuguese variable names and comments from the LeaderMS source base.
- "Full setup guides in the Wiki" - FALSE. GitHub Wiki is completely empty.

**GMS v62 gap findings:**

- Papulatus boss - entirely absent (no Java handler, no event script, no portal script, no NPC).
- Monster Carnival PQ event JS - missing; Java side present.
- Gachapon item tables sourced from Brazilian private server (LeaderMS), not authentic GMS v62 pools.
- Nautilus Harbor interior NPC coverage - only 7 scripts (2090000-2090104), approximately 18 NPCs missing.
- Pirate branch skill constants - incomplete entries in Gunslinger.java, Outlaw.java, Corsair.java.
- getBy5ByteEncoding() missing Cygnus (1024) and Aran (2048) cases in MapleJob.java.

### Decisions Made

- Target release: v3.0.0-v62 on Oct 25, 2026.
- All implementation work targets the `classic` branch first, then merges to `main` via PR.
- Boss phase gates to be enforced in event JS (not in Java combat loop) to avoid touching AbstractDealDamageHandler.
- Gachapon rebuild will source from community-documented GMS v62 prize lists (BasilMarket 2008 archives, MapleWiki snapshots).
- No Cygnus or Aran feature to be claimed in README until MapleJob enum IDs are merged and tested.

### Files Created This Session

- `ORIGINALMS_V62_PLAN.md` - full Oct 25 implementation roadmap (all phases A-E).
- `HISTORY.md` - this file.
- `CHANGELOG.md` updated with Planned section for v3.0.0-v62.

### Open Items

| ID | Item | Status |
|---|---|---|
| OI-01 | Add Cygnus job IDs to MapleJob enum | Pending - Phase A, Aug 4 target |
| OI-02 | Add Aran/Legend job IDs to MapleJob enum | Pending - Phase A, Aug 4 target |
| OI-03 | Fix getBy5ByteEncoding for Cygnus and Aran | Pending - Phase A, Aug 4 target |
| OI-04 | Complete Pirate skill constants (Gunslinger, Outlaw, Corsair) | Pending - Phase A, Aug 4 target |
| OI-05 | Implement Papulatus event script + NPC | Pending - Phase B, Aug 25 target |
| OI-06 | Horntail wing phase gate in HontalePQ.js | Pending - Phase B, Aug 25 target |
| OI-07 | Zakum arm kill gate hardening | Pending - Phase B, Aug 25 target |
| OI-08 | Monster Carnival PQ event JS wrapper | Pending - Phase B-C, Sep 8 target |
| OI-09 | Nautilus Harbor NPC scripts (2090xxx missing range) | Pending - Phase C, Sep 22 target |
| OI-10 | Gachapon item table rebuild (12 scripts) | Pending - Phase C, Sep 22 target |
| OI-11 | English localization scrub of NPC scripts | Pending - Phase D, Oct 6 target |
| OI-12 | GitHub Wiki initialization (6 pages) | Pending - Phase D, Oct 6 target |
| OI-13 | README accuracy corrections | Pending - Phase D, Oct 6 target |
| OI-14 | Full integration test matrix pass | Pending - Phase E, Oct 20 target |

---

## Prior Sessions

### 2022-2023 - OdinMS Foundation and v1.x Work

- Ported OdinMS v62 codebase to Java 8 + Maven.
- Full English translation pass on server notices, player commands, log output.
- Dockerized deployment stack (docker-compose, multi-stage Dockerfile).
- Added CPQ2, CWKPQ, Mu Lung Dojo, Maker Skill handler, Party Search handlers, Steal drop mechanic.
- History scrub: stripped AI signatures and conventional commit prefixes from git history (2026 audit).
