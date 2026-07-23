load('nashorn:mozilla_compat.js');
/*
 * OriginalMS - Papulatus Boss Event Script
 * Map 220080001: Deep Inside the Clocktower
 * Mob 8500001: Papulatus Clock (Phase 1)
 * Mob 8500002: Papulatus (Phase 2)
 */

importPackage(Packages.world);
importPackage(Packages.client);
importPackage(Packages.server.maps);
importPackage(java.lang);

var exitMap;
var minPlayers = 1;

function init() {
}

function setup(eim) {
    exitMap = em.getChannelServer().getMapFactory().getMap(220080000);
    eim.setProperty("canEnter", "true");
    eim.setProperty("entryTimestamp", System.currentTimeMillis());
    eim.setProperty("papulatusSpawned", "false");
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(220080001);
    player.changeMap(map, map.getPortal(0));
}

function playerRevive(eim, player) {
    player.setHp(500);
    player.setStance(0);
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, exitMap.getPortal(0));
    var party = eim.getPlayers();
    if (party.size() < minPlayers) {
        end(eim, "There are not enough players remaining. The battle is over.");
    }
    return false;
}

function playerDead(eim, player) {
}

function playerDisconnected(eim, player) {
    var party = eim.getPlayers();
    if (party.size() < minPlayers) {
        end(eim, "There are not enough players remaining. The battle is over.");
    }
}

function monsterValue(eim, mobId) {
    if (mobId == 8500001) {
        // Phase 1 dead -> Spawn Phase 2 Papulatus
        var map = eim.getMapInstance(220080001);
        if (map != null) {
            var mob = MapleLifeFactory.getMonster(8500002);
            map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(0, 180));
        }
    } else if (mobId == 8500002) {
        // Phase 2 dead -> Victory!
        var party = eim.getPlayers();
        var iter = party.iterator();
        while (iter.hasNext()) {
            var pl = iter.next();
            pl.getClient().getSession().write(MaplePacketCreator.serverNotice(6, "Papulatus has been defeated! Congratulations!"));
        }
    }
    return -1;
}

function leftParty(eim, player) {
}

function disbandParty(eim) {
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, exitMap.getPortal(0));
    var party = eim.getPlayers();
    if (party.size() < minPlayers) {
        end(eim, "There are no longer enough players to continue.");
    }
}

function end(eim, msg) {
    var iter = eim.getPlayers().iterator();
    while (iter.hasNext()) {
        var player = iter.next();
        player.getClient().getSession().write(MaplePacketCreator.serverNotice(6, msg));
        eim.unregisterPlayer(player);
        if (player != null) {
            player.changeMap(exitMap, exitMap.getPortal(0));
        }
    }
    eim.dispose();
}

function removePlayer(eim, player) {
    eim.unregisterPlayer(player);
    player.getMap().removePlayer(player);
    player.setMap(exitMap);
}

function clearPQ(eim) {
    end(eim, "The Papulatus fight has ended.");
}

function finish(eim) {
    var iter = eim.getPlayers().iterator();
    while (iter.hasNext()) {
        var player = iter.next();
        eim.unregisterPlayer(player);
        player.changeMap(exitMap, exitMap.getPortal(0));
    }
    eim.dispose();
}

function allMonstersDead(eim) {
}

function cancelSchedule() {
}

function timeOut() {
}
