load('nashorn:mozilla_compat.js');
/*
 * OriginalMS - Muirhat (NPC 1201005)
 * Ludibrium: Origin of Clocktower (220080000)
 */

function start() {
    cm.sendNext("Greetings, traveler. Deep inside this clocktower lies Papulatus, a monster disrupting the dimensional fabric of Ludibrium. Are you brave enough to confront it?");
}

function action(mode, type, selection) {
    if (mode == 1) {
        if (cm.getPlayer().getLevel() < 100) {
            cm.sendOk("You must be at least level 100 to face Papulatus. Train harder and return when you are ready.");
        } else {
            cm.sendOk("Enter the dimensional rift behind me to face Papulatus. Good luck!");
        }
    }
    cm.dispose();
}
