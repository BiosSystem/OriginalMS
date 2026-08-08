/*
 * 1090000 - Kyrin
 * Pirate Job Advancement (Fast-Track)
 * OriginalMS v62 Scripting Project
 */

importPackage(Packages.client);

var status = 0;
var job;

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
            if (cm.getJob().equals(MapleJob.BEGINNER)) {
                if (cm.getLevel() >= 10 && cm.getPlayer().getDex() >= 20) {
                    cm.sendNext("You seem to have what it takes. Do you want to become a #rPirate#k?");
                } else {
                    cm.sendOk("Train a bit more. You need to be Level 10 and have at least 20 DEX to become a Pirate.");
                    cm.dispose();
                }
            } else if (cm.getJob().getId() == 500) { // Pirate
                if (cm.getLevel() >= 30) {
                    cm.sendSimple("You're ready for your 2nd Job Advancement. Which path will you choose?#b\r\n#L0#Brawler#l\r\n#L1#Gunslinger#l#k");
                } else {
                    cm.sendOk("You need to be at least Level 30 to take the next step.");
                    cm.dispose();
                }
            } else if (cm.getJob().getId() == 510 || cm.getJob().getId() == 520) { // Brawler / Gunslinger
                if (cm.getLevel() >= 70) {
                    cm.sendNext("You've grown incredibly strong. Are you ready for your 3rd Job Advancement?");
                } else {
                    cm.sendOk("You need to be at least Level 70 to take the next step.");
                    cm.dispose();
                }
            } else if (cm.getJob().getId() == 511 || cm.getJob().getId() == 521) { // Marauder / Outlaw
                if (cm.getLevel() >= 120) {
                    cm.sendNext("You have mastered the seas! Are you ready for your 4th and final Job Advancement?");
                } else {
                    cm.sendOk("You need to be at least Level 120 to take the next step.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("May the wind guide your sails, Captain!");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.getJob().equals(MapleJob.BEGINNER)) {
                cm.changeJob(MapleJob.PIRATE);
                cm.gainItem(1482000, 1); // Knuckle
                cm.gainItem(1492000, 1); // Gun
                cm.gainItem(2330000, 500); // Bullets
                cm.sendOk("You are now a Pirate! I've given you some basic equipment to start your journey.");
                cm.dispose();
            } else if (cm.getJob().getId() == 500) {
                if (selection == 0) {
                    cm.changeJob(MapleJob.BRAWLER);
                    cm.sendOk("You are now a Brawler! Rely on your fists and inner strength.");
                } else if (selection == 1) {
                    cm.changeJob(MapleJob.GUNSLINGER);
                    cm.sendOk("You are now a Gunslinger! Rely on your speed and accuracy.");
                }
                cm.dispose();
            } else if (cm.getJob().getId() == 510) {
                cm.changeJob(MapleJob.MARAUDER);
                cm.sendOk("You are now a Marauder!");
                cm.dispose();
            } else if (cm.getJob().getId() == 520) {
                cm.changeJob(MapleJob.OUTLAW);
                cm.sendOk("You are now an Outlaw!");
                cm.dispose();
            } else if (cm.getJob().getId() == 511) {
                cm.changeJob(MapleJob.BUCCANEER);
                cm.sendOk("You are now a Buccaneer! The true ruler of the seas.");
                cm.dispose();
            } else if (cm.getJob().getId() == 521) {
                cm.changeJob(MapleJob.CORSAIR);
                cm.sendOk("You are now a Corsair! The true ruler of the seas.");
                cm.dispose();
            }
        }
    }
}
