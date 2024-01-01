load('nashorn:mozilla_compat.js');
/*
* @autor Java / Jvaple
* LeaderMS MapleStory Private Server
* HenesysPQ
*/

var status = 0;
var PQItems = new Array(4001095, 4001096, 4001097, 4001098, 4001099, 4001100, 4001101, 4001101);

importPackage(Packages.client);

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (status >= 0 && mode == 0) {
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
                var eim = cm.getPlayer().getEventInstance(); 
		if(cm.getChar().getMapId()==910010300){
			if (status==0) {
				cm.sendNext("Que sorte a sua hein? Tente novamente mais tarde.");			
			}else if (status == 1){
                                for (var i = 0; i < PQItems.length; i++) {
				cm.removeAll(PQItems[i]);
                                }
				cm.warp(100000200);
				cm.dispose();
			}
		} if(cm.getChar().getMapId()== 910010200){
			if (status==0) {
				cm.sendNext("Deseja mesmo sair? Lembrando que nao pode voltar.");				
			}else if (status == 1){
                                for (var i = 0; i < PQItems.length; i++) {
				cm.removeAll(PQItems[i]);
                                 }
				 eim.leftParty(cm.getPlayer());
				 cm.dispose();
			}
		} else if (cm.getPlayer().getMapId() == 910010100) {
			if (status == 0) {
				cm.sendYesNo("Gostaria de ir para #rPig Town#k? E uma cidade onde os porcos estao em toda parte, voce pode encontrar alguns itens valiosos la!");
			} else if (status == 1) {
				cm.mapMessage("Voce foi levado para PigTown.");
				var em = cm.getEventManager("PigTown");
				if (em == null) {
					cm.sendOk("Evento nao esta indisponivel.");
					cm.dispose();
				}
				else {
					em.startInstance(cm.getParty(),cm.getChar().getMap());
					party = cm.getChar().getEventInstance().getPlayers();
				}
				cm.dispose();
			}
		}
	}
}	