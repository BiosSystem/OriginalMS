# OriginalMS v62 - Implementation Plan
## Oct 25, 2026 Release Target

Audit conducted: 2026-07-23. Based on Phase 1 findings.
Target release: `v3.0.0-v62` staged and tagged by Oct 25, 2026.
All work targets the `classic` branch first, then merges to `main`.

---

## Milestone Map

| Date | Milestone |
|---|---|
| Jul 23 | Phase 1 audit complete |
| Aug 04 | Milestone A - Job system fixes (Cygnus + Aran enum, job dispatch) |
| Aug 25 | Milestone B - Boss completeness (Papulatus, Horntail server-side, Zakum hardening) |
| Sep 08 | Milestone C - Party Quest integrity (Monster Carnival PQ, PiratePQ completion) |
| Sep 22 | Milestone D - Nautilus + Gachapon authenticity pass |
| Oct 06 | Milestone E - Localization scrub + Wiki documentation |
| Oct 20 | Milestone F - Integration test pass, README corrections |
| Oct 25 | v3.0.0-v62 tagged and released |

---

## Phase A - Job System (Target: Aug 4)

### A1 - Register Cygnus Knights job IDs in MapleJob

**File:** `src/client/MapleJob.java`

**Problem:** The `MapleJob` enum declares jobs 0 through 522 plus GM slots. Cygnus job IDs 1000-1510 are entirely absent. When a player selects a Cygnus class, `getById()` returns `null`, the server cannot dispatch skill handlers, and job advancement NPCs fail silently.

**Fix:** Add entries for NOBLESSE(1000), five 1st-job branches (1100/1200/1300/1400/1500), five 2nd-job branches (1110/1210/1310/1410/1510), and five 3rd-job branches (1111/1211/1311/1411/1511).

**Rationale:** In GMS v62, Cygnus Knights are a full second character type. Each of the five branches follows a Noblesse (base) -> 1st job -> 2nd job -> 3rd job progression. The `isA()` method already handles parent-job inheritance via integer division, so once the IDs are declared the existing inheritance logic works without further modification.

Also required: add `isCygnusKnight()` helper that checks `id >= 1000 && id <= 1599`. This method is needed by `MapleCharacter` stat-cap logic (Cygnus chars are capped at level 120 in GMS v62).

---

### A2 - Register Aran (Legend) job IDs in MapleJob

**File:** `src/client/MapleJob.java`

**Problem:** `LEGEND(2000)` is missing. Aran characters cannot advance past Beginner because the server cannot resolve their job ID.

**Fix:** Add LEGEND(2000), ARAN_1(2100), ARAN_2(2110), ARAN_3(2111), ARAN_4(2112).

**Rationale:** Aran is a single-branch Legend job with four tiers in GMS v62. The fourth job ID 2112 is required or Aran players reach a dead end at 3rd job. GMS v62 Aran 4th-job skills use prefix `21120xxx`.

---

### A3 - Extend getBy5ByteEncoding() for Cygnus and Aran

**File:** `src/client/MapleJob.java`

**Problem:** The `getBy5ByteEncoding()` switch maps encoded byte `32` to PIRATE and returns BEGINNER for all others. Cygnus uses encoded byte `1024` and Aran uses `2048` in the character creation packet. Without these cases, Cygnus/Aran creation falls back to Beginner.

**Fix:** Add `case 1024: return NOBLESSE;` and `case 2048: return LEGEND;`.

**Rationale:** The character creation recv packet sends a 5-byte bitmask: Warriors=2, Magicians=4, Bowmen=8, Thieves=16, Pirates=32, Cygnus=1024, Aran=2048. Missing cases silently create Beginner characters instead of Cygnus/Aran.

---

### A4 - Complete Pirate branch skill constants

**Files:** `src/config/skills/Gunslinger.java`, `Outlaw.java`, `Corsair.java`

**Problem:** Several 2nd and 3rd-job Pirate skill IDs are missing, causing `null` lookups in the skill factory and NPE disconnects in `SpecialMoveHandler` when players attempt to use them.

