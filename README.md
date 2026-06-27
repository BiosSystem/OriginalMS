# OdinMS Backend Source

This repository contains the backend source code and necessary configuration files for the OdinMS MapleStory server emulator.

## What is included in this release:
- `src/` - The complete Java source code for the server (Login, World, Channel, Scripting, Provider, etc.).
- `scripts/` - NPC, Portal, Event, and Quest scripts.
- `SQL/` - The database schema and initial data required to run the server.
- `configs/` - Server properties and configuration files.
- `lib/` - Java dependencies and `.jar` libraries required for compilation and runtime.
- `launch_*.sh` - Shell scripts for launching the individual server components (Login, World, Channel).
- `*.keystore` / `*.truststore` - Keystore files used for crypto/SSL connections.

## What is NOT included in this release:
- **WZ Files** - The MapleStory client XML/WZ data files are missing. You must provide a `wz/` directory populated with valid data for the server to load items, mobs, strings, and map data.
- **Compiled binaries** - There is no compiled `dist/` directory or `odinms.jar`. You must compile the source code first.
- **Client** - The actual MapleStory game client executable (`localhost.exe` or `MapleStory.exe`) is not included.
