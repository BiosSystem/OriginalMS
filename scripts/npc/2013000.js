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

//Wonky The Fairy

var status = 0;
var mySelection = -1;
var foodSelection = -1;
var minLevel = 51; //51
var maxLevel = 70; //70
var minPlayers = 5; 
var maxPlayers = 6;
var foodArray = Array(2001001, 2001002, 2020000, 2020003, 2020001, 0); //0 means nothing
var blessingArray = Array(2022090, 2022091, 2022092, 2022093); //Blessing IDs
var warriors = Array(100, 110, 111, 120, 121, 130, 131);
var mages = Array(200, 210, 211, 220, 221, 230, 231);
var rangerz = Array(300, 310, 311, 320, 321);
var theifs = Array(400, 411, 410, 421, 420);
var gmz = Array(500, 510);
var numOfWarriors = 0;
var numOfMages = 0;
var numOfRangers = 0;
var numOfThiefs = 0;
var numOfGMs = 0;

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
		if (cm.getPlayer().getMapId() == 200080101) {
			if (status == 0) {
				cm.sendSimple("Ola, sou a Fada Wonky.\r\nVoce quer explorar a Torre da Deusa? Alias, se seu grupo tiver pelo menos um guerreiro, bruxo, arqueiro e gatuno, eu vou dar a voce um pouco da Bencao de Wonky.\r\nO que voce gostaria de fazer hoje?#b\r\n#L0#Registrar-se para Entrar.#l\r\n#L1#Dar a Wonky alguma coisa para comer.#l");
			}else if (status == 1 && selection == 0) {
				// Slate has no preamble, directly checks if you're in a party
				if (cm.getParty() == null) { // no party
					cm.sendOk("Voce nao esta no grupo. Voce precisa estar em um grupo para fazer isto!");
					cm.dispose();
	                return;
				}
				if (!cm.isLeader()) { // not party leader
					cm.sendOk("Ei, preciso que o lider do seu grupo fale comigo, ninguem mais.");
					cm.dispose();
	            }else {
					// Check teh partyy
					var party = cm.getParty().getMembers();
					var mapId = cm.getChar().getMapId();
					var next = true;
					var levelValid = 0;
					var inMap = 0;
					// Temp removal for testing
					if (party.size() < minPlayers || party.size() > maxPlayers) {
						next = false;
					} else {
						for (var i = 0; i < party.size() && next; i++) {
							if ((party.get(i).getLevel() >= minLevel) && (party.get(i).getLevel() <= maxLevel))
								levelValid += 1;
							if (party.get(i).getMapid() == mapId)
								inMap += 1;
							if (party.get(i).getJobId() == 100 || party.get(i).getJobId() == 110 || party.get(i).getJobId() == 111 || party.get(i).getJobId() == 120 || party.get(i).getJobId() == 121 || party.get(i).getJobId() == 130 || party.get(i).getJobId() == 131) {
								numOfWarriors += 1;
							}
							if (party.get(i).getJobId() == 200 || party.get(i).getJobId() == 210 || party.get(i).getJobId() == 211 || party.get(i).getJobId() == 220 || party.get(i).getJobId() == 221 || party.get(i).getJobId() == 230 || party.get(i).getJobId() == 231) {
								numOfMages += 1;
							}
							if (party.get(i).getJobId() == 300 || party.get(i).getJobId() == 310 || party.get(i).getJobId() == 311 || party.get(i).getJobId() == 320 || party.get(i).getJobId() == 321) {
								numOfRangers += 1;
							}
							if (party.get(i).getJobId() == 400 || party.get(i).getJobId() == 410 || party.get(i).getJobId() == 411 || party.get(i).getJobId() == 420 || party.get(i).getJobId() == 421) {
								numOfThiefs += 1;
							}
							if (party.get(i).getJobId() == 500 || party.get(i).getJobId() == 510) {
								numOfGMs += 1;
							}
						}
						if (levelValid < party.size() || inMap < party.size())
							next = false;
					}
					if (next) {
						var em = cm.getEventManager("OrbisPQ");
						if (em == null) {
							cm.sendOk("Troll.");
							cm.dispose();
						}
						else {
							em.startInstance(cm.getParty(), cm.getChar().getMap());
							if ((numOfWarriors >= 1 && numOfMages >= 1 && numOfRangers >= 1 && numOfThiefs >= 1) || (numOfGMs > 0)) {//Checks the party so gives buff if needed
								for (var ii = 0; ii < party.size(); ii++) {
									var randmm = Math.floor(Math.random() * blessingArray.length);
									var buffToGivee = blessingArray[randmm];
									party.get(ii).giveItemBuff(buffToGivee);
								}
							}
							cm.dispose();
							
						}
						cm.dispose();
					} else {
						cm.sendOk("Ou nem todos os seus membros estao no meu mapa, ou eles nao estao na faixa de nivel certo.");
						cm.dispose();
					}
				}
			}
			else if (status == 1 && selection == 1) {
				cm.sendSimple("Awwn que legal o que voce tem para mim?#b\r\n#L0#Ice Cream Pop#l\r\n#L1#Red Bean Sundae#l\r\n#L2#Salad#l\r\n#L3#Pizza#l\r\n#L4#Fried Chicken#l\r\n#L5#Nada...#l#k");
			} else if (status == 2) {
				foodSelection = selection;
				if  (foodSelection >= 0 && foodSelection <= (foodArray.length - 2)) {
					if (cm.haveItem(foodArray[foodSelection], 1)) {
						cm.sendOk("Obrigado por me alimentar, mas ainda estou com fome!");
						cm.gainItem(foodArray[foodSelection], -1);
						cm.dispose();
					} else {
						cm.sendNext("O que? Cade a comida?");
						cm.playerMessage("Humor instavel, azedou.");
						cm.dispose();
					}
				} else {
						cm.sendNext("O que? voce esta brincando comigo?");
						cm.playerMessage("Humor instavel, azedou.");
						cm.dispose();
					}	
				}
		} else if (cm.getPlayer().getMapId() == 920010000) {
			if (status == 0) {
				cm.sendYesNo("Gostaria de sair da Party Quest?\r\nVoce tera que comecar novamente na proxima vez...");
			} else if (status == 1) {
				var eim = cm.getChar().getEventInstance();
				var party = cm.getChar().getEventInstance().getPlayers();
				var exitMapz = cm.getPlayer().getClient().getChannelServer().getMapFactory().getMap(920011200);
				for (var outt = 0; outt<party.size(); outt++) {//Kick everyone out =D
					party.get(outt).changeMap(exitMapz, exitMapz.getPortal(0));
					eim.unregisterPlayer(party.get(outt));
				}
				cm.dispose();
			}
		}
	}
}					
					
