# 🍁 BiosMS — Vanilla MapleStory v62 Emulator

Welcome to **BiosMS**, a clean, vanilla MapleStory v62 (2008-era) private server emulator. BiosMS is designed to run in a modernized development container stack using **Docker Compose** and compiles natively under **Maven** with Java 8, bringing the nostalgic "OriginalMS" server code into the modern era.

---

## 🛠️ Prerequisites

Before launching the server, ensure you have the following installed on your host machine:

1. **Docker & Docker Compose** (Desktop or CLI engine)
2. **MapleStory v62 Game Client** (to connect to the server)
3. **MapleStory v62 WZ XML files** (placed in the `./wz` folder at the root of this project)
   > [!NOTE]
   > Due to file size constraints, game client asset XMLs (WZ files) are not bundled in this repository. You must extract them from a clean v62 installation or download a v62 WZ XML pack and place them in the `./wz/` directory so the server can load item, map, and monster data on boot.

---

## 🚀 Getting Started (Docker Compose)

The easiest way to compile and start the entire BiosMS stack (MySQL Database + World + Login + Channel Server) is using Docker Compose:

### 1. Place WZ Files
Ensure your WZ XML files are in the `./wz` folder:
```
BiosMS/
├── wz/
│   ├── Character.wz/
│   ├── Item.wz/
│   ├── Map.wz/
│   ├── Mob.wz/
│   ├── Npc.wz/
│   ├── Reactor.wz/
│   ├── Skill.wz/
│   ├── Sound.wz/
│   ├── String.wz/
│   └── TamingMob.wz/
```

### 2. Build and Launch Containers
Run the following command at the root of the project to compile the Java classes and start the services:
```bash
docker compose up --build -d
```

### 3. Database Seeding
The database container (`biosms-db`) is configured to automatically import the clean vanilla SQL database dumps inside the `./SQL` directory when it initializes for the first time. No manual SQL import is needed!

---

## ⚙️ Server Configuration

Configurations are stored as properties files under `configs/`:

*   **`configs/db.properties`** — Controls database connection details. In the Docker container, it automatically connects to `jdbc:mysql://db:3306/biosms` with username `root` and password `root`.
*   **`configs/login.properties`** — Controls login server behaviors (port 8484, custom welcome messages, and rate limits).
*   **`configs/channel.properties`** — Controls channel configurations (XP rates, drop rates, meso rates, and port bindings).
    *   *Default Rates:*
        *   `net.sf.odinms.world.exp=1` (Vanilla 1x Exp)
        *   `net.sf.odinms.world.meso=1` (Vanilla 1x Mesos)
        *   `net.sf.odinms.world.drop=1` (Vanilla 1x Drops)

---

## 👑 Game Master (GM) Commands

Administrators and GMs can execute commands in-game by typing them in the chat box preceded by a `!`. Below is a comprehensive list of vanilla commands supported by BiosMS:

| Command | Arguments | Description | Example |
|---|---|---|---|
| **`!item`** | `<item_id> [quantity]` | Spawns specified item in player inventory. | `!item 2000000 100` (100 Red Potions) |
| **`!map`** | `<map_id>` | Teleports the player to the specified Map ID. | `!map 100000000` (Henesys Town) |
| **`!spawn`** | `<mob_id> [quantity]` | Spawns monsters on the current map layer. | `!spawn 100100 10` (10 Snails) |
| **`!killall`** | *None* | Kills all monsters currently spawned on the map. | `!killall` |
| **`!notice`** | `<message>` | Broadcasts a blue system message notice to all worlds. | `!notice Welcome to BiosMS!` |
| **`!ban`** | `<char_name> <reason>` | Bans a character and blocks their IP address. | `!ban Cheater1 Exploiting bug` |
| **`!unban`** | `<char_name>` | Removes ban record for specified character. | `!unban Player2` |
| **`!mute`** | `<char_name>` | Prevents player from typing in general/party chat. | `!mute SpamPlayer` |
| **`!level`** | `<level_number>` | Instantly sets your character to the target level. | `!level 120` |
| **`!job`** | `<job_id>` | Changes your character class to the specified Job ID. | `!job 200` (Magician 1st Job) |
| **`!mesos`** | `<amount>` | Adds mesos to your character wallet. | `!mesos 99999999` (99.9M mesos) |

---

## 💻 Local Development (Without Docker)

If you wish to compile and debug the server locally without containers:

### 1. Compile the Project
Make sure you have Java 8 JDK and Maven installed. Run:
```bash
mvn clean package
```
This compiles the Java source files inside `./src` into `./target/classes` and bundles dependencies.

### 2. Configure Properties
Update `configs/db.properties` to match your local MySQL 5.7 database installation:
```properties
url=jdbc:mysql://127.0.0.1:3306/biosms?user=root&password=YOUR_PASSWORD
```

### 3. Launch Services
Run the shell scripts (for Linux/macOS) or batch files (for Windows) in order:
```bash
# Terminal 1: Launch World Server
./launch_world.sh 0

# Terminal 2: Launch Login Server
./launch_login.sh

# Terminal 3: Launch Channel Server
./launch_channel.sh 0
```
