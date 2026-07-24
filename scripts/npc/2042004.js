var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            cm.sendSimple("Hi! I'm Spiegelette. If you have any #bMaple Coins#k from the Monster Carnival, I can trade them for some special items!\r\n#b#L0#Spiegelmann's Necklace (50 Coins)#l");
        } else if (status == 1) {
            if (selection == 0) {
                if (cm.haveItem(4001129, 50)) {
                    if (cm.canHold(1122007)) {
                        cm.gainItem(4001129, -50);
                        cm.gainItem(1122007, 1);
                        cm.sendOk("Enjoy your new necklace!");
                    } else {
                        cm.sendOk("Please make sure you have enough room in your equip inventory.");
                    }
                } else {
                    cm.sendOk("You don't have enough Maple Coins.");
                }
                cm.dispose();
            }
        }
    }
}
