load('nashorn:mozilla_compat.js');
/*
 * OriginalMS - Ludibrium Gachapon (NPC 9100107)
 */

var common = Array(2000004, 2000005, 2022010, 2040400, 2040500, 2041000, 1002050, 1050050, 1072050);
var normal = Array(2040402, 2040502, 2041002, 1082050, 1102050, 1452012, 1462010, 1472018);
var rare = Array(2049100, 1102082, 1452022, 1462020, 1472030);

function getRandom(min, max) {
    if (min > max) return -1;
    if (min == max) return min;
    return min + parseInt(Math.random() * (max - min + 1));
}

function start() {
    if (cm.haveItem(5220000)) {
        cm.sendYesNo("I see you have a Gachapon Ticket! Would you like to try your luck at the Ludibrium Gachapon?");
    } else {
        cm.sendSimple("Welcome to the Ludibrium Gachapon! How can I help you?\r\n\r\n#L0#What is Gachapon?#l\r\n#L1#Where can I get Gachapon Tickets?#l");
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
