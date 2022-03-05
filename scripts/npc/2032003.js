load('nashorn:mozilla_compat.js');
/* Lira - Zakum Jump Quest NPC 
 * @author Manfred
 * For use with Zakum PQ.
 */
 
//4031062 - Breath of lava

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
			cm.sendOk("Ok. Seems like you don't want the #rBreath of Lava#k...");
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			cm.sendYesNo("By #bLeaderMS#k!!! You finished the most enduring challenge #rAdobis#k has ever set!!! Uhhhhh... want the #rBreath of Lava#k?");
		} else if (status == 1) {
			cm.gainItem(4031062, 1);
			cm.addZakumLevel();
			cm.getPlayer().saveToDB(true, true);
			cm.warp(211042300, 0);
			cm.dispose();
		}
	}
}