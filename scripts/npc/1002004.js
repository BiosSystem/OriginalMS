load('nashorn:mozilla_compat.js');
/* Author: Xterminator
	NPC Name: 		VIP Cab
	Map(s): 		Victoria Road : Lith Harbor (104000000)
	Description: 		Takes you to Ant Tunnel Park
*/
var status = 0;
var cost;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (status >= 1 && mode == 0) {
			cm.sendNext("Esta cidade tambem tem muito a oferecer. Encontre-nos se e quando voce sentir a necessidade de ir para o Tunel das Formigas.");
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			cm.sendNext("Ola! Esta cabine e so para clientes VIP. Em vez de apenas leva-lo para cidades diferentes, como os taxis regulares, oferecemos um servico muito melhor digno de classe VIP. E um pouco caro, mas ... por apenas 10.000 mesos, vamos leva-lo em seguranca para o \r\n#bTunel das Formigas#k.");
		} else if (status == 1) {
			if (cm.getJob().equals(Packages.client.MapleJob.BEGINNER)) {
				cm.sendYesNo("Temos um desconto especial de 90% para iniciantes. O Tunel Formiga esta localizado dentro do profundo calabouco que e colocado no centro da Ilha Victoria, onde ha uma Loja 24 Hr. Gostaria de ir la? Por #b1,000 mesos#k?");
				cost = 1000;
			} else {
				cm.sendYesNo("A taxa de regular se aplica para todos os menos iniciantes. O Tunel Formiga esta localizado dentro do profundo calabouco que e colocado no centro da Ilha Victoria, onde ha uma Loja 24 Hr. Gostaria de ir la? Por #b10,000 mesos#k?");
				cost = 10000;
			}
		} else if (status == 2) {
			if (cm.getPlayer().getMeso() < cost) {
				cm.sendNext("Parece que voce nao tem o suficiente mesos. Desculpe, mas voce nao sera capaz de usar isto sem ele.")
			} else {
				cm.gainMeso(-cost);
				cm.warp(105070001, 0);
			}
			cm.dispose();
		}
	}
}