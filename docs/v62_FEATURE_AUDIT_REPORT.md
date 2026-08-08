# OriginalMS v62 Feature Parity Audit Report
Date: 2026-08-08
Target: OriginalMS (`audit/v62-feature-parity` branch)

## 1. Verified Working Features
### Party Quests & Event Managers
- **Kerning City PQ (KPQ)**: Verified event script `KerningPQ.js` and entry NPC `9020000.js`. Stage timers and min/max level checks (21-30) are intact.
- **Ludibrium PQ (LPQ)**: Verified event script `LudiPQ.js` and entry NPC `2040034.js`. Stage timers and min/max level checks (35-50) are intact.
- **Orbis PQ (OPQ)**: Verified event script `OrbisPQ.js` and entry NPC `2013000.js`. Min/max level checks (51-70) are intact.
- **Amoria PQ (APQ)**: Verified event script `AmoriaPQ.js` and entry NPC `9201048.js`. Min/max level checks (40-300) are intact.
- **Monster Carnival PQ (CPQ)**: Verified event script `MonsterCarnivalPQ.js` and entry NPC `2042000.js`. Min/max level checks (30-50) are intact.
- **Cygnus Knights & Aran Job Parity**: Verified `src/client/MapleJob.java` contains full enums for Cygnus (NOBLESSE, DAWN_WARRIOR, etc., ids 1000-1511) and Aran (LEGEND, ARAN_1, etc., ids 2000-2112), including 5-byte packet decoding support.
- **Boss Phase Gates**: Verified `ZakumBattle.js`, `HontaleSquad.js`, and `PapulatusPQ.js` properly manage multi-phase logic server-side.

## 2. Defect & Gap Matrix
- **[DEFECT - FIXED] Localization Incomplete**: The `README.md` claims an "English localization scrub across NPC scripts", but NPC `9020000.js` (KPQ Entry - Clott) and `2012001.js` (Orbis Boat Loader), and `2013000.js` (OPQ Entry - Wonky) contained extensive Portuguese dialogue. This violates the parity requirement for a fully localized English UI.

## 3. Applied Code Fixes
- **English Localization**: Translated all dialogue strings in `9020000.js`, `2040034.js`, `2012001.js`, and `2013000.js` to English.
