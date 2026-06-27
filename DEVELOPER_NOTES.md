# OriginalMS - Developer Notes

MapleStory v62 (GMS 2008-era) private server emulator. OdinMS lineage, translated from Brazilian Portuguese to English, Dockerized.

## Branch structure

| Branch | Based on | Purpose |
|---|---|---|
| `main` | full history (2020–2024) | Docker version - complete v62, all features |
| `classic` | `c497ea3` (2022-08-20) | Pre-Docker - shell scripts + bare JDK, 10 commits |

All new feature work goes on `main`. `classic` is a historical snapshot - do not add commits there unless fixing something specific to the non-Docker setup.

---

## Stack

| Layer | Tech |
|---|---|
| Language | Java 8 |
| Build | Maven 3.8.5 (inside Docker - no local JDK needed) |
| Network | Apache MINA 2.0.9 |
| Scripting | Rhino (JavaScript) - NPC/quest/event/portal/reactor |
| DB | MySQL 5.7+ - Tomcat JDBC pool |
| Runtime | Docker Compose (db + world + login + channel) |

## How to run

```bash
docker compose up --build -d
```

DB auto-imports `SQL/BiosMS.sql` on first start. Login on port `8484`, channel on `7575`.

## Key directories

| Path | Purpose |
|---|---|
| `src/net/channel/handler/` | Packet handlers (one class per opcode) |
| `src/client/` | MapleCharacter, inventory, skills |
| `src/server/` | Game logic - maps, monsters, items, events |
| `src/scripting/` | JS engine wrappers |
| `scripts/event/` | Event scripts (PQ flow, bosses, dojo) |
| `scripts/npc/` | NPC dialogue scripts |
| `configs/opcodes/` | `recvops.properties` + `sendops.properties` |
| `configs/world0/world.properties` | Active event list, world name |
| `SQL/BiosMS.sql` | Full schema + seed data |

## Opcode wiring

Recv opcodes are loaded from `configs/opcodes/recvops.properties` into the `RecvPacketOpcode` enum at boot.  
Handlers are registered in `src/net/PacketProcessor.java`.  
New handler: add to enum → add to properties file → register in PacketProcessor.

## Scripting API (event scripts)

Event scripts are JS files in `scripts/event/`. The Java side exposes:

- `em` - `EventManager` (schedule, properties, channel server)
- `eim` - `EventInstanceManager` (players, maps, timers, `saveDojoRecord()`)
- `MaplePacketCreator` - send packets
- `MapleInventoryManipulator` - add/remove items

## Completed features (v62 vanilla - nothing missing)

- All 52 job classes including Cygnus Knights and Aran
- All PQs: HenesysPQ, KerningPQ, LudiPQ, LudiMazePQ, OrbisPQ, AriantPQ×3, AmoriaPQ, AquariumPQ, PiratePQ, HontalePQ, ZakumPQ, GuildQuest, ElnathPQ, OmegaPQ, CrimsonwoodPQ, MuLungDojo
- Bosses: Zakum (squad+altar), Horntail (squad)
- CPQ1 (Ludibrium) + CPQ2 (Magatia, distinct mob pool)
- Steal skill (4201004), Venomous Star/Stab, Meso Explosion
- Party Search (PARTY_SEARCH_REGISTER 0xBD, PARTY_SEARCH_START 0xBF)
- Maker Skill (opcode 0x9B; `maker_recipe` + `maker_recipe_ingredients` DB tables)
- Mu Lung Dojo (36 floors; `dojorecord` DB table; `eim.saveDojoRecord()`)
- CWKPQ (CrimsonwoodPQ.js; MapleSquadType.CWKPQ)
- World Rankings (RankingWorker - every 30 min)
- Pets, Mounts, Silver Box, Maple TV, Duey, VIP rocks

## Out of scope (post-v62 - do NOT add)

- Potential / Bonus Stats
- Star Force / Spell Traces
- Pink Bean, Dual Blade, Evan, Mercedes, Resistance
- Custom boss rushes or non-vanilla events

## Commit rules

- Author: `BiosSystem` / `63607038+BiosSystem@users.noreply.github.com`
- No `feat:` / `fix:` / `chore:` prefixes - plain imperative (`Add X`, `Fix Y in Z`)
- No AI signatures, no "Co-Authored-By" trailers
- Spread dates: use GIT_AUTHOR_DATE/GIT_COMMITTER_DATE env vars to simulate realistic history (2–10 week gaps, +03:00 TZ)
- No push without user approval

## Known open questions

- MAKER_SKILL opcode 0x9B is a best-guess (unused gap in v62 recv table). If wrong, change only `configs/opcodes/recvops.properties`.
- Compilation can only be verified via `docker build .` (no local JDK).
