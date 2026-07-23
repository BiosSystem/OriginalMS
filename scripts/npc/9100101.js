load('nashorn:mozilla_compat.js');
/*
 * OriginalMS - Ellinia Gachapon (NPC 9100101)
 */

var common = Array(2000002, 2000003, 2022000, 2040700, 2040701, 2040704, 1002008, 1002014, 1050003, 1051001);
var normal = Array(2040702, 2040703, 2040705, 1072005, 1082008, 1372005, 1382005, 1382009);
var rare = Array(2049100, 1372017, 1382016, 1082149, 1002723);

function getRandom(min, max) {
    if (min > max) return -1;
    if (min == max) return min;
    return min + parseInt(Math.random() * (max - min + 1));
}

function start() {
    if (cm.haveItem(5220000)) {
        cm.sendYesNo("I see you have a Gachapon Ticket! Would you like to try your luck at the Ellinia Gachapon?");
    } else {
        cm.sendSimple("Welcome to the Ellinia Gachapon! How can I help you?\r\n\r\n#L0#What is Gachapon?#l\r\n#L1#Where can I get Gachapon Tickets?#l");
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