**Specific gaps:**
- `Gunslinger.java` - missing: `INVISIBLE_SHOT (5200001)`, `TRIPLE_SHOT (5201005)`
- `Outlaw.java` - missing: `BURST_FIRE (5211003)`, verify HOMING_BEACON vs WRATH_OF_OCTOPI IDs
- `Corsair.java` - verify `BULLSEYE` ID is `5220010` not `5220011`

**Rationale:** When a player double-clicks a skill, the client sends opcode `SPECIAL_MOVE` with the skill ID. `SkillFactory.getSkill(id)` returning null throws NPE in `SpecialMoveHandler`, disconnecting the player.

---

## Phase B - Boss Completeness (Target: Aug 25)

### B1 - Implement Papulatus event script and NPCs

**Files (new):** `scripts/event/PapulatusPQ.js`, `scripts/portal/papulatus_enter.js`, `scripts/npc/1201005.js`

**Problem:** Papulatus is a core GMS v62 boss and is entirely absent from the codebase.

**Approach:** Follow the OdinMS event-script pattern established by ZakumPQ.js. The script must:
1. Validate party (size 1-6, minimum level 100).
2. Warp party to map `220080001` (Deep Inside the Clocktower).
3. Spawn Papulatus Clock (mob `8500001`) at spawn point 0.
4. On Clock death, spawn Papulatus (mob `8500002`) - two-phase fight.
5. On boss death, warp party to `220080000` with rewards.

**Rationale:** The existing `EventInstanceManager` API (`spawnMonster`, `warpPlayers`, `startMapEffect`) provides all required hooks. No new Java class is needed - the script engine drives the full lifecycle.

---

### B2 - Add Horntail server-side phase enforcement

**File (modify):** `scripts/event/HontalePQ.js`

**Problem:** No validation prevents players from attacking the main Horntail body before the wing phases are complete.

**Fix:** Add `onMonsterDeath` callbacks for wing mob IDs `8810003` (left) and `8810004` (right) that set flags on the instance via `em.setProperty`. Block attacks on the main body (`8810007`) until both flags are set.

**Rationale:** Enforcing the phase gate in script avoids modifying the `MapleMap` combat resolution loop. The `onMonsterKilled` event callback fires synchronously with mob death, making it a reliable gate.

---

### B3 - Harden Zakum arm kill sequence

**File (modify):** `scripts/event/ZakumBattle.js`

**Problem:** The Java layer processes attack packets on the Zakum body while arms are still alive.

**Fix:** Add a `zakumArmsKilled` counter property in the event instance. Increment it in `onMonsterDeath` for each of the 8 arm mob IDs (`8800003`-`8800010`). Block body activation until counter reaches 8.

---

### B4 - Monster Carnival PQ - add event JS wrapper

**File (new):** `scripts/event/MonsterCarnivalPQ.js`

**Problem:** `MonsterCarnival.java` and `MonsterCarnivalHandler.java` exist in Java but there is no event JS to drive match lifecycle.

**Approach:** The event script manages:
1. Two-team party setup (Red vs Blue, up to 6v6).
2. 10-minute match timer via `em.schedule`.
3. CP tracking via `em.getProperty`.
4. Winner announcement and bonus EXP/item reward.
5. Warp-out to lobby map `980000000` on finish.

Entry NPC: `9220061` (Lulu). Stage maps: `980000001`-`980000009`.

**Rationale:** The `MonsterCarnivalHandler` already dispatches `MONSTER_CARNIVAL_SUMMON` and `MONSTER_CARNIVAL_USE_CP` opcodes. The only missing piece is the lifecycle wrapper.

---

## Phase C - Nautilus and Gachapon (Target: Sep 22)

### C1 - Complete Nautilus Harbor NPC coverage

**Files (new):** Additional scripts in `scripts/npc/` for missing Nautilus interior NPCs in the `2090xxx` range.

**Problem:** Only 7 Nautilus NPC scripts exist. GMS v62 Nautilus Harbor has approximately 25 unique NPCs. Missing scripts cause empty dialogue windows for players inside Nautilus maps.

**Scope:** Identify missing NPC IDs by cross-referencing WZ `Npc.img` for the `2090xxx` range. Stub scripts (minimal dialogue returning players to correct area) for any ID that lacks a script.

---

### C2 - Verify and correct Gachapon item tables against GMS v62

