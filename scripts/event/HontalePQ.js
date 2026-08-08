load('nashorn:mozilla_compat.js');
/* 
 * Horntail Party Quest Event Script
 */

importPackage(java.lang);
importPackage(Packages.world);
importPackage(Packages.client);
importPackage(Packages.server.maps);

var exitMap;
var instanceId;
var minPlayers = 1;

function init() {
    instanceId = 1;
}

function monsterValue(eim, mobId) {
    if (mobId == 8810003) {
        eim.setProperty("leftWingKilled", "true");
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            party.get(i).getClient().getSession().write(MaplePacketCreator.serverNotice(6, "Horntail's Left Wing has been destroyed!"));
        }
    } else if (mobId == 8810004) {
        eim.setProperty("rightWingKilled", "true");
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            party.get(i).getClient().getSession().write(MaplePacketCreator.serverNotice(6, "Horntail's Right Wing has been destroyed!"));
        }
    } else if (mobId == 8810007) {
        var party = eim.getPlayers();
        for (var i = 0; i < party.size(); i++) {
            party.get(i).getClient().getSession().write(MaplePacketCreator.serverNotice(6, "Horntail has been defeated! Victory!"));
        }
    }
    return 1;
}

function setup() {
    instanceId = em.getChannelServer().getInstanceId();
    exitMap = em.getChannelServer().getMapFactory().getMap(240050500);
    var instanceName = "HontalePQ" + instanceId;
    var eim = em.newInstance(instanceName);
    var mf = eim.getMapFactory();
    em.getChannelServer().addInstanceId();
    var firstPortal = eim.getMapInstance(240050100).getPortal("in00");
    firstPortal.setScriptName("hontale_BtoB1");
    eim.setProperty("bulbWay", 0);
    eim.setProperty("leftWingKilled", "false");
    eim.setProperty("rightWingKilled", "false");
    eim.schedule("timeOut", 60000 * 30);
    eim.schedule("broadcastClock", 1500);
    eim.setProperty("entryTimestamp", System.currentTimeMillis() + (30 * 60000));
    var tehwat = Math.random() * 3;
    if (tehwat > 1) {
        eim.setProperty("theWay", "darkness");
    } else {
        eim.setProperty("theWay", "light");
    }
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(240050100);
    player.changeMap(map, map.getPortal(0));
    player.getClient().getSession().write(MaplePacketCreator.getClock((Long.parseLong(eim.getProperty("entryTimestamp")) - System.currentTimeMillis()) / 1000));
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
            playerExit(eim, player);
        }
    }
}

function leftParty(eim, player) {
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
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function allMonstersDead(eim) {
}

function cancelSchedule() {
}

function timeOut(eim) {
    if (eim != null) {
        if (eim.getPlayerCount() > 0) {
            var pIter = eim.getPlayers().iterator();
            while (pIter.hasNext()) {
                playerExit(eim, pIter.next());
            }
        }
        eim.dispose();
    }
}

function playerClocks(eim, player) {
    if (player.getMap().hasTimer() == false) {
        player.getClient().getSession().write(MaplePacketCreator.getClock((Long.parseLong(eim.getProperty("entryTimestamp")) - System.currentTimeMillis()) / 1000));
    }
}

function playerTimer(eim, player) {
    if (player.getMap().hasTimer() == false) {
        player.getMap().setTimer(true);
    }
}

function broadcastClock(eim) {
    if (eim != null) {
        if (eim.getPlayerCount() > 0) {
            var pIter = eim.getPlayers().iterator();
            while (pIter.hasNext()) {
                var player = pIter.next();
                playerClocks(eim, player);
                playerTimer(eim, player);
            }
        }
        eim.schedule("broadcastClock", 1600);
    }
}
