# Changelog

All notable changes to BiosMS are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] — 2023-12-03

### Added
- **CPQ2 (Monster Carnival 2)** — `MonsterCarnivalHandler` now detects Magatia map range (`980031xxx`) and routes to the authentic CPQ2 mob pool (Reinforced Iron Mutae, Hector, Security Camera, Stereo Mist, Soul Teddy, Homunculus, Void Mage, Reinforced Iron Mutae Chief, Roid, King Block Golem). CPQ1 (Ludibrium) mob pool unchanged.
- **Crimsonwood Keep Party Quest (CWKPQ)** — New `scripts/event/CrimsonwoodPQ.js` event for the expedition-based party quest in Crimsonwood Keep maps (`610020xxx`). Added `CWKPQ(5)` to `MapleSquadType` enum.
- **Mu Lung Dojo** — New `scripts/event/MuLungDojo.js` 36-floor solo/party ranking event. Floor progression handled in-event; best floor scores persist in the new `dojorecord` DB table via `EventInstanceManager.saveDojoRecord()`.
- **Maker Skill handler** (`MakerSkillHandler.java`) — Processes the Maker Skill interface packet (`recv opcode 0x9B`) for Cygnus Knights and Aran Maker skills (`10001007`, `20001007`). Looks up recipes from `maker_recipe` and `maker_recipe_ingredients` tables, validates materials, deducts mesos, and creates the crafted item. Starter recipes included for arrows, throwing stars, and bullets.
- **Party Search handlers** (`PartySearchHandler.java`) — Wires `PARTY_SEARCH_REGISTER` (0xBD) and `PARTY_SEARCH_START` (0xBF) recv opcodes that were previously defined in `recvops.properties` but never handled. Stores LFP state on `MapleCharacter` (`partySearch`, `partySearchCategory`).
- **Steal skill item drop (skill 4201004)** — Bandit's Steal now has a chance (driven by the skill's effect chance stat) to drop one random item from a monster's drop table. Each monster can only be stolen from once (`isStolenFrom` flag on `MapleMonster`). Implemented in `AbstractDealDamageHandler`.
- **`dojorecord` DB table** — Tracks character best Mu Lung Dojo floor and timestamp. Uses `ON DUPLICATE KEY UPDATE` to only record improvements.
- **`maker_recipe` and `maker_recipe_ingredients` DB tables** — Stores Maker Skill crafting recipes. Seeds basic v62 ammunition recipes on first import.
- **OmegaPQ activated** — Added `OmegaPQ` to `world.events` active list (script `OmegaPQ.js` already existed but was dormant).
- **`EventInstanceManager.saveDojoRecord()`** — New Java method callable from event scripts to write dojo ranking records to the DB without requiring direct DB access from JavaScript.

### Changed
- `configs/world0/world.properties` — Removed `BossHunterPQ` from the active event list (script file does not exist; the equivalent `BossQuest.js` was already active). Added `OmegaPQ`, `CrimsonwoodPQ`, `MuLungDojo`.

### Fixed
- **BossHunterPQ naming bug** — `BossHunterPQ` was listed in `world.events` but no `BossHunterPQ.js` script exists. The server was silently failing to load this event on every startup. Removed the erroneous entry; `BossQuest` (the correct script) remains active.
- **PARTY_SEARCH opcodes unhandled** — `PARTY_SEARCH_REGISTER = 0xBD` and `PARTY_SEARCH_START = 0xBF` were present in `recvops.properties` and mapped in the enum but had no registered handler, causing those packets to be silently dropped. Now handled.

---

## [1.0.0] — 2022-10-24

### Added
- Full translation of all server notices, log messages, and in-game player command output from Portuguese to English.
- Restored missing packet handler registrations and realigned recv/send opcode enum values to match client.
- Maven build configuration (`pom.xml`), Docker Compose stack (`docker-compose.yml`), and multi-stage `Dockerfile` (Maven build → JRE slim runtime).
- Server shell launch scripts (`launch_world.sh`, `launch_login.sh`, `launch_channel.sh`) and logging configuration.
- JavaScript scripting engine for NPCs, portals, quests, reactors, and events using Rhino/Nashorn with `mozilla_compat.js` shim.

### Foundation (2020–2022)
- Initial port of the OdinMS v62 codebase to a clean, English-language Java 8 + Maven project.
- Apache MINA 2.0.9 networking with full login, world, and channel server trio.
- Complete character system: 52 job classes (Explorer, Cygnus Knights, Aran), all skill trees, buffs, debuffs, combos, energy charge.
- Party quests: HenesysPQ, KerningPQ, LudiPQ, LudiMazePQ, OrbisPQ, AriantPQ×3, AmoriaPQ, AquariumPQ, PiratePQ, HontalePQ, ZakumPQ, GuildQuest, ElnathPQ.
- Boss systems: Zakum (squad + altar), Horntail (squad + full fight).
- CPQ1 (Monster Carnival, Ludibrium) with mob spawn, debuffs, and guardian mechanics.
- Social systems: guilds, alliances, buddy list, messenger, marriages, spouse chat.
- Economy: player shops, hired merchants, MTS, Duey delivery, storage.
- Misc: Pets (auto-pot, loot, chat, food), Mounts, VIP teleport rocks, Maple TV, Silver Box.
- World rankings computed every 30 minutes by `RankingWorker` (overall + per-job-class).
- MySQL 5.7 schema with 76 tables; Tomcat JDBC connection pool.
