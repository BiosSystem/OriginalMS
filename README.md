<div align="center">
  <h1>OriginalMS</h1>
  <p><strong>MapleStory v62 Emulator • Dockerized for 2026 • BiosSystem Kernel</strong></p>
</div>

## Elevator Pitch

**OriginalMS** is a modern, Dockerized classic MapleStory v62 (GMS 2008) server emulator. It provides a complete, stable, and localized experience out of the box, with zero local environment setup required. Built around a microservices-inspired architecture, it brings classic nostalgia to a modern containerized workflow.

## Features

- **Dockerized Stack**: Fully containerized environment with MySQL 5.7 and Java 8 server components orchestrated via Docker Compose.
- **Complete Party Quests**: End-to-end functionality for Kerning, Ludibrium, Orbis, Monster Carnival, Amoria, and Pirate PQs.
- **Modern Job Classes**: Support for Cygnus Knights and Aran with full packet decoding.
- **Boss Mechanics**: Enforced server-side phase gates for Zakum, Horntail, and Papulatus.
- **Authentic Gameplay**: Rebuilt Gachapon tables for all 12 locations and extensive English localization across the game.
- **Secure**: Network isolation via Docker, exploit patching, and dupe bug fixes from base OdinMS.

## Quick Start

**1. Clone the repository:**
```bash
git clone --branch main https://github.com/BiosSystem/OriginalMS.git
cd OriginalMS
```

**2. Place WZ data files:**
Copy your extracted WZ folder from a v62 client into the project root:
```bash
cp -r /path/to/your/wz ./wz
```

**3. Build the server:**
```bash
mvn clean package -DskipTests
```

**4. Start the stack:**
```bash
docker compose up -d
```
The server is ready when `Listening on port 8484` appears in the logs. Connect your v62 `localhost.exe` to `127.0.0.1:8484` and log in (default: `admin` / `admin`).

## 📚 Technical Documentation

For deep technical details, branch architecture, deployment configuration, and security information, please refer to the **[OriginalMS Technical Wiki](docs/WIKI.md)**.

---
<div align="center">
  <i>Part of the <a href="https://bios-system.net">BiosSystem Suite</a></i>
</div>
