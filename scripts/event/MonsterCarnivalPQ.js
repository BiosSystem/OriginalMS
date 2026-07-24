/*
 * MonsterCarnivalPQ.js
 * OriginalMS v62 Scripting Project
 */

importPackage(Packages.client);
importPackage(Packages.server);

var returnMap = 980000000;

function init() {
    // Required init method
}

function setup(eim) {
    var mapId = parseInt(eim.getProperty("mapId"));
    var mapFactory = eim.getChannelServer().getMapFactory();
    
    // Instantiate all relevant CPQ maps for this instance
    eim.setProperty("isFinished", "false");
    
    var eventMap = mapFactory.getMap(mapId);
    return eim;
}

function playerEntry(eim, player) {
    var mapId = parseInt(eim.getProperty("mapId"));
    var eventMap = eim.getMapFactory().getMap(mapId);
    player.changeMap(eventMap, eventMap.getPortal(0));
}

function playerRevive(eim, player) {
    // Respawn in CPQ without EXP loss
    var mapId = parseInt(eim.getProperty("mapId"));
    player.addHP(50);
    var eventMap = eim.getMapFactory().getMap(mapId);
    player.changeMap(eventMap, eventMap.getPortal(0));
    return true;
}

function scheduledTimeout(eim) {
    if (eim.getProperty("isFinished").equals("false")) {
        eim.setProperty("isFinished", "true");
        // End of match. In a fully built emulator, the Java engine handles the CP comparison 
        // and throws the win/loss packet. We just warp them out after a delay.
        eim.schedule("warpOut", 10000); 
    }
}

function warpOut(eim) {
    var players = eim.getPlayers();
    var mapFactory = eim.getChannelServer().getMapFactory();
    var exitMap = mapFactory.getMap(returnMap);
    
    for (var i = 0; i < players.size(); i++) {
        players.get(i).changeMap(exitMap, exitMap.getPortal(0));
        players.get(i).setMonsterCarnival(null); // Clear reference
    }
    eim.dispose();
}

function playerDisconnected(eim, player) {
    player.setMap(eim.getChannelServer().getMapFactory().getMap(returnMap));
    player.setMonsterCarnival(null);
    if (eim.getPlayerCount() == 0) {
        eim.dispose();
    }
}

function leftParty(eim, player) {
    playerDisconnected(eim, player);
}

function disbandParty(eim) {
    warpOut(eim);
}

function clearPQ(eim) {
    scheduledTimeout(eim);
}
