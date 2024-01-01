# Contributing to OriginalMS

This is a private server project. External contributions are not accepted at this time.

## Internal Development Notes

### Repository Owner

BiosSystem - https://github.com/BiosSystem

### Attribution

OriginalMS is based on [OdinMS](https://github.com/erikdesjardins/OdinMS) by Patrick Huy, Matthias Butz, and Jan Christian Meyer. See [CREDITS.md](CREDITS.md) for full upstream attribution.

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Active Docker build (Java 8 + Maven + Docker Compose) |
| `classic` | Historical - pre-Docker shell script setup (frozen) |

### Commit Guidelines

- Author identity: `BiosSystem`
- Plain imperative messages: `Add CPQ2 mob pool`, `Fix steal skill item drop`, `Implement Maker recipe table`
- No `feat:` / `fix:` / `chore:` prefixes
- No AI signatures

### Development Workflow

```bash
# Build and run full stack
docker compose up --build -d

# Tail logs
docker compose logs -f

# Rebuild after source change
docker compose up --build -d world channel login
```

### Scope Policy

GMS v62 vanilla only. Never add:
- Post-v62 content (Star Force, Potentials, Pink Bean, Dual Blade)
- Custom boss rushes or non-vanilla events
- Any class not present in GMS v62
