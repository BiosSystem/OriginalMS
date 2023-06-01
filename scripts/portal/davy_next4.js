importPackage(java.lang);
importPackage(Packages.server.maps);
importPackage(Packages.net.channel);
importPackage(Packages.tools);

/*
@Author Jvlaple
*/

function enter(pi) {
	var nextMap = 925100500;
	var eim = pi.getPlayer().getEventInstance();
	var party = eim.getPlayers();
	var target = eim.getMapInstance(nextMap);
	var targetPortal = target.getPortal("sp");
	var S = pi.isLeader();
	// only let people through if the eim is ready
	var avail = eim.getProperty("4stageclear");
	if (S == false) {
		pi.getPlayer().getClient().getSession().write(MaplePacketCreator.serverNotice(6, "Apenas o lider do grupo pode prosseguir."));
		return false;		
	}else if (avail == null) {
		// do nothing; send message to player
		pi.getPlayer().getClient().getSession().write(MaplePacketCreator.serverNotice(6, "O portal esta fechado."));
		return false;
	}else {
		eim.setProperty("entryTimeStamp", 1000 * 60 * 6);
		for(var g=0; g<party.size(); g++) {
			party.get(g).changeMap(target, targetPortal);
			party.get(g).getClient().getSession().write(Packages.MaplePacketCreator.getClock(360));
		}
		return true;
	}
}