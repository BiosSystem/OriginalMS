load('nashorn:mozilla_compat.js');
/* Author: Xterminator (Modified by RMZero213)
	NPC Name: 		Roger
	Map(s): 		Maple Road : Lower level of the Training Camp (2)
	Description: 		Quest - Roger's Apple
*/
importPackage(Packages.client);

var status = -1;

function start(mode, type, selection) {
	if (mode == -1) {
		qm.dispose();
	} else {
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			qm.sendNext("Ola, tudo bem?\r\nEu sou Roger que e vou-lhe ensinar coisas adoraveis sobre informacoes do Maple (#eLeader#n).");
		} else if (status == 1) {
			qm.sendNextPrev("Voce esta pedindo para eu fazer isso? Ahahahaha!\r\nEu queria fazer isso e apenas um tipo a nosso aos novos viajantes.");
		} else if (status == 2) {
			qm.sendAcceptDecline("Entao ..... Deixe-me fazer isso por diversao!\r\nAbaracadabra ~!");
		} else if (status == 3) {
			if (qm.getC().getTimesTalked(qm.getNpc()) == 0) {
				qm.getPlayer().setHp(25);
				qm.getPlayer().updateSingleStat(MapleStat.HP, 25);
			}
			if (!qm.haveItem(2010007)) {
				qm.gainItem(2010007, 1);
			}
			qm.sendNext("Surpreendido? Se a HP se torna 0, entao voce esta em apuros. Agora, eu lhe darei a #rMaca do Roger#k. Por favor, tome isso. Voce vai se sentir mais forte. Abra a janela do item e clique duas vezes para consumir.  Ei, e muito simples para abrir a janela do item. Basta pressionar #bI#k em seu teclado.");
		} else if (status == 4) {
			qm.getC().setTimesTalked(qm.getNpc(), qm.getC().getTimesTalked(qm.getNpc()) + 1);
			qm.sendPrev("Por favor, tome todas as macas de Roger que eu dei. Voce sera capaz de ver a barra de HP aumentando. Por favor, fale comigo de novo quando voce recuperar seu HP 100%.");
		} else if (status == 5) {
			qm.forceStartQuest();
			qm.dispose();
		}
	}
}

function end(mode, type, selection) {
	if (mode == -1) {
		qm.dispose();
	} else {
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			qm.sendNext("Como e facil de consumir o item? Simples, nao? Voce pode definir um #bhotkey#k no slot inferior direito. Haha voce nao sabia disso! certo? Ah, e se voce e um iniciante, a HP ira recuperar automaticamente se como o tempo passa. Bem, leva tempo, mas esta e uma das estrategias para os novatos.");
		} else if (status == 1) {
			qm.sendNextPrev("Tudo bem! Agora que voce aprendeu muito, vou dar-lhe um presente. Esta e uma obrigacao para sua viagem no mundo Maple, para me agradecer! Por favor, use isso em casos de emergencia!");
		} else if (status == 2) {
			qm.sendNextPrev("Ok, isso e tudo que eu posso te ensinar. Eu sei que e triste, mas e hora de dizer adeus. Bem, tome cuidado, e boa sorte meu amigo!\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v2010000# 3 #t2010000#\r\n#v2010009# 3 #t2010009#\r\n\r\n#fUI/UIWindow.img/QuestIcon/8/0# 10 exp");
		} else if (status == 3) {
			qm.forceCompleteQuest();
			qm.gainExp(10);
			qm.gainItem(2010000, 3);
			qm.gainItem(2010009, 3);
			qm.dispose();
		}
	}
}