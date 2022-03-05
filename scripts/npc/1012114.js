load('nashorn:mozilla_compat.js');
/*
* @autor Java / Jvaple
* LeaderMS MapleStory Private Server
* HenesysPQ
*/
 
importPackage(Packages.tools);
importPackage(Packages.server);
importPackage(Packages.server.life);

importPackage(java.awt);

var status;
var curMap;
var playerStatus;
var chatState;
var preamble;
var mySelection;

			

function start() {
	status = -1;
	mapId = cm.getChar().getMapId();
	if (cm.getParty() != null) 
	playerStatus = cm.isLeader();
	preamble = null;
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
		if (playerStatus) {
			var eim = cm.getPlayer().getEventInstance();
			var party = cm.getPlayer().getEventInstance().getPlayers();
			if (status == 0) {
				cm.sendSimple("Ola, eu sou Growlie e eu quero #bBolinhos de Arroz#k...#b\r\n#L0#Eu te trouxe bolos de arroz!#l\r\n#L1#O que faco aqui?#l\r\n#L2#Eu quero sair!#l#k");
			} else if (status == 1) {
				mySelection = selection;
				switch (mySelection) {
					case 0 : if (cm.haveItem(4001101, 10)) {
								cm.removeAll(4001101);
								clear(1, eim, cm);
								cm.sendNext("Obrigado por me dar os #eBolinhos de Arroz#n!");
								} else {
								cm.sendNext("Voce nao tem 10 #bBolinhos de Arroz#k!");
								cm.dispose();
								}
							break;
					case 1 : cm.sendNext("Este e o Primrose Hill, onde o Coelho da Lua vai fazer #bBolos de arroz#k quando ha uma lua cheia. Para fazer uma lua cheia, plantar as sementes obtidas a partir das primulas e quando todos os 6 sementes sao plantadas, elas lua cheia vai aparecer. O #rCoelho da Lua sera entao convocado, e voce deve protege-lo dos outros monstros que tentam ataca-lo#k.No caso do #bCoelho da Lua#k morrer, voce ira falhar a missao e vou estar com fome e irritado ...");
							 cm.dispose();
							 break;
					case 2 : cm.sendNext("Tudo bem, mas volte logo com meus #bBolinhos de Arroz#k!");
							 break;
				}
			} else if (status == 2) {
				switch (mySelection) {
					case 0 : 
							 var mf = eim.getMapFactory();
							 map = mf.getMap(910010100);
							 cm.givePartyExp(1600, party);
							 for (var i = 0; i < party.size(); i++) {
								party.get(i).changeMap(map, map.getPortal(0));
								eim.unregisterPlayer(party.get(i));
							 }
                                                         eim.liberaEntrada();
							 eim.dispose();
							 cm.dispose();
							 break;
					case 1 : break; 
					case 2 : eim.disbandParty();
							 cm.dispose();
				}
			}
		} else {
			var eim = cm.getPlayer().getEventInstance();
			var party = cm.getPlayer().getEventInstance().getPlayers();
			if (status == 0) {
				cm.sendYesNo("Voce gostaria mesmo de sair da Missao?");
			} else if (status == 1) {
				eim.unregisterPlayer(cm.getPlayer());
				cm.warp(910010300, 0);
				cm.dispose();
			}
		}
	}
}

function clear(stage, eim, cm) {
	eim.setProperty("1stageclear","true");
	var packetef = MaplePacketCreator.showEffect("quest/party/clear");
	var packetsnd = MaplePacketCreator.playSound("Party1/Clear");
	var packetglow = MaplePacketCreator.environmentChange("gate",2);
	var map = eim.getMapInstance(cm.getChar().getMapId());
        var party = cm.getPlayer().getEventInstance().getPlayers();
	map.broadcastMessage(packetef);
	map.broadcastMessage(packetsnd);
	var mf = eim.getMapFactory();
}
	