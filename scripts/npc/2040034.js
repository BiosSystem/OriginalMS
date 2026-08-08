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

//Red Balloon
//35
//6


var status = 0;
var minLevel = 35;
var maxLevel = 50;
var minPlayers = 5;
var maxPlayers = 6;
var PQItems = new Array(4001022, 4001023);

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
			if (cm.getParty() == null) { 
				cm.sendOk("You are not in a party. You can only participate in this quest if you are in a party.");
				cm.dispose();
                                return;
			}
			if (!cm.isLeader()) { 
				cm.sendSimple("Ask your party leader to speak with me.");
				cm.dispose();
                                return;
                        } if (checkLevelsAndMap(minLevel, maxLevel) == 2) {  
	                          cm.sendOk("It seems not all members of your party are present here.");
                                  cm.dispose();
                                  return;
                         }  else {
				var party = cm.getParty().getMembers();
				var mapId = cm.getChar().getMapId();
				var next = true;
				var levelValid = 0;
				var inMap = 0;
				if (party.size() < minPlayers || party.size() > maxPlayers) {
					next = false;
				} else {
					for (var i = 0; i < party.size() && next; i++) {
						if ((party.get(i).getLevel() >= minLevel) && (party.get(i).getLevel() <= maxLevel))
							levelValid += 1;
						if (party.get(i).getMapid() == mapId)
							inMap += 1;
					}
					if (levelValid < party.size() || inMap < party.size())
						next = false;
				}
				 if (next) {
		                  var em = cm.getEventManager("LudiPQ");
	                          if (em == null) {
	                          cm.sendOk("This event is currently unavailable.");
		                  } else {
		                  var prop = em.getProperty("state");
		                  if (prop.equals("0") || prop == null) {
						 em.startInstance(cm.getParty(),cm.getPlayer().getMap());
                                                 cm.dispose();
		                  } else {
		            	      cm.sendOk("Another party is already inside participating in the quest. Please try again after the spot opens up.");
                                      cm.dispose();
		                 }
		               }
	                 } else {
					cm.sendOk("Your party cannot participate because you do not have 6 members. Please gather 6 people in your party.");
					cm.dispose();
				}
			}
		}
		else {
			cm.sendOk("RAWR!?");
			cm.dispose();
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
					
