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

/* Athena Pierce
	Bowman Job Advancement
	Victoria Road : Bowman Instructional School (100000201)

	Custom Quest 100000, 100002
*/

importPackage(Packages.client);
importPackage(Packages.tools);

var status = 0;
var job;
var pnpc = -1;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (mode == 0 && status == 2) {
			cm.sendOk("Decida e depois e me visite novamente.");
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			if (cm.getJob().equals(MapleJob.BEGINNER)) {
				if (cm.getLevel() >= 10 && cm.getPlayer().getDex() >= 25)
					cm.sendNext("Entao voce decidiu se tornar um #rArqueiro#k?");
				else {
					cm.sendOk("Treine um pouco mais para que eu possa mostrar-lhe o caminho de um #rArqueiro#k.")
					cm.dispose();
				}
			} else if (cm.getPlayer().getLevel() >= 200 && cm.getPlayer().getJob().isA(MapleJob.BOWMAN)) {
					cm.sendYesNo("Uau, voce ja atingiu o moximo de seu potencial. Voce gostaria de ter um NPC jogador representar o seu poder?");
					pnpc = 1;
			} else {
				if (cm.getLevel() >= 30 
					&& cm.getJob().equals(MapleJob.BOWMAN)) {
					if (cm.getQuestStatus(100000).getId() >=
						Packages.client.MapleQuestStatus.Status.STARTED.getId()) {
						cm.completeQuest(100002);
						if (cm.getQuestStatus(100002) == Packages.client.MapleQuestStatus.Status.COMPLETED) {
							status = 20;
							cm.sendNext("Vejo que voce tem feito bem. Eu vou permitir dar o proximo passo na sua longa estrada.");
						} else {
							cm.sendOk("Va ver o #rInstrutor de Classe.#k.")
							cm.dispose();
						}
					} else {
						status = 10;
						cm.sendNext("O progresso que voce fez e surpreendente.");
					}
				} else if (cm.getQuestStatus(100100).equals(MapleQuestStatus.Status.STARTED)) {
					cm.completeQuest(100101);
					if (cm.getQuestStatus(100101).equals(MapleQuestStatus.Status.COMPLETED)) {
						cm.sendOk("Muito bem, agora levar isso para #bRene#k.");
					} else {
						cm.sendOk("Ei, " + cm.getPlayer().getName() + "! Eu preciso de uma #bBlack Charm#k. Ir e encontrar a porta da Dimensao.");
						cm.startQuest(100101);
					}
					cm.dispose();
				} else {
					cm.sendOk("Voce escolheu sabiamente.");
					cm.dispose();
				}
			}
		} else if (status == 1) {
			if (pnpc == 1) {
				var success = cm.createPlayerNPC();
				if (success) {
					cm.sendOk("Parabens, seu simbolo de poder agora vai ser visto por todos os novos jogadores!");
				} else {
					cm.sendOk("Houve um problema ao criar o NPC, ou voce ja tem um ou todos os pontos sao tomados.");
				}
				cm.dispose();
			} else {
				cm.sendNextPrev("E uma escolha importante e final. Voce nao sera capaz de voltar para tras.");
			}
		} else if (status == 2) {
			cm.sendYesNo("Voce quer se tornar um #rArqueiro#k?");
		} else if (status == 3) {
			if (cm.getJob().equals(Packages.client.MapleJob.BEGINNER))
                            	var statup = new java.util.ArrayList();
				var p = cm.getPlayer();
				var totAp = p.getRemainingAp() + p.getStr() + p.getDex() + p.getInt() + p.getLuk();		
				p.setStr(4);
				p.setDex(4);
				p.setInt(4);
				p.setLuk(4);
				p.setRemainingAp (totAp - 16);
				statup.add(new Pair(MapleStat.STR, java.lang.Integer.valueOf(4)));
				statup.add(new Pair(MapleStat.DEX, java.lang.Integer.valueOf(4)));
				statup.add(new Pair(MapleStat.LUK, java.lang.Integer.valueOf(4)));
				statup.add(new Pair(MapleStat.INT, java.lang.Integer.valueOf(4)));
				statup.add(new Pair(MapleStat.AVAILABLEAP, java.lang.Integer.valueOf(p.getRemainingAp())));
				p.getClient().getSession().write (MaplePacketCreator.updatePlayerStats(statup));
			cm.changeJob(MapleJob.BOWMAN);
			cm.gainItem(1452002, 1);
			cm.gainItem(2060000, 1000);
			cm.sendOk("Assim seja! Agora va, e ir com orgulho.");
			cm.dispose();
		} else if (status == 11) {
			cm.sendNextPrev("Voce pode estar pronto para dar o proximo passo como #rCacador#k ou #rBalestreiro#k.")
		} else if (status == 12) {
			cm.sendAcceptDecline("Mas primeiro tenho de testar suas habilidades. Voce esta pronto?");
		} else if (status == 13) {
			if (cm.haveItem(4031010)) {
				cm.sendOk("Por favor, reporte este bug no http://leaderms.com.br/forum/.\r\nID = 13");
			} else {
				cm.startQuest(100000);
				cm.sendOk("Va ver o instrutor #bInstrutor de Classe#k perto de Henesys. Ele lhe mostrara o caminho.");
			}
		} else if (status == 21) {
			cm.sendSimple("O que voce quer ser?#b\r\n#L0#Cacador#l\r\n#L1#Balestreiro#l#k");
		} else if (status == 22) {
			var jobName;
			if (selection == 0) {
				jobName = "Cacador";
				job = MapleJob.HUNTER;
			} else {
				jobName = "Balestreiro";
				job = MapleJob.CROSSBOWMAN;
			}
			cm.sendYesNo("Voce quer se tornar um #r" + jobName + "#k?");
		} else if (status == 23) {
			cm.changeJob(job);
			cm.sendOk("Assim seja! Agora va, e ir com orgulho.");
		}
	}
}	
