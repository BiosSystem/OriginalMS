# OriginalMS v62 Deep Gap Analysis & Security Audit

This document serves as the master blueprint for resolving all incomplete feature claims and critical vulnerabilities discovered during the deep AST-level audit of the OriginalMS codebase.

## 1. Feature Parity Gaps

### Monster Carnival PQ (CPQ)
**Status:** Incomplete (Stubbed)
**Details:** The event script `scripts/event/MonsterCarnivalPQ.js` handles map transfers and lobby queuing but lacks the core game loop. The Java `MonsterCarnival` class exists but is detached from the script.
**Required Fix:** 
- Implement CP-based mob spawning and debuff mechanics.
- Bind Java packet dispatchers (CP update packets) to the JavaScript engine.
- Implement win/loss rank calculations and Spiegelette NPC rewards.

### Pirate Skill Formulas
**Status:** Incomplete
**Details:** Skill constants exist in `Pirate.java` and `Brawler.java`, but the battle engine does not decode charge-time packets for Brawler skills.
**Required Fix:**
- Add packet decoding for `Corkscrew Blow` (5101004) charge states in `AbstractDealDamageHandler.java`.
- Implement Energy Charge gauge UI updates and buff stats.

### Pet Loot Mechanics
**Status:** Bugged / Hacky
**Details:** `PetLootHandler.java` hardcodes Meso Magnet (1812000) checks and explicitly blocks pets from looting items dropped by the owner. Item Pouch (1812001) logic is missing.
**Required Fix:**
- Refactor the handler to properly resolve equipped pet accessories (Meso Magnet, Item Pouch) dynamically.
- Remove the `mapitem.getDropper() != c.getPlayer()` restriction to allow pets to loot the player's own items.

## 2. Security Vulnerabilities

### Trade Window Duplication (Race Condition)
**Status:** Critical
**Details:** `MapleTrade.completeTrade()` lacks thread synchronization. Simultaneous `CONFIRM (0x10)` packets duplicate items.
**Required Fix:**
- Introduce a synchronized lock block on both `local` and `partner` trade session objects before executing `complete1()` and `complete2()`.

### Storage Meso Overflow (Denial of Service)
**Status:** Critical
**Details:** Withdrawing/Depositing `Integer.MIN_VALUE` mesos forces an unchecked arithmetic rollover in `StorageHandler.java`, triggering an intentional `RuntimeException` that drops the client connection.
**Required Fix:**
- Implement strict upper/lower bound checks on `meso` input (must be > 0 and <= 2,147,483,647) before processing arithmetic.

### Inventory Drop Cast Duplication
**Status:** High
**Details:** `ItemMoveHandler.java` lacks a mutex lock around `MapleInventoryManipulator.drop()`. Macro-speed drops can spawn multiple map objects before the inventory array is updated.
**Required Fix:**
- Add `synchronized (c.getPlayer().getInventory(type))` around the drop execution block.

### Thread Pool Exhaustion (Memory Leak)
**Status:** Medium
**Details:** `MapleMap.java` instantiates a new `TimerManager` delayed execution thread for every single item/meso dropped by a dying boss.
**Required Fix:**
- Aggregate boss drops into a single delayed loop payload rather than spinning 50+ concurrent runnables.

## 3. Prioritized Repair Sequence

1. **Security Patch 1:** Lock the `MapleTrade` completion sequence to prevent economy destruction.
2. **Security Patch 2:** Sanitize `StorageHandler` bounds to prevent DoS crashes.
3. **Security Patch 3:** Add inventory locks to `ItemMoveHandler`.
4. **Mechanics Patch 1:** Rewrite `PetLootHandler.java` to support standard GMS looting rules.
5. **Mechanics Patch 2:** Implement Corkscrew Blow charge packets and Energy Charge.
6. **Feature Patch 1:** Build the Monster Carnival PQ engine.
