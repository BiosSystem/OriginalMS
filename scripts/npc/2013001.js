load('nashorn:mozilla_compat.js');
/*
    This file is part of the MapleChaos Maple Story Server
    Copyright (C) 2009 Nathan Liu <maplechaos@gmail.com>



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

/* Chamberlain Eak
 *@author Jvlaple 
*/
importPackage(Packages.tools);
importPackage(Packages.server.life);
importPackage(java.awt);
importPackage(java.lang);

var status;
var curMap;
var playerStatus;
var chatState;
//var party;
var preamble;

var SRArrays = Array(Array(0, 0, 5), //Sealed Room
                    Array(0, 1, 4),
                    Array(0, 2, 3),
                    Array(0, 3, 2),
                    Array(0, 4, 1),
                    Array(0, 5, 0),
                    Array(1, 0, 4),
                    Array(1, 1, 3),
                    Array(1, 2, 2),
                    Array(1, 3, 1),
                    Array(1, 4, 0),
                    Array(2, 0, 3),
                    Array(2, 1, 2),
                    Array(2, 2, 1),
                    Array(2, 3, 0),
                    Array(3, 0, 2),
                    Array(3, 1, 1),
                    Array(3, 2, 0),
                    Array(4, 0, 1),
                    Array(4, 1, 0),
                    Array(5, 0, 0));