**Files (modify):** `scripts/npc/9100100.js` through `9100111.js`

**Problem:** Current Gachapon scripts originate from LeaderMS (Brazilian private server). Item pools do not match authentic GMS v62 Gachapon prize tables, and all 12 location scripts share nearly identical pools (each Gachapon location had a distinct pool in GMS v62).

**Fix:** Rebuild each script with location-appropriate item pools sourced from GMS v62 community archives (BasilMarket historical records, GMS v62 patch notes, MapleWiki 2008 snapshots). Maintain the 3-tier weight system (60/30/10 split) but correct the item IDs per location.

---

## Phase D - Localization and Documentation (Target: Oct 6)

### D1 - English localization scrub of NPC scripts

**Files (modify):** Approximately 40-60 scripts in `scripts/npc/` with Portuguese variable names or dialogue strings.

**Fix:** Bulk rename Portuguese variables (`comum`->`common`, `normal`->`normal`, `raro`->`rare`). Replace Portuguese dialogue strings with GMS v62 English text.

---

### D2 - GitHub Wiki initialization

**Pages to create:**
1. Home - project overview
2. Quick-Start-Guide - Docker and manual setup steps
3. GM-Commands - full command reference from GMCommand.java and PlayerCommand.java
4. Boss-Guides - Zakum, Horntail, Papulatus entry requirements
5. Party-Quest-Guide - all PQs with entry NPCs, level requirements, rewards
6. Troubleshooting - common setup errors

---

### D3 - README accuracy corrections

**File (modify):** `README.md`

Update the "What's Fixed" section to reflect v3.0.0 status. Add Papulatus and Monster Carnival PQ to feature lists. Remove the dead Wiki link placeholder until content is published.

---

## Phase E - Integration Testing and Release (Target: Oct 20 - Oct 25)

### Test Matrix

| Test | Pass Criteria |
|---|---|
| Create Pirate character | Reaches level 10, advances to Brawler and Gunslinger |
| Create Cygnus character | Noblesse created, advances to Dawn Warrior 1st job at level 10 |
| Create Aran character | Legend created, advances to Aran 1st job at level 10 |
| Kerning PQ | Party of 3-6 completes all stages and receives rewards |
| Ludi PQ | Party completes clock rooms and Alishar |
| Orbis PQ | All stages complete |
| Monster Carnival PQ | 6-player match runs 10 minutes, awards winner |
| Zakum | Arms die in sequence, body becomes attackable, boss drops |
| Horntail | Wings die before main body becomes attackable |
| Papulatus | Clock phase and Papulatus phase both function |
| Gachapon | All 12 location machines dispense correct items by rarity tier |
| Trade | Two-player trade completes without item duplication |
| MTS | Item listed and retrieved successfully |

### Release

Commit message: `Initialize OriginalMS v3.0.0-v62 release and complete GMS v62 feature parity`
Tag: `v3.0.0-v62`
Branch flow: `classic` -> PR -> `main`

---

## File Change Index

| Phase | File | Action |
|---|---|---|
| A1-A3 | `src/client/MapleJob.java` | Modify - add Cygnus and Aran job IDs |
| A4 | `src/config/skills/Gunslinger.java` | Modify - add missing skill constants |
| A4 | `src/config/skills/Outlaw.java` | Modify - add missing skill constants |
| A4 | `src/config/skills/Corsair.java` | Modify - add missing skill constants |
| B1 | `scripts/event/PapulatusPQ.js` | New |
| B1 | `scripts/portal/papulatus_enter.js` | New |
| B1 | `scripts/npc/1201005.js` | New |
| B2 | `scripts/event/HontalePQ.js` | Modify - add phase gate logic |
| B3 | `scripts/event/ZakumBattle.js` | Modify - harden arm kill gate |
| B4 | `scripts/event/MonsterCarnivalPQ.js` | New |
| C1 | `scripts/npc/2090xxx.js` (multiple) | New |
| C2 | `scripts/npc/9100100.js` through `9100111.js` | Modify - correct item tables |
| D1 | `scripts/npc/` (bulk) | Modify - localization scrub |
| D2 | GitHub Wiki | New pages |
| D3 | `README.md` | Modify - accuracy corrections |
