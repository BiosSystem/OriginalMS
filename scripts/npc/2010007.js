load('nashorn:mozilla_compat.js');
/*
	This file was written by "StellarAshes" <stellar_dust@hotmail.com> 
			as a part of the Guild package for
			the OdinMS Maple Story Server
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

/* guild creation npc */
var status = 0;
var sel;
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

		if (status == 0)
			cm.sendSimple("O que voce gostaria de fazer?\r\n#b#L0#Criar uma Guild#l\r\n#L1#Desfazer o Guild#l\r\n#L2#Aumentar a capacidade da Guild#l#k");
		else if (status == 1)
		{
			sel = selection;
			if (selection == 0)
			{
				if (cm.getPlayer().getGuildId() > 0)
				{
					cm.sendOk("Voce nao pode criar uma nova Guild, enquanto voce estiver em uma.");
					cm.dispose();
				}
				else
					cm.sendYesNo("Para criar uma Guild tem o custo de #b" + cm.getPlayer().guildCost() + " mesos#k, tem certeza de que quer continuar?");
			}
			else if (selection == 1)
			{
				if (cm.getPlayer().getGuildId() <= 0 || cm.getPlayer().getGuildRank() != 1)
				{
					cm.sendOk("Voce so pode desfazer uma Guild se voce for o lider.");
					cm.dispose();
				}
				else
					cm.sendYesNo("Tem certeza de que quer desfazer a Guild? Voce nao sera capaz de recupera-lo depois, e todo o seu GP tera desaparecido.");
			}
			else if (selection == 2)
			{
				if (cm.getPlayer().getGuildId() <= 0 || cm.getPlayer().getGuildRank() != 1)
				{
					cm.sendOk("Voce so pode aumentar a capacidade de sua guilda, se voce for o lider.");
					cm.dispose();
				}
				else
					cm.sendYesNo("Aumentando sua capacidade de Guild por #b5#k costs #b" + cm.getPlayer().capacityCost() + " mesos#k, voce tem certeza que quer continuar?");
			}
		}
		else if (status == 2)
		{
			if (sel == 0 && cm.getPlayer().getGuildId() <= 0)
			{
				cm.getPlayer().genericGuildMessage(1);
				cm.dispose();
			}
			else if (sel == 1 && cm.getPlayer().getGuildId() > 0 && cm.getPlayer().getGuildRank() == 1)
			{
				cm.getPlayer().disbandGuild();
				cm.dispose();
			}
			else if (sel == 2 && cm.getPlayer().getGuildId() > 0 && cm.getPlayer().getGuildRank() == 1)
			{
				cm.getPlayer().increaseGuildCapacity();
				cm.dispose();
			}
		}
	}
}
