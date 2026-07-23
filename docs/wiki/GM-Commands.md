# GM Commands Reference

Commands can be typed directly into the in-game chat bar. Player commands start with `@` or `!`. GM commands require GM level 2+.

## Player Commands (GM Level 0)

| Command | Usage | Description |
|---|---|---|
| `@commands` | `@commands` | Displays all available player commands. |
| `@gm` | `@gm <message>` | Sends a direct help message to online GMs. |
| `@dispose` | `@dispose` | Resets player NPC interaction state if stuck. |
| `@partyfix` | `@partyfix` | Resets party state if party creation errors occur. |
| `@event` | `@event` | Warps the player to the active event map. |
| `@leaveevent` | `@leaveevent` | Exits the event map and returns to previous location. |
| `@smega` | `@smega` | Toggles super megaphone display. |
| `@bugs` | `@bugs <report>` | Submits a bug report to server admins. |

## Game Master Commands (GM Level 2+)

| Command | Usage | Description |
|---|---|---|
| `!notice` | `!notice [m/w/p] <message>` | Broadcasts a server notice or scrolling banner. |
| `!ban` | `!ban <character> [reason]` | Permanently bans account, IP, and MAC address. |
| `!tempban` | `!tempban <character> <time>` | Temporarily bans account for specified duration. |
| `!warp` | `!warp <character> [mapid]` | Warps yourself to a player or map. |
| `!warphere` | `!warphere <character>` | Warps a player to your current coordinates. |
| `!map` | `!map <mapid>` | Warps directly to map ID. |
| `!jail` | `!jail <character>` | Teleports player to the jail map. |
| `!dc` | `!dc <character>` | Disconnects player session. |
| `!droprate` | `!droprate <multiplier>` | Adjusts channel drop rate in real-time. |
| `!bossdroprate` | `!bossdroprate <multiplier>` | Adjusts boss drop rate multiplier. |
| `!exprate` | `!exprate <multiplier>` | Adjusts channel EXP rate multiplier. |
| `!cleardrops` | `!cleardrops` | Clears all dropped items on current map. |
| `!spawn` | `!spawn <mobid> [count]` | Spawns specified monster on current map. |
