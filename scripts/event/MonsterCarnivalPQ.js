load('nashorn:mozilla_compat.js');
importPackage(Packages.world);
importPackage(Packages.client);
importPackage(Packages.server.maps);
importPackage(java.lang);

function init() {
}

function setup(eim) {
    // The EventInstanceManager already has MonsterCarnival injected from Java.
    // We just need to schedule the timers.
    eim.startEventTimer(10 * 60 * 1000); // 10 minutes
    eim.schedule("complete", 10 * 60 * 1000 - 10000);
    eim.schedule("timeOut", 10 * 60 * 1000);
    return eim;
}

function playerEntry(eim, player) {
    // players are warped by MonsterCarnival.java constructor already
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
    var mc = eim.getMonsterCarnival();
    if (mc != null) {
        mc.playerDisconnected(player.getId());
    }
}

function leftParty(eim, player) {
    var mc = eim.getMonsterCarnival();
    if (mc != null) {
        mc.leftParty(player.getId());
    }
}

function disbandParty(eim) {
    var mc = eim.getMonsterCarnival();
    if (mc != null) {
        mc.earlyFinish();
    }
}

function playerExit(eim, player) {
}

function removePlayer(eim, player) {
}

function clearPQ(eim) {
}

function timeOut(eim) {
    var mc = eim.getMonsterCarnival();
    if (mc != null) {
        mc.timeUp();
    }
}

function complete(eim) {
    var mc = eim.getMonsterCarnival();
    if (mc != null) {
        mc.complete();
    }
}
