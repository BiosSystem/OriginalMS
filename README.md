# BiosMS — Vanilla MapleStory v62 Emulator

A clean, complete **MapleStory v62** (GMS 2008-era) private server emulator. BiosMS ships all authentic v62 content — every party quest, boss system, class mechanic, and mini-game — with no custom or post-v62 additions. Runs as a fully containerized stack via **Docker Compose**; no local Java or Maven needed.

> Based on the original [OdinMS](https://github.com/erikdesjardins/OdinMS) codebase by Patrick Huy, Matthias Butz, and Jan Christian Meyer. Originally a Brazilian Portuguese server project; rebuilt, translated to English, and Dockerized.

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Docker + Docker Compose | Desktop or CLI engine |
| MapleStory v62 Game Client | To connect |
| v62 WZ XML files | Place in `./wz/` — not bundled (see below) |

> **WZ files:** Due to copyright, game asset XMLs are not included. Extract them from a clean v62 installation and place them under `./wz/` (subdirectories: `Character.wz/`, `Item.wz/`, `Map.wz/`, `Mob.wz/`, `Npc.wz/`, `Reactor.wz/`, `Skill.wz/`, `String.wz/`, `TamingMob.wz/`).

---

## Quick Start

```bash
# Build images and start the full stack (DB + World + Login + Channel)
docker compose up --build -d
```

The MySQL container auto-imports `./SQL/BiosMS.sql` on first start. No manual SQL import needed.

### Connection Details (default)
| Service | Host | Port |
|---|---|---|
| Login Server | `localhost` | `8484` |
| Channel 1 | `localhost` | `7575` |

---

## Server Configuration

All config lives under `configs/`:

| File | Purpose |
|---|---|
| `configs/db.properties` | DB URL, user, password |
| `configs/login.properties` | Login server port, welcome messages, rate limits |
| `configs/channel.properties` | XP / meso / drop rates, port bindings |
| `configs/world0/world.properties` | World name, active events, ranking interval |
| `configs/opcodes/recvops.properties` | Client recv opcode → enum name mapping |
| `configs/opcodes/sendops.properties` | Server send opcode → enum name mapping |

Default rates are **1× (vanilla)** — `exp=1`, `meso=1`, `drop=1`.

---

## Implemented Content

### Party Quests
| PQ | Maps | Min Players |
|---|---|---|
| Henesys PQ | 910010000 | 1 |
| Kerning PQ | 103000800 | 4 |
| Ludi PQ | 922010100 | 6 |
| Ludi Maze PQ | 220080001 | 1 |
| Orbis PQ | 200080101 | 6 |
| Ariant PQ (×3 stages) | 260010000+ | 3 |
| Amoria PQ | 670010100 | 4 |
| Aquarium PQ | 230040420 | 4 |
| Pirate PQ | 925100000 | 4 |
| Horntale PQ | 240040700 | 6 |
| Zakum PQ | 280030000 | 6 |
| Guild Quest | 990000000 | 6 |
| Elnath PQ | 211040401 | 4 |
| Omega PQ | 221000000 | 4 |
| **Crimsonwood Keep PQ** | 610020000 | 5 |
| **Mu Lung Dojo** | 925020000 | 1 (ranking) |

### Boss Systems
| Boss | Squad Required | Notes |
|---|---|---|
| Zakum | Yes | Squad registration + altar fight |
| Horntail | Yes | Full 3-head fight sequence |

### Monster Carnival (CPQ)
| Version | Location | Mob Pool |
|---|---|---|
| CPQ1 | Ludibrium (980000xxx) | Brown Teddy, Bloctopus, Ratz, Chronos, Toy Trojan, Tick-Tock, Robo, King Bloctopus, Master Chronos, Rombot |
| **CPQ2** | Magatia (980031xxx) | Reinforced Iron Mutae, Hector, Security Camera, Stereo Mist, Soul Teddy, Homunculus, Void Mage, R.I. Mutae Chief, Roid, King Block Golem |

### Combat Skills (notable implementations)
| Skill | Class | Mechanic |
|---|---|---|
| Steal (4201004) | Bandit | Chance to drop one random item from monster per mob instance |
| Venomous Star (4120005) | Hermit | Stacks poison on monster up to 3× |
| Venomous Stab (4220005) | Night Lord | Same as above |
| Meso Explosion (4211006) | Chief Bandit | Full implementation |
| Pickpocket | Chief Bandit | Meso drop on hit |
| Energy Charge | Marauder/Buccaneer | Full charge mechanic |
| Combo Attack | Crusader/Hero | Orb system |

### Maker Skill
The Maker skill (`10001007` for Cygnus Knights, `20001007` for Aran) allows crafting ammunition and items from materials. Recipes are stored in the `maker_recipe` DB table. Default v62 recipes included:

| Item | Materials | Meso Cost | Quantity |
|---|---|---|---|
| Arrow for Bow | 1× Firewood | 300 | 100 |
| Arrow for Crossbow | 1× Firewood | 300 | 100 |
| Subi Throwing-Stars | 1× Processed Wood | 400 | 10 |
| Wolbi Throwing-Stars | 1× Processed Wood + 1× Steel Plate | 600 | 10 |
| Bullets | 1× Steel Plate | 200 | 100 |

### Social & Economy
- Guilds, Alliances, Buddy List, Messenger, Marriages, Spouse Chat
- Player Shops, Hired Merchants, MTS, Duey Delivery, Storage
- Pets: auto-pot, loot, commands, food
- Mounts, VIP Teleport Rocks, Maple TV, Silver Box, Gachapon

### World Rankings
Computed automatically every **30 minutes** (configurable via `world.ranking.interval`) by the `RankingWorker`. Updates `rank`, `rankMove`, `jobRank`, and `jobRankMove` columns on the `characters` table — both overall and per job-class rankings.

---

## Party Search

Players can register as Looking for Party and browse open parties via the in-game Party Search panel. The server handles `PARTY_SEARCH_REGISTER` (0xBD) and `PARTY_SEARCH_START` (0xBF) packets.

---

## GM Commands

Execute in-game by prefixing with `!`. Requires GM account (`gm = 1` in `accounts` table).

| Command | Arguments | Description |
|---|---|---|
| `!item` | `<item_id> [qty]` | Give item to self |
| `!map` | `<map_id>` | Warp to map |
| `!spawn` | `<mob_id> [qty]` | Spawn monsters |
| `!killall` | | Kill all monsters on map |
| `!notice` | `<message>` | World-wide server notice |
| `!ban` | `<name> <reason>` | Ban character + IP |
| `!unban` | `<name>` | Unban character |
| `!mute` | `<name>` | Mute player chat |
| `!level` | `<level>` | Set your level |
| `!job` | `<job_id>` | Change job class |
| `!mesos` | `<amount>` | Add mesos |

---

## Local Development (Without Docker)

Requires Java 8 JDK + Maven 3.8+.

```bash
# Compile
mvn clean package

# Configure local DB
# Edit configs/db.properties → url=jdbc:mysql://127.0.0.1:3306/biosms?user=root&password=YOUR_PASSWORD

# Launch in order (three separate terminals)
./launch_world.sh 0
./launch_login.sh
./launch_channel.sh 0
```

---

## Architecture

```
BiosMS/
├── src/                    Java source (OdinMS lineage, Java 8)
│   ├── net/                Network layer (MINA 2.0.9, packet handlers)
│   ├── client/             Character model, inventory, skills
│   ├── server/             Game logic (maps, monsters, items, events)
│   └── scripting/          JS engine wrappers (NPC, quest, event, portal, reactor)
├── scripts/                JavaScript event/NPC/quest/portal/reactor scripts
├── configs/                Properties files (rates, ports, opcodes, world settings)
├── SQL/                    MySQL schema + seed data
├── wz/                     WZ XML asset files (not bundled — add your own)
├── Dockerfile              Multi-stage: maven:3.8.5-openjdk-8 → openjdk:8-jre-slim
└── docker-compose.yml      DB + World + Login + Channel services
```

---

## Scope Policy

BiosMS strictly targets **GMS v62 vanilla** content. The following are intentionally **not** implemented:

- Potential / Bonus Stats (post-v75)
- Star Force / Spell Traces
- Pink Bean (GMS v83+)
- Dual Blade, Evan, Mercedes, Resistance classes
- Fishing (added post-v62)
- Custom boss rush / café PQ events

See [CHANGELOG.md](CHANGELOG.md) for a full history of changes.
