<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Share+Tech+Mono&weight=bold&size=34&duration=3000&pause=1000&color=00FF72&center=true&vCenter=true&width=600&lines=OriginalMS;MapleStory+v62+Emulator;Dockerized+for+2026;BiosSystem+Kernel" alt="OriginalMS Title" />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Java-8-ED8B00?style=flat-square&logo=java" alt="Java 8">
  <img src="https://img.shields.io/badge/MapleStory-v62%20GMS%202008-blue?style=flat-square" alt="MapleStory v62">
  <img src="https://img.shields.io/badge/Docker-Compose-2CA5E0?style=flat-square&logo=docker" alt="Docker">
  <img src="https://img.shields.io/github/license/BiosSystem/OriginalMS?style=flat-square" alt="License">
</p>

## Elevator Pitch

**OriginalMS** is a modern, Dockerized classic MapleStory v62 (GMS 2008) server emulator. It provides a robust, zero-setup local deployment that ships with all Party Quests working, full boss suites, Cygnus Knights, Aran, and a fully localized English UI. 

For deep technical details, architecture diagrams, and extensive deployment guides, please see our **[Technical Wiki (docs/WIKI.md)](docs/WIKI.md)**.

## Features

- **Dockerized Environment:** Get up and running instantly with Docker Compose. No local dependencies required.
- **Complete Boss Suites:** Zakum, Horntail, and Papulatus are fully functional with server-side phase enforcement.
- **Working Party Quests:** Play Kerning PQ, Ludibrium PQ, Orbis PQ, Monster Carnival PQ, Amoria PQ, and Pirate PQ end-to-end.
- **Class Support:** Cygnus Knights and Aran class progression are fully implemented.
- **Localization:** 100% English translated NPC dialogue, quests, and interfaces.
- **Stability and Security:** Heavily patched to resolve exploits, dupe bugs, and stability issues from the upstream source.

## Quick Start

OriginalMS requires a `v62` game client and its WZ data files, which are not included in this repository. 

**1. Clone the repository**
```bash
git clone --branch main https://github.com/BiosSystem/OriginalMS.git
cd OriginalMS
```

**2. Add WZ Data**
Extract the `wz/` folder from your v62 client and place it into the project root directory.

**3. Build the Server**
```bash
mvn clean package -DskipTests
```

**4. Start with Docker Compose**
```bash
docker compose up -d
```
Wait for the `Listening on port 8484` message in the logs (`docker compose logs -f originalms`).

**5. Connect and Play**
Launch your patched `localhost.exe` game client and connect. Log in with the default administrator account (`admin` / `admin`).

---

**[📚 Read the Full Documentation and Technical Details in the WIKI](docs/WIKI.md)**

<div align="center">
  <i>Maintained by the BiosSystem team.</i>
</div>
