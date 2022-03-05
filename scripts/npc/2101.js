load('nashorn:mozilla_compat.js');
/* Author: Xterminator
	NPC Name: 		Heena
	Map(s): 		Maple Road : Lower level of the Training Camp (2)
	Description: 		Takes you outside of Training Camp
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
		if (status >= 0 && mode == 0) {
			cm.sendOk("Voce ainda nao terminou o programa de treinamento ainda? Se voce quer deixar este lugar, por favor, nao tenha medo em me dizer.");
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			cm.sendYesNo("Terminou tudo que tinha ha terminar? Se voce quiser ir, eu vou lhe enviar a para o campo de treinamento...");
		} else if (status == 1) {
			cm.sendNext("Entao, boa sorte!");
		} else if (status == 2) {
			cm.warp(3, 0);
			cm.dispose();
		}
	}
}