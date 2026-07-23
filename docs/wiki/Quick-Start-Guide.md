# Quick Start Guide

This guide walks you through setting up and running OriginalMS locally using Docker Compose or standalone Java.

## System Requirements

- **OS:** Windows 10/11, Linux (Debian/Ubuntu), or macOS
- **Container Engine:** Docker & Docker Compose v2+
- **Build Tools:** Java 8 JDK & Maven 3.6+
- **Game Client:** Clean MapleStory v62 client patched for localhost

## Step 1 - Clone the Repository

```bash
git clone --branch main https://github.com/BiosSystem/OriginalMS.git
cd OriginalMS
```

## Step 2 - Place WZ Data Files

Extract your v62 client's `.wz` files into the `wz/` folder in the project root:

```
OriginalMS/
├── wz/
│   ├── Character.wz
│   ├── Item.wz
│   ├── Map.wz
│   ├── Mob.wz
│   ├── Npc.wz
│   ├── Quest.wz
│   ├── Skill.wz
│   └── String.wz
```

## Step 3 - Build the Server

```bash
mvn clean package -DskipTests
```

## Step 4 - Launch Stack with Docker Compose

```bash
docker compose up -d
```

Check server startup logs:

```bash
docker compose logs -f originalms
```

When `Listening on port 8484` appears, your server is online!

## Step 5 - Connect Game Client

Point your v62 `localhost.exe` to `127.0.0.1:8484`. Log in with the default admin account:
- **Username:** `admin`
- **Password:** `admin`
