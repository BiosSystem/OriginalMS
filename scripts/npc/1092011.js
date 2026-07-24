/*
 * 1092011 - Morgan
 * Pirate Quest Helper
 * OriginalMS v62 Scripting Project
 */

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status >= 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;

        if (status == 0) {
            if (cm.getLevel() >= 10 && cm.getJob().equals(Packages.client.MapleJob.BEGINNER)) {
                cm.sendNext("Ah, a fresh face! If you're looking to become a Pirate, go speak to Captain Kyrin inside the Navigation Room. She handles all job advancements.");
            } else if (cm.getJob().getId() >= 500 && cm.getJob().getId() <= 522) {
                cm.sendNext("Always keep your weapons clean and your powder dry, pirate.");
            } else {
                cm.sendNext("The Nautilus is open to all visitors, but don't cause any trouble!");
            }
        } else if (status == 1) {
            cm.dispose();
        }
    }
}
