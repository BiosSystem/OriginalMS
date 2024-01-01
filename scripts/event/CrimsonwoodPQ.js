load('nashorn:mozilla_compat.js');
importPackage(Packages.world);
importPackage(Packages.client);
importPackage(Packages.server.maps);
importPackage(Packages.server.life);
importPackage(Packages.tools);
importPackage(java.lang);

/*
 * Crimsonwood Keep Party Quest (CWKPQ)
 * Expedition-based party quest for 5-6 players (level 90+).
 * Crimsonwood Keep maps: 610020000 - 610020900
 *
 * Players must defeat waves of CWK monsters and the boss Vellum/Crimsonwood.
 * Rewards include Marks of the Resistance and CWK equipment drops.
 */

var exitMap;
var instanceId;
var minPlayers = 5;

// CWK monster IDs (dropped by MapleMap.java already for CWK kills)
var cwkMobs = [9400573, 9400574, 9400575, 9400576, 9400577, 9400578,
               9400579, 9400580, 9400581, 9400582, 9400583, 9400584];

function init() {
    instanceId = 1;
    em.setProperty("state", "0");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup() {
    em.setProperty("state", "1");
    exitMap = em.getChannelServer().getMapFactory().getMap(610000000); // Crimsonwood Keep entrance
    var instanceName = "CrimsonwoodPQ" + instanceId;
    var eim = em.newInstance(instanceName);
    var mf = eim.getMapFactory();
    em.getChannelServer().addInstanceId();
    instanceId++;

    var eventTime = 60 * 60000; // 60 minutes
    em.schedule("timeOut", eventTime);
    eim.startEventTimer(eventTime);
    eim.setProperty("stage", "0");

    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(610020000);
    player.changeMap(map, map.getPortal(0));
    player.getClient().getSession().write(
        MaplePacketCreator.serverNotice(6, "[CWKPQ] Welcome to Crimsonwood Keep! Defeat the guardian monsters to proceed.")
    );
}

function playerDead(eim, player) {
}

function playerRevive(eim, player) {
    if (eim.isLeader(player)) {
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            playerExit(eim, party.get(i));
        }
        eim.dispose();
    } else {
        var party = eim.getPlayers();
        if (party.size() <= minPlayers) {
            for (var i = 0; i < party.size(); i++) {
                playerExit(eim, party.get(i));
            }
            eim.dispose();
        } else {
            playerExit(eim, player);
        }
    }
}

function playerDisconnected(eim, player) {
    if (eim.isLeader(player)) {
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            if (party.get(i).equals(player)) {
                removePlayer(eim, player);
            } else {
                playerExit(eim, party.get(i));
            }
        }
        eim.dispose();
    } else {
        var party = eim.getPlayers();
        if (party.size() < minPlayers) {
            for (var i = 0; i < party.size(); i++) {
                playerExit(eim, party.get(i));
            }
            eim.dispose();
        } else {
            removePlayer(eim, player);
        }
    }
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

function removePlayer(eim, player) {
    eim.unregisterPlayer(player);
    player.getMap().removePlayer(player);
    player.setMap(exitMap);
}

function clearPQ(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        // Award Mark of Hero drop logic is handled in MapleMap.java CWK monster kill code
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function allMonstersDead(eim) {
    var stage = parseInt(eim.getProperty("stage"));
    stage++;
    eim.setProperty("stage", "" + stage);
    if (stage >= 3) {
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            party.get(i).getClient().getSession().write(
                MaplePacketCreator.serverNotice(6, "[CWKPQ] Congratulations! You have cleared Crimsonwood Keep!")
            );
        }
        clearPQ(eim);
    }
}

function cancelSchedule() {
}

function timeOut() {
    var iter = em.getInstances().iterator();
    while (iter.hasNext()) {
        var eim = iter.next();
        if (eim.getPlayerCount() > 0) {
            var pIter = eim.getPlayers().iterator();
            while (pIter.hasNext()) {
                playerExit(eim, pIter.next());
            }
        }
        eim.dispose();
    }
}
