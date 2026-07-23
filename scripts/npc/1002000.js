load('nashorn:mozilla_compat.js');
/* Author: Xterminator
	NPC Name: 		Phil
	Map(s): 		Victoria Road : Lith Harbour (104000000)
	Description: 		Explains Victoria Island Towns and can take you to them
*/
importPackage(Packages.client);

var status = 0;
var maps = Array(102000000, 101000000, 100000000, 103000000, 120000000);
var cost = Array(1200, 1200, 800, 1000, 1000);
var costBeginner = Array(120, 120, 80, 100, 100);
var selectedMap = -1;
var sCost;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (status >= 27 && mode == 0) {
			cm.sendNext("There's plenty to see in this town, too. Let me know if you want to go somewhere else.");
			cm.dispose();
			return;
		} else if (((status == 1 || status == 2 || status == 26) && mode == 0) || ((status == 6 || status == 9 || status == 12 || status == 15 || status == 18 || status == 21) && mode == 1)) {
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			cm.sendNext("Do you want to travel to another town? For a small fee, I can take you there. It's a bit expensive, but I can offer a special 90% discount for beginners.");
		} else if (status == 1) {
			cm.sendSimple("It's understandable to be confused about this place if it's your first time. What would you like to do?\r\n#L0##bWhat kind of towns are on Victoria Island?#l\r\n#L1#Please take me to another town.#k#l");
		} else if (status == 2) {
			if (selection == 0) {
				cm.sendSimple("There are seven major towns on Victoria Island. Which one would you like to know more about?\r\n#b#L0##m104000000##l\r\n#L1##m102000000##l\r\n#L2##m101000000##l\r\n#L3##m100000000##l\r\n#L4##m103000000##l\r\n#L5##m120000000##l\r\n#L6##m105040300##l");
			} else if (selection == 1) {
				status = 26;
				if (cm.getJob().equals(MapleJob.BEGINNER)) {
					var selStr = "There is a special 90% discount for all beginners. Where would you like to go?#b";
					for (var i = 0; i < maps.length; i++) {
						selStr += "\r\n#L" + i + "##m" + maps[i] + "# (" + costBeginner[i] + " mesos)#l";
					}
				} else {
					var selStr = "Where would you like to go?#b";
					for (var i = 0; i < maps.length; i++) {
						selStr += "\r\n#L" + i + "##m" + maps[i] + "# (" + cost[i] + " mesos)#l";
					}
				}
				cm.sendSimple(selStr);
			}
		} else if (status == 3) {
			if (selection == 0) {
				status = 4;
				cm.sendNext("The town you are at is Lith Harbor! It's the place you landed on Victoria Island by riding The Victoria. A lot of beginners start their journey here.");
			} else if (selection == 1) {
				status = 7;
				cm.sendNext("Alright, I'll tell you more about #bPerion#k. It's a warrior town located at the northernmost part of Victoria Island.");
			} else if (selection == 2) {
				status = 10;
				cm.sendNext("Alright, I'll tell you more about #bEllinia#k. It's a magician town located at the far east of Victoria Island.");
			} else if (selection == 3) {
				status = 13;
				cm.sendNext("Alright, I'll tell you more about #bHenesys#k. It's a bowman town located at the southernmost part of the island.");
			} else if (selection == 4) {
				status = 16;
				cm.sendNext("Alright, I'll tell you more about #bKerning City#k. It's a thief town located at the northwest part of Victoria Island.");
			} else if (selection == 5) {
				status = 19;
				cm.sendNext("Here is information on #b#m120000000##k. It's the submarine home of pirates parked between Ellinia and Henesys.");
			} else if (selection == 6) {
				status = 22;
				cm.sendNext("Alright, I'll tell you more about #bSleepywood#k. It's a forest town located at the heart of Victoria Island.");
			}
		} else if (status == 4) {
			cm.sendNext("Lith Harbor is where many adventurers begin their journey.");
		} else if (status == 5) {
			cm.sendNextPrev("It's a quiet harbor town surrounded by ocean.");
		} else if (status == 6) {
			cm.sendNextPrev("Around town lies a beautiful prairie with gentle monsters for beginners.");
		} else if (status == 7) {
			cm.sendNext("Perion is home to the Warriors.");
		} else if (status == 8) {
			cm.sendNextPrev("High in the rocky mountains, only the strong survive.");
		} else if (status == 9) {
			cm.sendNextPrev("Find Dances with Balrog if you want to become a Warrior.");
		} else if (status == 10) {
			cm.sendNext("Ellinia is home to the Magicians.");
		} else if (status == 11) {
			cm.sendNextPrev("Deep in the mystic forest, fairies and spirits dwell.");
		} else if (status == 12) {
			cm.sendNextPrev("Find Grendel the Really Old if you want to become a Magician.");
		} else if (status == 13) {
			cm.sendNext("Henesys is home to the Bowmen.");
		} else if (status == 14) {
			cm.sendNextPrev("Plentiful prairies and forests surround this peaceful town.");
		} else if (status == 15) {
			cm.sendNextPrev("Find Athena Pierce if you want to become a Bowman.");
		} else if (status == 16) {
			cm.sendNext("Kerning City is home to the Thieves.");
		} else if (status == 17) {
			cm.sendNextPrev("Modern buildings and mysterious back alleys shroud the city.");
		} else if (status == 18) {
			cm.sendNextPrev("Find the Dark Lord if you want to become a Thief.");
		} else if (status == 19) {
			cm.sendNext("The Nautilus is home to the Pirates.");
		} else if (status == 20) {
			cm.sendNextPrev("A giant whale submarine anchored in the harbor bay.");
		} else if (status == 21) {
			cm.sendNextPrev("Find Captain Kyrin on the main deck if you want to become a Pirate.");
		} else if (status == 22) {
			cm.sendNext("Sleepywood lies deep within the island's central dungeon.");
		} else if (status == 23) {
			cm.sendNextPrev("Rest up at the hotel before venturing into the deep caves.");
		} else if (status == 24) {
			cm.sendNextPrev("Powerful monsters inhabit the dark ant tunnels below.");
		} else if (status == 25) {
			cm.sendNextPrev("Be fully prepared before embarking on your dungeon crawl!");
		} else if (status == 26) {
			cm.dispose();
		} else if (status == 27) {
			if (cm.getJob().equals(MapleJob.BEGINNER)) {
				sCost = costBeginner[selection];
			} else {
				sCost = cost[selection];
			}
			cm.sendYesNo("Do you really want to travel to #b#m" + maps[selection] + "##k? It will cost #b" + sCost + " mesos#k.");
			selectedMap = selection;
		} else if (status == 28) {
			if (cm.getPlayer().getMeso() < sCost) {
				cm.sendNext("You don't have enough mesos to pay for the ride.");
			} else {
				cm.gainMeso(-sCost);
				cm.warp(maps[selectedMap], 0);
			}
			cm.dispose();
		}
	}
}
