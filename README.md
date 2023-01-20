# OriginalMS - Classic Branch

Vanilla MapleStory v62 (GMS 2008-era) private server emulator - **pre-Docker edition**.

This branch is a snapshot of the server as it existed before Docker and Maven were introduced. It runs using a local Java 8 JDK and three shell scripts. No containers, no build tool - closer to how the original OdinMS community ran servers in the 2008–2012 era.

> **Want to run the server today with minimal setup?**  
> Switch to the [`main` branch](../../tree/main) - it uses `docker compose up --build -d` and is fully self-contained.

---

## What's on this branch

| Path | Purpose |
|---|---|
| `src/` | Full Java source (OdinMS lineage, Java 8) |
| `lib/` | Pre-bundled dependency JARs (MINA, MySQL connector, etc.) |
| `SQL/` | MySQL schema + seed data |
| `scripts/` | JavaScript NPC / quest / event / portal / reactor scripts |
| `launch_world.sh` | Start the World Server |
| `launch_login.sh` | Start the Login Server |
| `launch_channel.sh` | Start a Channel Server |
| `logging.properties` | Java logging config |
| `manifest.mf` | JAR manifest |

No `Dockerfile`, no `docker-compose.yml`, no `pom.xml` on this branch.

---

## Prerequisites

- **Java 8 JDK** - `java` and `javac` and `keytool` all on `PATH`
- **MySQL 5.7+** - running locally
- **MapleStory v62 WZ XML files** - place in `./wz/`
- Linux, macOS, or Git Bash on Windows (for the `.sh` scripts)

---

## Setup

### 1. Import the database

```bash
mysql -u root -p < SQL/BiosMS.sql
```

### 2. Create config files

The launch scripts expect these files in the project root:

**`db.properties`**
```properties
url=jdbc:mysql://127.0.0.1:3306/biosms?user=root&password=YOUR_PASSWORD&autoReconnect=true&characterEncoding=UTF-8
```

**`login.properties`**
```properties
net.sf.odinms.login.serverName=BiosMS
net.sf.odinms.net.login.port=8484
```

**`channel.properties`**
```properties
net.sf.odinms.world.exp=1
net.sf.odinms.world.meso=1
net.sf.odinms.world.drop=1
```

**`recvops.properties` / `sendops.properties`** - copy from the [`main` branch `configs/opcodes/`](../../tree/main/configs/opcodes) - the opcode maps are identical.

### 3. Compile the source

```bash
mkdir -p dist
javac -cp "lib/*" -d dist $(find src -name "*.java")
```

### 4. Place WZ files

```
OriginalMS/
└── wz/
    ├── Character.wz/
    ├── Item.wz/
    ├── Map.wz/
    ├── Mob.wz/
    ├── Npc.wz/
    ├── Skill.wz/
    └── String.wz/
```

### 5. Launch (three separate terminals)

```bash
# Terminal 1
./launch_world.sh 0

# Terminal 2
./launch_login.sh

# Terminal 3
./launch_channel.sh 0
```

The scripts auto-generate a self-signed SSL keystore (`filename.keystore`) on first run using `keytool`.

---

## Connect

Point your v62 client at `127.0.0.1`, port `8484`.

---

## Note on features

This branch represents the server as of **August 2022** - before CPQ2, Mu Lung Dojo, CWKPQ, Maker Skill, Steal, and Party Search were added. For the complete v62 feature set, use the [`main` branch](../../tree/main).
