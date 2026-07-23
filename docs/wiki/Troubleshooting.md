# Troubleshooting Guide

## Client Connections

### "Unable to connect to the game server"
1. Verify that Docker or OriginalMS Java process is running.
2. Confirm port `8484` is open and listening (`netstat -an | findstr 8484`).
3. Ensure your v62 `localhost.exe` IP is set to `127.0.0.1`.

### Empty Dialogue Windows on NPC Click
If clicking an NPC produces an empty dialogue window, check `docker compose logs` for missing script warnings. Ensure all scripts under `scripts/npc/` exist.

## Database Issues

### "Table 'biosms.accounts' doesn't exist"
Ensure `SQL/BiosMS.sql` was properly imported on database initialization.

---

*Need more help? Report issues on our [GitHub Issues](https://github.com/BiosSystem/OriginalMS/issues) page.*
