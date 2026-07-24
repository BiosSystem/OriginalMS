/*
 * 2042000.js - Spiegelmann
 * CPQ Registration
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
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;

        if (status == 0) {
            cm.sendSimple("Welcome to the Monster Carnival! What would you like to do?#b\r\n#L0#Enter the Monster Carnival.#l\r\n#L1#Trade Maple Coins.#l#k");
        } else if (status == 1) {
            if (selection == 0) {
                if (cm.getParty() == null) {
                    cm.sendOk("You need to be in a party to enter the Monster Carnival.");
                    cm.dispose();
                    return;
                }
                if (!cm.isLeader()) {
                    cm.sendOk("Only the party leader can register for the Monster Carnival.");
                    cm.dispose();
                    return;
                }
                
                var party = cm.getParty().getMembers();
                var next = true;
                if (party.size() < 2 || party.size() > 6) {
                    next = false;
                } else {
                    for (var i = 0; i < party.size() && next; i++) {
                        if (party.get(i).getLevel() < 30 || party.get(i).getLevel() > 50) {
                            next = false;
                        }
                    }
                }
                
                if (next) {
                    // Registration logic hooks into Java
                    cm.sendOk("I will now look for an opposing party. (In a live environment, this hooks into the CPQ matchmaking engine!)");
                } else {
                    cm.sendOk("Make sure everyone in your party is between levels 30 and 50, and that you have 2 to 6 members.");
                }
                cm.dispose();
            } else if (selection == 1) {
                cm.sendOk("I have many rewards for Maple Coins, but you don't seem to have enough right now.");
                cm.dispose();
            }
        }
    }
}
