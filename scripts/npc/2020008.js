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

/* Tylus
	Warrior 3rd job advancement
	El Nath: Chief's Residence (211000001)
*/


importPackage(Packages.client);

var status = 0;
var minLevel = 70;
var maxLevel = 120;
var minPlayers = 3;
var maxPlayers = 6;
var job;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (mode == 0 && status == 0) {
			cm.sendOk("Decida e depois e me visite novamente.");
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			if (cm.getQuestStatus(6192).equals(Packages.client.MapleQuestStatus.Status.STARTED)) {
					if (cm.getParty() == null) { // no party
						cm.sendOk("Por favor, fale comigo de novo depois de ter formado um grupo.");
						cm.dispose();
						return;
					}
					if (!cm.isLeader()) { // not party leader
						cm.sendOk("Por favor, peca ao seu lider para falar comigo.");
						cm.dispose();
					} else {
						// Check teh partyy
						var party = cm.getParty().getMembers();
						var mapId = cm.getChar().getMapId();
						var next = true;
						var levelValid = 0;
						var inMap = 0;
						// Temp removal for testing
						if (party.size() < minPlayers || party.size() > maxPlayers) 
							next = false;
						else {
							for (var i = 0; i < party.size() && next; i++) {
								if ((party.get(i).getLevel() >= minLevel) && (party.get(i).getLevel() <= maxLevel))
									levelValid += 1;
								if (party.get(i).getMapid() == mapId)
									inMap += 1;
							}
							if (levelValid < minPlayers || inMap < minPlayers)
								next = false;
						}
						if (next) {
							// Kick it into action.  Slate says nothing here, just warps you in.
							var em = cm.getEventManager("ElnathPQ");
							if (em == null) {
								cm.sendOk("unavailable");
								cm.dispose();
							}
							else {
								// Begin the PQ.
								var eim = em.startInstance(cm.getParty(),cm.getChar().getMap());
								cm.dispose();
							}
							cm.dispose();
						}
						else {
							cm.sendOk("Seu grupo nao contem de três para seis membros. Certifique-se de todos os seus membros estejam presentes e qualificados para participar nesta missao. Eu vejo#b" + levelValid.toString() + " #kmembros estao no nivel certo, e #b" + inMap.toString() + "#k estao em meu mapa. Se isso parece errado, #bsair e voltar,#k ou reformar o grupo.");
							cm.dispose();
						}
					}
					cm.dispose();
				}
			else if (!(cm.getJob().equals(MapleJob.PAGE) || cm.getJob().equals(MapleJob.FIGHTER) || cm.getJob().equals(MapleJob.SPEARMAN))) {
				if ((cm.getJob().equals(MapleJob.WHITEKNIGHT) || cm.getJob().equals(MapleJob.CRUSADER) || cm.getJob().equals(MapleJob.SPEARMAN)) && cm.getLevel() >= 120) {
					cm.sendOk("Por favor, va visitar #bHarmonia#k. Ela reside em #bLeafre#k.");
					cm.dispose();
					return;
				} else {
					cm.sendOk("Quer um bebe bom tempo?");
					cm.dispose();
					return;
				}
			}
			if ((cm.getJob().equals(MapleJob.PAGE) || cm.getJob().equals(MapleJob.FIGHTER) || cm.getJob().equals(MapleJob.SPEARMAN)) && cm.getLevel() >= 70 &&  cm.getChar().getRemainingSp() <= (cm.getLevel() - 70) * 3) {
				cm.sendYesNo("Eu sabia que esse dia chegaria eventualmente.\r\n\r\nVoce esta pronto para se tornar muito mais forte?");
			} else if (cm.getQuestStatus(6192).equals(Packages.client.MapleQuestStatus.Status.STARTED) == false) {
				cm.sendOk("O seu tempo ainda esta para vir ...");
				cm.dispose();
			}
		} else if (status == 1) {
			if (cm.getJob().equals(MapleJob.PAGE)) {
				cm.changeJob(MapleJob.WHITEKNIGHT);
				cm.getChar().gainAp(5);
				cm.sendOk("Voce agora e um #bCavaleiro Branco#k.\r\n\r\nAgora va, com orgulho!");
				cm.dispose();
			} else if (cm.getJob().equals(MapleJob.FIGHTER)) {
				cm.changeJob(MapleJob.CRUSADER);
				cm.getChar().gainAp(5);
				cm.sendOk("Voce agora e um #bTemplario#k.\r\n\r\nAgora va, com orgulho!");
				cm.dispose();
			} else if (cm.getJob().equals(MapleJob.SPEARMAN)) {
				cm.changeJob(MapleJob.DRAGONKNIGHT);
				cm.getChar().gainAp(5);
				cm.sendOk("Voce agora e um #bCavaleiro Draconiano#k.\r\n\r\nAgora va, com orgulho!");
				cm.dispose();
			}
		}
	}
}	
