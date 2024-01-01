load('nashorn:mozilla_compat.js');
/* 	Cody
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
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			cm.sendOK("Ola #e#h ##n.\r\nEu sou o Cody, prazer em conhece-lo!");
			cm.dispose();
			return;
		}
	}
}	