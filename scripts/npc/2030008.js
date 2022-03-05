load('nashorn:mozilla_compat.js');
/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* Adobis
 * 
 * El Nath: The Door to Zakum (211042300)
 * 
 * Zakum Quest NPC 
*/

var status;
var mapId = 211042300;
var tehSelection = -1;

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
			cm.sendSimple("Cuidado, pois o poder de #bLeaderMS#k nao tem sido \r\nesquecido... #b\r\n#L0#Entrar - Desconhecida Minas dos Mortos (Est. 1)#l\r\n#L1#Encare o Breath of Lava (Est. 2)#l\r\n#L2#Criar os Olhos de Fogo (Est. 3)#l");						
		}
		else if (status == 1) {
			tehSelection = selection;
			if (selection == 0) { 
				if (cm.getParty() == null) { 
					cm.sendOk("Por favor, fale comigo depois de ter formado um grupo.");
					cm.dispose();
				}
				else if (!cm.isLeader()) { 
					cm.sendOk("Por favor,peca o lider do seu grupo para falar comigo.");
					cm.dispose();
				}
				else {
					var party = cm.getParty().getMembers();
					var mapId = cm.getChar().getMapId();
					var next = true;
					
					for (var i = 0; i < party.size() && next; i++) {
						if ((party.get(i).getLevel() < 50) || (party.get(i).getMapid() != mapId)) {
							next = false;
						}
					}
					
					if (next) {
						var em = cm.getEventManager("ZakumPQ");
						if (em == null) {
							cm.sendOk("This trial is currently under construction.");
						} else {
							em.startInstance(cm.getParty(), cm.getChar().getMap());
							party = cm.getChar().getEventInstance().getPlayers();
							if (cm.getChar().isGM() == false) {
								cm.removeFromParty(4001015, party);
								cm.removeFromParty(4001018, party);
								cm.removeFromParty(4001016, party);
							}
						}
						cm.dispose();
					}
					else {
						cm.sendNext("Certifique-se de todos os seus membros sao qualificados para comecar meus ensaios ...");
						cm.dispose();
					}
				}
			}
			else if (selection == 1) { //Zakum Jump Quest
				if (cm.getZakumLevel() >= 1) {
					cm.sendYesNo("Gostaria de tentar o desafio mais dificil de sua vida?");
				} else {
					cm.sendOk("Voce deve terminar o #bMina do Mortos#k primeiro.");
					cm.dispose();
				}
			}else if (selection == 2) { //Golden Tooth Collection [4000082]
				if (cm.getZakumLevel() >= 2) {
					if (!cm.haveItem(4000082, 30)) {
						cm.sendOk("Estamos prestes a enfrentar #rZakum#k.Coletar #r30#k #bGold Zombie Teeth#k\r\na partir de #rMinor Zombies#k na #bDead Mine#k. Uma vez que voce tiver feito isso, volte ate mim .\r\n#bBoa sorte#k!");
						cm.dispose();
					} else {
						if (cm.haveItem(4031061, 1) && cm.haveItem(4031062, 1) && cm.haveItem(4000082, 30)) {
							cm.sendNext("Uau, voce fez isso ! Aqui esta o #rEye of Fire#k como recompensa . Basta soltar esse Olho para o #rZakum Altar#k, e #rZakum#k sera invocado.\r\n#rBoa sorte na luta contra ele!#k");
							cm.gainItem(4031061, -1);
							cm.gainItem(4031062, -1);
							cm.gainItem(4000082, -30);
							cm.gainItem(4001017, 1);
							cm.dispose();
						}
					}
				} else {
					cm.sendOk("Por favor, ligue para o #rBreath of Lava#k antes de tentar essa busca.");
					cm.dispose();
				}
			}
		} else if (status == 2) {
			if (tehSelection == 1) {
					cm.warp(280020000, 0);
					cm.dispose();
			}
		}
	}
}