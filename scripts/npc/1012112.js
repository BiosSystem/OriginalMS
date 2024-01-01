load('nashorn:mozilla_compat.js');
/*
* @autor Java
* LeaderMS MapleStory Private Server
* HenesysPQ
*/


/* Variaveis */
var texto = "                          #e<LeaderMS HenesysPQ>#n\r\n\r\nEste e o #rPrimrose Hill#k. Quando ha uma lua cheia o coelho vem fazer bolos de arroz. Growlie quer bolos de arroz, entao e melhor ir ajuda-lo ou ele ira te comer.\r\n\r\n";
var map = 390009999;
var status = 0;
var minLevel = 10;
var maxLevel = 200;
var minPlayers = 4;
var maxPlayers = 6;

var PQItems = new Array(4001095, 4001096, 4001097, 4001098, 4001099, 40011000);
/* Fim */


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
		if(cm.getChar().getMapId()==100000200){
			if (status == 0) {
				cm.sendNext(texto);
			} else if (status == 1) {
				cm.sendSimple("Voce gostaria de ajudar Growlie?#b\r\n#L0#Sim, eu vou!#l#k");
			} else if (status == 2) {
				if (cm.getParty() == null) { 
					cm.sendOk("Voce precisa estar em algum grupo.");
					cm.dispose();
					return;
				}
				if (!cm.isLeader()) {
					cm.sendOk("Voce nao e o lider do grupo.");
					cm.dispose();
				} if (checkLevelsAndMap(minLevel, maxLevel) == 2) { 
	                          cm.sendOk("Esta faltando alguem do grupo no mapa!");
                                  cm.dispose();
                                  return;
                                }  else {
					var party = cm.getParty().getMembers();
					var mapId = cm.getChar().getMapId();
					var next = true;
					var levelValid = 0;
					var inMap = 0;
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
					}  if (next) {
		                  var em = cm.getEventManager("HenesysPQ");
	                          if (em == null) {
	                          cm.sendOk("Este evento esta indisponivel.");
		                  } else {
		                  var prop = em.getProperty("state");
		                  if (prop.equals("0") || prop == null) {
		                    em.startInstance(cm.getParty(),cm.getChar().getMap());
                                    party = cm.getChar().getEventInstance().getPlayers();
			            cm.dispose();
		                    } else {
		            	      cm.sendOk("Existe outro grupo dentro da PQ.");
                                      cm.dispose();
		                 }
		               }
	                 } else {
		    cm.sendOk("Seu grupo parece nao estar conforme o dito, verifique se tem entre 4/6 jogadores em seu grupo e se eles tem o nivel de 10/200!");
                    cm.dispose();
	       }
	  }
     }
   } else if(cm.getChar().getMapId() == 910010400){
              if (status == 0){
               for (var i = 0; i < PQItems.length; i++) {
				cm.removeAll(PQItems[i]);
                            } 
                cm.warp(100000200);
                cm.playerMessage("Voce foi levado para o Parque de Henesys.");
                cm.dispose();
            }
        } else if (cm.getPlayer().getMapId() == 910010100) {
            if (status==0) {
                cm.sendYesNo("Voce deseja voltar para o #rParque de Henesys#k?");
            }else if (status == 1){
               for (var i = 0; i < PQItems.length; i++) {
				cm.removeAll(PQItems[i]);
                            } 
                cm.warp(100000200, 0);
                cm.dispose();
            }
        }
    }
}
					
function checkLevelsAndMap(lowestlevel, highestlevel) {
    var party = cm.getParty().getMembers();
    var mapId = cm.getMapId();
    var valid = 0;
    var inMap = 0;

    var it = party.iterator();
    while (it.hasNext()) {
        var cPlayer = it.next();
        if (!(cPlayer.getLevel() >= lowestlevel && cPlayer.getLevel() <= highestlevel) && cPlayer.getJobId() != 900) {
            valid = 1;
        }
        if (cPlayer.getMapid() != mapId) {
            valid = 2;
        }
    }
    return valid;
}
		
                