function start() {
    status = -1;
    mapId = cm.getChar().getMapId();
    if (mapId == 920010000) //Entrance
        curMap = 1;
    else if (mapId == 920010100) //Center Tower
        curMap = 2;
    else if (mapId == 920010200)//Walkway
        curMap = 3;
    else if (mapId == 920010300)//Storage
        curMap = 4;
    else if (mapId == 920010400)//Lobby
        curMap = 5;
    else if (mapId == 920010500)//SR
        curMap = 6;
    else if (mapId == 920010600)//Lounge
        curMap = 7;
    else if (mapId == 920010700)//On the way up
        curMap = 8;
    else if (mapId == 920010800)//Garden
        curMap = 9;
    else if (mapId == 920011000)//Room of Darkness
        curMap = 11;
    else if (mapId == 920011200) //Exit
        curMap = 999;
    if (cm.getParty() != null) //Check for Party
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
        if (curMap == 1) { 
            if (playerStatus) { 
                var eim = cm.getChar().getEventInstance();
                var party = cm.getChar().getEventInstance().getPlayers();
                if (status == 0) {
                    party = eim.getPlayers();
                    var cleared = eim.getProperty("1stageclear");
                    if (cleared == null) {
                        cm.sendNext("Obrigado por me salvar, agora irei leva-lo para <Porta da Torre da Deusa>.");
                    }
                    else { 
                            var complete = eim.getProperty(curMap.toString() + "stageclear");
                            if (complete != null) {
                                cm.warp(920010000, 2);
                                cm.dispose();
                        }
                    }
                } else if (status == 1) {
                        cm.givePartyExp(6000, party);
                   //     cm.givePartyQPoints(5 + curMap, party);
                        clear(1, eim, cm);
                        for (var outt = 0; outt<party.size(); outt++)
                            {
                                var exitMapz = eim.getMapInstance(920010000);
                                party.get(outt).changeMap(exitMapz, exitMapz.getPortal(2)); //Top
                            }
                        cm.dispose();
                    }
                } else { 
                if (status == 0) {
                    var eim = cm.getChar().getEventInstance();
                    var complete = eim.getProperty(curMap.toString() + "stageclear");
                    if (complete != null) {
                        cm.warp(920010000, 2);
                        cm.dispose();
                    } else {
                        cm.sendOk("Por favor, peca ao seu lider para falar comigo.");
                        cm.dispose();
                    }
                }
            } 
        } else if (curMap == 2) { 
            if (playerStatus) { 
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var thisMap = mf.getMap(920010100);
                if (thisMap.getReactorByName("scar1").getState() == 1 &&
                    thisMap.getReactorByName("scar2").getState() == 1 &&
                    thisMap.getReactorByName("scar3").getState() == 1 &&
                    thisMap.getReactorByName("scar4").getState() == 1 &&
                    thisMap.getReactorByName("scar5").getState() == 1 &&
                    thisMap.getReactorByName("scar6").getState() == 1) {
                    cm.mapMessage("You are teleported to the Garden!");
                    var party = cm.getChar().getEventInstance().getPlayers();
                    for (var outt = 0; outt<party.size(); outt++)
                        {
                            var exitMapz = eim.getMapInstance(920010800);
                            party.get(outt).changeMap(exitMapz, exitMapz.getPortal(0)); 
                        }
                    cm.dispose();
                } else {
                    cm.sendOk("Corrija a Estatua da Deusa antes de clicar em mim!");
                    cm.dispose();
                }
            } else {
                cm.sendOk("Por favor, peca ao seu lider para falar comigo.");
                cm.dispose();
            }
        } else if (curMap == 3) { 
            if (playerStatus) { 
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                premable = eim.getProperty("leader3rdpremable");
                if (premable == null) {
                    cm.sendNext("Este e o caminho da Torre da Deusa. Os Pixies quebraram a #bEstatua da Deusa: 1st Piece#k em 30 pecas. Por favor, eliminar os Pixie's e trazer de volta as #b1st Small Piece#k. Em troca, eu farei (1) Pedaco da Estatua da Deusa. Os Pixies foram reforcados pelo poder da Estatua da Deusa, por isso tenha cuidado!");
                    eim.setProperty("leader3rdpremable", "done");
                    cm.dispose();
                } else {
                        var complete = eim.getProperty("3stageclear");
                        if (complete != null) {
                            cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                            cm.dispose();
                        }else if (cm.haveItem(4001050, 30)) {
                            cm.sendNext("Obrigado por me trazer de volta a 30 pequenas pecas. Vou fazer uma #bEstatua da Deusa: 1st Peca#k agora mesmo.");
                            cm.gainItem(4001050, -30);
                            cm.gainItem(4001044, 1);
                            cm.givePartyExp(7500, party);
                            clear(3, eim, cm);
                          //  cm.givePartyQPoints(5 + curMap, party);
                            cm.dispose();
                        } else {
                            cm.sendNext("Voce nao tem 30#b 1st Pequenos Pedacos#k ainda.");
                            cm.dispose();
                    }
                }
            } else {
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                if (eim.getProperty(curMap.toString() + "stageclear") == null) {
                    cm.sendNext("Este e o caminho da Torre da Deusa. Os Pixies quebraram #bEstatua da Deusa: 1st Peca#k em 30 pecas, e me tomou cada um deles. Por favor, eliminar a Pixie e trazer de volta a #b1st Pequena Peca#k. Em troca, eu farei Estatua da Deusa: (1a) Parte dela. Os Pixies foram reforcados pelo poder da Estatua da Deusa, por isso tenha cuidado!");
                    cm.dispose();
                } else {
                    cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                    cm.dispose();
                }
            }
        }else if (curMap == 4) {
            if (playerStatus) { 
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                premable = eim.getProperty("leader4thpremable");
                if (premable == null) {
                    cm.sendNext("Esta era anteriormente a area de armazenamento da Torre de Deusa, mas agora, ele se transformou em uma casa dos Cellions. Os Cellions levaram a #bEstatua da Deusa: (2a)#k peca e se esconderam com eles, por isso e o seu trabalho para derrota-los e trazer de volta para mim a #bEstatua da Deusa: (2a)#k.");
                    eim.setProperty("leader4thpremable", "done");
                    cm.dispose();
                } else {
                        var complete = eim.getProperty(curMap.toString() + "stageclear");
                        if (complete != null) {
                            cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                            cm.dispose();
                        } else if (cm.haveItem(4001045, 1)) {
                            cm.sendNext("Obrigado por voltar as pecas, usa-la para corrigir a Estatua da Deusa.");
                            clear(4, eim, cm);
                         //   cm.givePartyQPoints(5 + curMap, party);
                            cm.givePartyExp(7500, party);
                            cm.dispose();
                        } else {
                            cm.sendNext("Voce nao tem o segundo pedaco da Estatua para concluir esta fase.");
                            cm.dispose();
                    }
                }
            } else {
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                if (eim.getProperty(curMap.toString() + "stageclear") == null) {
                    cm.sendNext("Esta era anteriormente a area de armazenamento da Torre de Deusa, mas agora, ele se transformou em uma casa dos Cellions. Os Cellions levaram a #bEstatua da Deusa: (2a)#k peca e se esconderam com eles, por isso e o seu trabalho para derrota-los e trazer de volta para mim a #bEstatua da Deusa: (2a)#k.");
                    cm.dispose();
                } else {
                    cm.sendNext("Voce nao tem o segundo pedaco da Estatua para concluir esta fase.");
                    cm.dispose();
                }
            }
        }else if (curMap == 5) { 
        if (playerStatus) { 
                var dayNames = Array("Domingo", "Segunda-feira", "Terca-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado");
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                var dayTxt = dayNames[cm.getDayOfWeek() - 1];
                var thisMap = mf.getMap(920010400);
                var today = cm.getDayOfWeek();
                premable = eim.getProperty("leader5thpremable");
                if (premable == null) {
                    cm.sendNext("Esta a a lobby da Torre de Deusa. Este e o lugar da Deusa Minerva, o preferido dela para ouvir musica. Ela adorava ouvir diferentes tipos de musica, dependendo do dia da semana que era. Se voce jogar a musica que voce jogou antes, o espirito da Deusa Minerva pode reagir a ele e ... algo curioso pode acontecer.#n\r\n\r\nHoje e:\r\n" + dayTxt);
                    cm.getPlayer().dropMessage("[LeaderMS Quest] Hoje e " + dayTxt + ".")
                    eim.setProperty("leader5thpremable", "done");
                    cm.dispose();
                } else {
                        var complete = eim.getProperty(curMap.toString() + "stageclear");
                        if (complete != null) {
                            cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                            cm.dispose();
                        }else if (eim.getMapInstance(920010400).getReactorByName("music").getMode() != 0) {
                            if (thisMap.getReactorByName("music").getMode() == today) {
                                cm.sendNext("Uau, voce conseguiu!");
                                clear(5, eim, cm);
                                cm.gainItem(4001046, 1);
                             //   cm.givePartyQPoints(5 + curMap, party);
                             //   cm.getPlayer().getEventInstance().getMapInstance(920010500).getReactorByName("stone3").setState(1);
                                cm.dispose();
                            } else {
                                cm.sendNext("Disco errado, desculpe, tente novamente!");
                                cm.dispose();
                            }
                            cm.dispose();
                        } else {
                            cm.sendNext("Voce nao jogou o CD ainda.");
                            cm.dispose();
                    }
                }
            } else {
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                var dayNames = Array("Domingo", "Segunda-feira", "Terca-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado");
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                var dayTxt = dayNames[cm.getDayOfWeek() - 1];
                var thisMap = mf.getMap(920010400);
                var today = cm.getDayOfWeek();
                if (eim.getProperty(curMap.toString() + "stageclear") == null) {
                    cm.sendNext("Esta a a lobby da Torre de Deusa. Este e o lugar da Deusa Minerva, o preferido dela para ouvir musica. Ela adorava ouvir diferentes tipos de musica, dependendo do dia da semana que era. Se voce jogar a musica que voce jogou antes, o espirito da Deusa Minerva pode reagir a ele e ... algo curioso pode acontecer.#n\r\n\r\nHoje e:\r\n" + dayTxt);
                    cm.dispose();
                } else {
                    cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                    cm.dispose();
                }
            }
        }else if (curMap == 6) {
            sealedRoom(cm);
        }else if (curMap == 7) {
            if (playerStatus) { 
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                premable = eim.getProperty("leader7thpremable");
                if (premable == null) {
                    cm.sendNext("Esta e a sala de estar da Torre de Deusa, onde os hospedes se hospedaram por uma noite ou duas. #b<Estatua da Deusa: (5a) Parte>#k foi dividida em 40 pecas, e separados em todo o lounge. Por favor, vagar ao redor e coletar as pecas da #b(5a) Parte#k.");
                    eim.setProperty("leader7thpremable", "done");
                    cm.dispose();
                } else {
                        var complete = eim.getProperty("7stageclear");
                        if (complete != null) {
                            cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                            cm.dispose();
                        }else if (cm.haveItem(4001052, 40)) {
                            cm.sendNext("Obrigado por me trazer de volta os 40 pedacos pequenos. Vou fazer a #bEstatua da Deusa: (5a) Parte#k agora mesmo.");
                            cm.gainItem(4001052, -40);
                            cm.gainItem(4001048, 1);
                            cm.givePartyExp(7500, party);
                            clear(7, eim, cm);
                         //   cm.givePartyQPoints(5 + curMap, party);
                            cm.dispose();
                        } else {
                            cm.sendNext("Voce nao tem 40#b Pecas#k ainda.");
                            cm.dispose();
                    }
                }
            } else {
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                if (eim.getProperty(curMap.toString() + "stageclear") == null) {
                    cm.sendNext("Esta e a sala de estar da Torre de Deusa, onde os hospedes se hospedaram por uma noite ou duas. #b<Estatua da Deusa: (5a) Parte>#k foi dividida em 40 pecas, e separados em todo o lounge. Por favor, vagar ao redor e coletar as pecas da #b(5a) Parte#k.");
                    cm.dispose();
                } else {
                    cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                    cm.dispose();
                }
            }
        }else if (curMap == 8) { //Way up
            if (playerStatus) { //Is leader
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                premable = eim.getProperty("leader8thpremable");
                if (premable == null) {
                    cm.sendNext("Uma vez que esta fase e incompleta, voce pode ter a peca Estatua de graca ...");
                    eim.setProperty("leader8thpremable", "done");
                    cm.gainItem(4001049, 1);
                    cm.givePartyExp(7500, party);
                    clear(8, eim, cm);
                   // cm.givePartyQPoints(5 + curMap, party);
                    cm.dispose();
                } else {
                    cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                    cm.dispose();
                }
            } else {
                var eim = cm.getChar().getEventInstance();
                var mf = eim.getMapFactory();
                var party = cm.getChar().getEventInstance().getPlayers();
                if (eim.getProperty(curMap.toString() + "stageclear") == null) {
                    cm.sendNext("Peca ao seu lider para falar comigo!");
                    cm.dispose();
                } else {
                    cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                    cm.dispose();
                }
            }
        }else if (curMap == 11) {
            cm.sendNext("Argh, tao escuro aqui. Agora voce esta dentro do quarto da Escuridao na Torre de Deusa, mas, como voce chegou aqui? Voce nao vai encontrar um peda da Estatua da Deusa aqui. Eu sugiro que voce verifique os outros quartos em vez deste.");
            cm.dispose();
        }else if (curMap == 999) {
            cm.warp(200080101, 0);
            cm.dispose();
        }else {
            cm.dispose();
        }
    }
}

