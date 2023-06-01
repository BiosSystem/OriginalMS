function enter(pi) {
	var playa = pi.getPlayer();
	if (playa.getMap().getReactorByName("gate").getState() != 1) {
		//pi.warp(211042400, "west00");
		if (playa.getZakumLevel() > 0 && pi.haveItem(4001017, 1)) {
			pi.warp(211042400, "west00");
			//pi.playerMessage(5, "You have been warped to Zakum's Entrance.");
			return true;
		} else {
			pi.playerMessage(5, "Voce deve ter concluido tres fases para prosseguir. Voce tambem precisa ter um Olho de Fogo.");
			return false;
		}
		return false;
	} else {
		pi.playerMessage(5, "A luta com Zakum ja comecou. Por favor, mudar de canal, ou tente novamente mais tarde.");
		return false;
	}
}