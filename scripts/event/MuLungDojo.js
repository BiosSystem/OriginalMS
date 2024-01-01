load('nashorn:mozilla_compat.js');
importPackage(Packages.world);
importPackage(Packages.client);
importPackage(Packages.server);
importPackage(Packages.server.maps);
importPackage(Packages.server.life);
importPackage(Packages.tools);
importPackage(java.lang);

/*
 * Mu Lung Dojo
 * Solo or party ranking combat event (level 50+).
 * Players fight through 36 floors of increasingly difficult monsters.
 * Dojo lobby map: 925020000
 * Floor maps: 925021000 + (floor - 1) * 100  (floors 1-36)
 * Rankings stored in dojorecord table via eim.saveDojoRecord(player, floor).
 */

var exitMap;
var instanceId;
var minPlayers = 1;

function init() {
    instanceId = 1;
    em.setProperty("state", "0");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup(eim) {
    em.setProperty("state", "1");
    exitMap = em.getChannelServer().getMapFactory().getMap(925020000);
    var instanceName = "MuLungDojo" + instanceId;
    var eim = em.newInstance(instanceName);
    em.getChannelServer().addInstanceId();
    instanceId++;

    eim.setProperty("floor", "1");

    var eventTime = 15 * 60000;
    em.schedule("timeOut", eventTime);
    eim.startEventTimer(eventTime);

    return eim;
}

function playerEntry(eim, player) {
    var floor = parseInt(eim.getProperty("floor"));
    var mapId = 925021000 + (floor - 1) * 100;
    var map = eim.getMapFactory().getMap(mapId);
    player.changeMap(map, map.getPortal(0));
    player.getClient().getSession().write(
        MaplePacketCreator.serverNotice(6, "[Mu Lung Dojo] Floor " + floor + " — Defeat all monsters to advance!")
    );
}

function playerDead(eim, player) {
    var floor = parseInt(eim.getProperty("floor"));
    eim.saveDojoRecord(player, floor);
    playerExit(eim, player);
}

function playerRevive(eim, player) {
    var floor = parseInt(eim.getProperty("floor"));
    eim.saveDojoRecord(player, floor);
    playerExit(eim, player);
    if (eim.getPlayerCount() == 0) {
        eim.dispose();
    }
    return false;
}

function playerDisconnected(eim, player) {
    removePlayer(eim, player);
    if (eim.getPlayerCount() == 0) {
        eim.dispose();
    }
}

function leftParty(eim, player) {
}

function disbandParty(eim) {
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, exitMap.getPortal(0));
}

function removePlayer(eim, player) {
    eim.unregisterPlayer(player);
    player.getMap().removePlayer(player);
    player.setMap(exitMap);
}

function allMonstersDead(eim) {
    var floor = parseInt(eim.getProperty("floor"));

    if (floor >= 36) {
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            var p = party.get(i);
            eim.saveDojoRecord(p, 36);
            MapleInventoryManipulator.addById(p.getClient(), 1132000, (short) 1, "Dojo Clear");
            p.getClient().getSession().write(
                MaplePacketCreator.serverNotice(6, "[Mu Lung Dojo] Congratulations! You cleared all 36 floors!")
            );
        }
        clearPQ(eim);
    } else {
        floor++;
        eim.setProperty("floor", "" + floor);
        var mapId = 925021000 + (floor - 1) * 100;
        var map = eim.getMapFactory().getMap(mapId);
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            party.get(i).changeMap(map, map.getPortal(0));
            party.get(i).getClient().getSession().write(
                MaplePacketCreator.serverNotice(6, "[Mu Lung Dojo] Floor " + floor)
            );
        }
    }
}

function clearPQ(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function cancelSchedule() {
}

function timeOut() {
    var iter = em.getInstances().iterator();
    while (iter.hasNext()) {
        var eim = iter.next();
        if (eim.getPlayerCount() > 0) {
            var floor = parseInt(eim.getProperty("floor"));
            var pIter = eim.getPlayers().iterator();
            while (pIter.hasNext()) {
                var p = pIter.next();
                eim.saveDojoRecord(p, floor);
                playerExit(eim, p);
            }
        }
        eim.dispose();
    }
}
