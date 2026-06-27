<div align="center">
  <h1>🛡️ OriginalMS</h1>
  <p><b>A modern, Dockerized classic MapleStory Server Emulator designed for 2026.</b></p>
</div>

---

## 🏗️ Repository Architecture & Versions

This project uses a strict, 3-branch architecture to separate the raw backend source from our custom game fixes and the modern deployment environment.

| Branch | Version / Build | Description |
| :--- | :--- | :--- |
| **`main`** | **`v2.0.0-docker`** | **(Default)** The production-ready version. It wraps the `classic` branch into a modern Docker form suitable for easy, scalable deployment in 2026. |
| **`classic`** | **`v1.1.0-classic`** | The re-edited and fixed version of the base emulator. This branch introduces crucial game fixes and fully working Party Quests (PQs). |
| **`OdinMS`** | **`v1.0.0-base`** | The raw, unedited base source we downloaded. It contains the original Java source code, scripts, and configurations. |

---

## 🚀 New Features (Available in `classic` & `main`)

- **Fully Working Party Quests (PQs)**: Heavily edited and fixed to ensure flawless PQ progression.
- **Core Game Fixes**: Resolved bugs, exploits, and stability issues present in the base `OdinMS` version.
- **2026 Modernization (`main` branch)**: Fully containerized environment using Docker and Docker Compose for instant, isolated deployment without local environment clutter.

---

## 🛠️ Technologies

- **Backend**: Java (J2SE)
- **Database**: MySQL / MariaDB
- **Containerization**: Docker & Docker Compose (`main` branch only)
- **Scripting**: JavaScript (for NPC/Portal/Quest logic) & Bash/Shell (launch scripts)

---

## ⚠️ Important: What is Missing?

To comply with licensing and distribution rules, this repository **only** contains the backend emulator logic. You must provide the following files yourself to run the server:

1. **WZ Data Files**: The XML/WZ data extracted from the MapleStory client is missing. You must place a valid `wz/` folder in your root directory containing strings, items, maps, and mob data for the server to boot.
2. **Compiled Binaries**: We do not distribute compiled `.jar` files. You must compile the Java source code to generate the server executables.
3. **Game Client**: The actual client executable (`localhost.exe` or `MapleStory.exe`) is not provided.

---

<div align="center">
  <i>Maintained by the BiosSystem team.</i>
</div>