function clear(stage, eim, cm) {
    eim.setProperty(stage.toString() + "stageclear","true");
    var packetef = MaplePacketCreator.showEffect("quest/party/clear");
    var packetsnd = MaplePacketCreator.playSound("Party1/Clear");
    var packetglow = MaplePacketCreator.environmentChange("gate",2);
    var map = eim.getMapInstance(cm.getChar().getMapId());
    map.broadcastMessage(packetef);
    map.broadcastMessage(packetsnd);
    var mf = eim.getMapFactory();
    map = mf.getMap(920010000 + stage * 100);
}

function failstage(eim, cm) {
    var packetef = MaplePacketCreator.showEffect("quest/party/wrong_kor");
    var packetsnd = MaplePacketCreator.playSound("Party1/Failed");
    var map = eim.getMapInstance(cm.getChar().getMapId());
    map.broadcastMessage(packetef);
    map.broadcastMessage(packetsnd);
}

function sealedRoom (cm) {
    var debug = true;
    var eim = cm.getChar().getEventInstance();
    var nthtext = "6th";
    var curcombo = SRArrays;
    var currect = cm.getChar().getMap().getAreas();
    var objset = [0,0,0];
        if (curMap == 6) { //SR
            if (playerStatus) { // leader
                    if (status == 0) {
                            party = eim.getPlayers();
                            preamble = eim.getProperty("leader" + nthtext + "preamble");
                            if (preamble == null) {
                                    cm.sendNext("Este e o quarto fechado da Torre de Deusa. E o quarto onde a Deusa Minerva sentiu-se segura o suficiente para mante-la pertences muito valiosos. As tres etapas que voce ve no trabalho do lado, como os bloqueios que pode abrir a maldicao, e todos eles tem de levar a quantidade exata de peso. Vamos ver ... ele vai exigir de cinco de voces para estar nele para coincidir com o peso ideal. Voce vai precisar para resolver isso em sete tentativas ou menos, ou voce sera banido da sala selada.");
                                    eim.setProperty("leader" + nthtext + "preamble","done");
                                    var sequenceNum = Math.floor(Math.random() * curcombo.length);
                                    eim.setProperty("stage" + nthtext + "combo",sequenceNum.toString());
                                    eim.setProperty("stage6Tries", "0");
                                    cm.dispose();
                            }
                            else {
                                var complete = eim.getProperty(curMap.toString() + "stageclear");
                                if (complete != null) {
                                    var mapClear = curMap.toString() + "stageclear";
                                    eim.setProperty(mapClear,"true"); 
                                    cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
                                }
                                else {
                                        var totplayers = 0;
                                        for (i = 0; i < objset.length; i++) {
                                                for (j = 0; j < party.size(); j++) {
                                                        var present = currect.get(i).contains(party.get(j).getPosition());
                                                            if (present) {
                                                                objset[i] = objset[i] + 1;
                                                                totplayers = totplayers + 1;
                                                        }
                                                }
                                        }
                                        if (totplayers == 5 /*|| debug*/) {
                                                var combo = curcombo[parseInt(eim.getProperty("stage" + nthtext + "combo"))];
                                                // debug
                                                // combo = curtestcombo;
                                                var testcombo = true;
                                                var right = 0;
                                                var wrong = 0;
                                                var sndString = "";
                                                for (i = 0; i < objset.length; i++) {
                                                    if (combo[i] != objset[i]){
                                                        testcombo = false;
                                                        wrong += 1;
                                                    } else {
                                                        right += 1;
                                                    }
                                                }
                                                if (right > 1) {
                                                    sndString += right + " correto.\r\n";
                                                }
                                                if (wrong > 1) {
                                                    sndString += wrong + " diferente.\r\n";
                                                }
                                                if (testcombo || debug) {
                                                        // do clear
                                                        clear(curMap,eim,cm);
                                                        var exp = 7500;
                                                        cm.givePartyExp(exp, party);
                                                        //cm.getPlayer().getEventInstance().getMapInstance(920010500).getReactorByName("stone4").setState(1);
                                                        cm.getPlayer().getMap().setReactorState(cm.getPlayer().getMap().getReactorByName("stone4"), 1);
                                                        cm.dispose();
                                                }
                                                else { 
                                                        var tries = Integer.parseInt(eim.getProperty("stage6Tries"));
                                                        eim.setProperty("stage6Tries", tries + 1);
                                                        if (tries > 6) {
                                                            cm.mapMessage(5, "Voce foi nanido do quarto Selado, e a combinacao deve ser reposta.");
                                                            var sequenceNum = Math.floor(Math.random() * curcombo.length); // Reset combo
                                                            eim.setProperty("stage" + nthtext + "combo",sequenceNum.toString());
       eim.setProperty("stage6Tries", "0");
       for (var outt = 0; outt<party.size(); outt++) {
       var exitMapz = eim.getMapInstance(9200100100);
       party.get(outt).changeMap(exitMapz, exitMapz.getPortal(0));
       }
       } else {
       cm.sendOk(sndString);
       }
       cm.dispose();
          }
       } else {
       if (debug) {
       var outstring = "Os objetos contem:"
       for (i = 0; i < objset.length; i++) {
       outstring += "\r\n" + (i+1).toString() + ". " + objset[i].toString();
       }
       cm.sendNext(outstring);
       var combo = curcombo[parseInt(eim.getProperty("stage" + nthtext + "combo"))];
       } else
       cm.sendNext("Parece que voce nao tem encontrado as plataformas ainda, continue tentando!");
       cm.dispose();
                  }
              }
         }
       } else {
       var complete = eim.getProperty(curMap.toString() + "stageclear");
       if (complete != null) {
       }
       cm.dispose();
             }
       } else { 
       if (status == 0) {
       var complete = eim.getProperty(curMap.toString() + "stageclear");
       if (complete != null) {
       cm.sendNext("Por favor, volte para o Centro da Torre e continue a missao.");
       cm.dispose();
       }
       else {
       cm.sendNext("Peca seu lider para falar comigo!");
       cm.dispose();
              }
       } else {
       var complete = eim.getProperty(curMap.toString() + "stageclear");
       if (complete != null) {
        }
        cm.dispose();
        }
     }
  }
}