# OriginalMS Technical Documentation

Welcome to the comprehensive technical documentation for OriginalMS, a modern, Dockerized classic MapleStory v62 (GMS 2008) server emulator.

## 🏗️ Architecture Overview

The OriginalMS architecture is separated into a server-side emulator stack and a game client. 

### Server Stack
- **Game Server Engine:** Java 8 (J2SE)
- **Network Engine:** Apache MINA. Handles high-concurrency TCP/IP connections from the game client.
- **Database:** MySQL / MariaDB. Maintains player data, inventory, quests, and game state.
- **Scripting:** JavaScript. Handles NPC dialogs, portal transitions, and quest logic dynamically without needing recompilation.

### Sub-Servers
1. **Login Server:** Handles client authentication over TCP Port 8484. Routes authenticated clients to appropriate Channel Servers.
2. **Channel Server(s):** Manages the in-game world instances, player movement, combat, dropping items, and map events.
3. **Shop Server:** Dedicated sub-server for Cash Shop and trade logic.

### Deployment Environment
- **Containerization:** The application is packaged using Docker and orchestrated with Docker Compose to provide a zero-setup local deployment.
- **Build System:** Maven is used to compile the Java server to a standalone JAR.

## ✨ Features

- **Party Quests (PQs):** End-to-end functionality for Kerning PQ, Ludibrium PQ, Orbis PQ, and more.
- **Classes:** Fully functional Cygnus Knights and Aran class progression.
- **Bosses:** Corrected boss spawn timers, HP, and drop tables.
- **Localization:** 100% English translated NPC dialogue, user interface, and quests.
- **Stability:** Heavily patched to resolve exploits, dupe bugs, and stability issues present in the upstream OdinMS source.

## 🚀 Deployment Guide

OriginalMS supports both Docker and bare-metal deployments.

### Prerequisites
1. **WZ Data Files:** Extracted from a v62 MapleStory client.
2. **Game Client:** A v62 patched `localhost.exe`.

### Docker Deployment (Recommended)

1. **Clone the repository:**
   ```bash
   git clone --branch main https://github.com/BiosSystem/OriginalMS.git
   cd OriginalMS
   ```
2. **Place WZ Data:** Copy your `wz/` folder into the project root.
3. **Build the JAR:**
   ```bash
   mvn clean package -DskipTests
   ```
4. **Launch Docker Compose:**
   ```bash
   docker compose up -d
   ```
   *Note: Wait until the logs output `Listening on port 8484` before connecting.*

### Classic Deployment (Bare-metal)
If you prefer running without Docker, check out the `classic` branch:
1. Load the database schema manually: `mysql -u root -p < sql/install.sql`
2. Configure `launch/config.properties` with your database credentials.
3. Build using Maven and run the resulting `target/OriginalMS.jar`.

## 🔒 Security

- **Patching:** Major exploitation methods and item duplication bugs present in early emulator sources have been patched.
- **Network Validation:** Incoming packets through Apache MINA are strictly validated to prevent malformed packet crashes.
- **Authentication:** Standard PIN and PIC implementations are enforced during login flow.

---
*Maintained by the BiosSystem team.*
