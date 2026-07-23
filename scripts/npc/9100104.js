load('nashorn:mozilla_compat.js');
/*
 * OriginalMS - Sleepywood Gachapon (NPC 9100104)
 */

var common = Array(2000004, 2000005, 2022005, 2040001, 2040301, 2040801, 1002020, 1040020, 1060020);
var normal = Array(2040003, 2040303, 2040803, 1072020, 1082020, 1302015, 1402008, 1432008);
var rare = Array(2049100, 1302030, 1402020, 1432016, 1442020);

function getRandom(min, max) {
    if (min > max) return -1;
    if (min == max) return min;
    return min + parseInt(Math.random() * (max - min + 1));
}

function start() {
    if (cm.haveItem(5220000)) {
        cm.sendYesNo("I see you have a Gachapon Ticket! Would you like to try your luck at the Sleepywood Gachapon?");
    } else {
        cm.sendSimple("Welcome to the Sleepywood Gachapon! How can I help you?\r\n\r\n#L0#What is Gachapon?#l\r\n#L1#Where can I get Gachapon Tickets?#l");
    }
}

function action(mode, type, selection) {
    if (mode == 1 && cm.haveItem(5220000)) {
        cm.gainItem(5220000, -1);
        var roll = getRandom(1, 100);
        var reward;
        if (roll <= 60) {
            reward = common[getRandom(0, common.length - 1)];
        } else if (roll <= 90) {
            reward = normal[getRandom(0, normal.length - 1)];
        } else {
            reward = rare[getRandom(0, rare.length - 1)];
        }
        cm.gainItem(reward, 1);
        cm.sendOk("You obtained #b#t" + reward + "##k! Enjoy your prize!");
        cm.dispose();
    } else {
        if (mode > 0) {
            if (selection == 0) {
                cm.sendOk("Gachapon is a vending machine game where you insert a Gachapon Ticket to win a random prize ranging from scrolls, potions, equipment, to rare artifacts!");
            } else if (selection == 1) {
                cm.sendOk("Gachapon Tickets can be purchased in the Cash Shop or earned through events and party quests.");
            }
        }
        cm.dispose();
    }
}
