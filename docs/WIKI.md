# OriginalMS Technical Wiki

## 1. Architecture
OriginalMS is a modern, Dockerized classic MapleStory v62 emulator utilizing a 3-branch source strategy and a microservices-inspired game server architecture.

### Branch Structure
The repository strictly manages three architectural branches:
- **`main`**: The production-ready Dockerized deployment stack (`v3.0.0-v62`).
- **`classic`**: The standalone emulator structure with all Party Quest fixes, boss phase gates, Cygnus/Aran jobs, Gachapon rebuild, and English localization applied.
- **`OdinMS`**: The raw unmodified v62 base upstream source (`v1.0.0-base`).

### System Components
The system is divided into three primary tiers:
1. **Docker Compose Stack**
   - **Database (`mysql:5.7`)**: Stores all game state, accounts, and server schemas.
   - **Game Server (Java 8)**: Built around the Apache MINA network engine, managing network I/O to game clients. The application is divided logically into:
     - **Login Server**: Handles initial client connections, authentication, and world selection on port 8484.
     - **World Server**: Manages cross-channel messaging and server-wide states.
     - **Channel Server(s)**: Handles the in-game simulation, map logic, combat, and player interactions (e.g., port 7575).
     - **Scripting Engine**: Processes JavaScript for NPC dialogues, Portals, Quests, and Event Managers.
2. **Game Client (External)**: A v62 patched `localhost.exe` connecting over TCP.
3. **Data Files (External)**: `wz/` data files extracted from a v62 client are mounted into the server containers.

## 2. Features
The codebase has been heavily modernized to ensure a complete and stable v62 GMS 2008 experience.
- **Party Quests (PQs)**: End-to-end functionality for Kerning City (KPQ), Ludibrium (LPQ), Orbis (OPQ), Monster Carnival (CPQ), Amoria (APQ), and Pirate PQ. Event managers enforce level ranges, stage timers, and phase transitions.
- **Modern Job Classes**: Enums and 5-byte packet decoding support for Cygnus Knights (Noblesse, Dawn Warrior, Blaze Wizard, Wind Archer, Night Walker, Thunder Breaker) and Aran.
- **Boss Mechanics**: Multi-phase server-side scripting gates for Zakum, Horntail, and Papulatus to prevent exploits and enforce party mechanics.
- **Authentic Gachapon**: Rebuilt item drop tables for all 12 in-game Gachapon locations.
- **Localization**: Extensive English translation across all NPC event scripts (such as boat loaders and PQ entry NPCs) ensuring complete UI parity.

## 3. Deployment
Deployment targets a fully containerized environment using Docker Compose for simple orchestration.
- **Build Process**: The Java codebase is compiled using Maven (`mvn clean package -DskipTests`) generating a `.jar` in `dist/` or `target/`.
- **Containers**:
  - `biosms-db`: Runs MySQL 5.7, initializing SQL schemas automatically from the `./SQL` directory on first startup. Volume mounted to persist data.
  - `biosms-world`: Runs the World server process. Connects to `biosms-db`.
  - `biosms-login`: Exposes port 8484 to clients. Dependent on the World and DB containers.
  - `biosms-channel1`: Exposes port 7575 for in-game connections.
- **Configuration**: Properties are injected via JVM arguments (e.g., `-Drecvops=recvops.properties`) and environment variables (`DB_URL`). The WZ data is mounted dynamically via `volumes: - ./wz:/app/wz`.

## 4. Security
- **Network Isolation**: All server components communicate within an isolated Docker bridge network (`biosms-network`). Only the Login (8484) and Channel (7575) ports are exposed publicly.
- **Database**: The `db` container uses environment variable injection for root passwords. Port 3306 is exposed for management but can be firewalled or restricted in a live environment.
- **SSL / Keystores**: The Java processes are launched with `javax.net.ssl.keyStore` and `trustStore` parameters, enforcing standard security for applicable network handlers.
- **Exploit Patching**: Base OdinMS dupe bugs and phase bypass vulnerabilities have been explicitly patched at the packet handler and event script levels.
