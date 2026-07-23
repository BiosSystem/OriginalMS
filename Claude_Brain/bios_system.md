# BiosSystem Context - OriginalMS

## Repository

- GitHub: https://github.com/BiosSystem/OriginalMS
- Local: D:\Antigravity_Projects\OriginalMS
- Active branch for work: `classic`
- Production branch: `main`
- Tags: v1.0.0-base, v1.1.0-classic, v2.0.0-docker

## Technology Stack

- Java 8 (J2SE), Apache MINA 2.0.9
- MySQL / MariaDB
- JavaScript (Nashorn engine via mozilla_compat.js shim) for NPC/portal/quest/event scripts
- Maven build
- Docker + Docker Compose

## Architecture

Three-process server model: LoginServer, WorldServer, ChannelServer(s).
Communication via Java RMI (WorldChannelInterface, LoginWorldInterface).
Packet layer: MaplePacketDecoder -> PacketProcessor -> registered handlers.
Scripting: NPCScriptManager, PortalScriptManager, QuestScriptManager, EventScriptManager, ReactorScriptManager.

## Key Paths

- Skill constants: src/config/skills/
- Packet handlers: src/net/channel/handler/, src/net/login/handler/
- Game logic: src/server/, src/server/maps/, src/server/events/
- Character model: src/client/MapleCharacter.java
- Job enum: src/client/MapleJob.java
- Packet creator: src/tools/MaplePacketCreator.java
- Event scripts: scripts/event/
- NPC scripts: scripts/npc/
- Portal scripts: scripts/portal/
- Quest scripts: scripts/quest/

## GMS v62 Target Version

Global MapleStory version 0.62 (Pirate class release, 2008).
Key features: Pirates (Brawler/Gunslinger tree), Nautilus Harbor, Horntail, Papulatus, Monster Carnival, Gachapon v62 tables.

## Commit Rules

- Author: BiosSystem <63607038+BiosSystem@users.noreply.github.com>
- No conventional commit prefixes
- No AI signatures or Co-Authored-By trailers
- No em-dashes or en-dashes
- Plain imperative English subjects
- All work to `classic` branch, then PR to `main`
