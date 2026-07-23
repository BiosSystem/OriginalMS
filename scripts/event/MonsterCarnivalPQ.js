load('nashorn:mozilla_compat.js');
/*
 * OriginalMS - Monster Carnival PQ Event Script
 * Map Range: 980000001 - 980000006 (CPQ1), 980031xxx (CPQ2)
 * Lobby: 980000000
 */

importPackage(Packages.world);
importPackage(Packages.client);
importPackage(Packages.server.maps);
importPackage(java.lang);

var exitMap;
var minPlayers = 2;

function init() {
}

function setup(eim) {
    exitMap = em.getChannelServer().getMapFactory().getMap(980000000);
    eim.setProperty("canEnter", "true");
    eim.setProperty("redCP", "0");
    eim.setProperty("blueCP", "0");
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(980000001);
    player.changeMap(map, map.getPortal(0));
}

function playerRevive(eim, player) {
    player.setHp(500);
    player.setStance(0);
    var map = player.getMap();
    player.changeMap(map, map.getPortal(0));
    return true;
}

function playerDead(eim, player) {
}

function playerDisconnected(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, exitMap.getPortal(0));
    var party = eim.getPlayers();
    if (party.size() < minPlayers) {
        end(eim, "Not enough players remaining. Monster Carnival has ended.");
    }
}

function monsterValue(eim, mobId) {
    return 1;
}

function leftParty(eim, player) {
    playerExit(eim, player);
}

function disbandParty(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, exitMap.getPortal(0));
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
    end(eim, "Monster Carnival has concluded!");
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
    end(eim, "Time is up! Monster Carnival match completed.");
}
