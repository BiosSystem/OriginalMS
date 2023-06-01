
importPackage(Packages.server.maps);
importPackage(Packages.net.channel);
importPackage(Packages.tools);

function enter(pi) {
	var map = 220080001;
	var papuMap = ChannelServer.getInstance(pi.getPlayer().getClient().getChannel()).getMapFactory().getMap(map);
	var mapchars = papuMap.getCharacters();
	if (mapchars.isEmpty()) {
		sendMessage(pi,"A sala esta vazia. A oportunidade perfeita para desafiar o chefe.");
		var mapobjects = papuMap.getMapObjects();
		var iter = mapobjects.iterator();
		while (iter.hasNext()) {
			o = iter.next();
			if (o.getType() == MapleMapObjectType.MONSTER){
				papuMap.removeMapObject(o);
			}
		}
		papuMap.resetReactors();
	}
	else { 
		var mapobjects = papuMap.getMapObjects();
		var boss = null;
		var iter = mapobjects.iterator();
		while (iter.hasNext()) {
			o = iter.next();
			if (o.getType() == MapleMapObjectType.MONSTER){
				boss = o;
			}
		}
		if (boss != null) {
			sendMessage(pi,"Alguem esta lutando contra " + boss.getName() + ".");
			return false;
		}
	}
	pi.warp(220080001, "st00");
	return true;
}

function sendMessage(pi,message) {
	pi.getPlayer().getClient().getSession().write(MaplePacketCreator.serverNotice(6, message));
}