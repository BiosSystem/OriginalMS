load('nashorn:mozilla_compat.js');
/*
 * OriginalMS - Papulatus Entrance Portal Script
 * Map: 220080000 -> 220080001
 */

function enter(pi) {
    if (pi.getPlayer().getLevel() < 100) {
        pi.playerMessage(5, "You must be at least level 100 to challenge Papulatus.");
        return false;
    }
    
    var em = pi.getEventManager("PapulatusPQ");
    if (em == null) {
        pi.playerMessage(5, "The Papulatus event manager is currently unavailable.");
        return false;
    }

    var eim = em.getInstance("PapulatusPQ");
    if (eim == null) {
        eim = em.startInstance(pi.getParty(), pi.getMap());
        eim.registerPlayer(pi.getPlayer());
        return true;
    } else {
        pi.playerMessage(5, "Another party is already challenging Papulatus in this channel.");
        return false;
    }
}
