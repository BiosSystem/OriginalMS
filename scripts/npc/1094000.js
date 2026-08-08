/*
 * Guen - 1094000
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
            cm.sendNext("Welcome to my shop!");
        } else if (status == 1) {
            cm.openShop(1094000);
            cm.dispose();
        }
    }
}
