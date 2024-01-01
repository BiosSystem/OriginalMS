load('nashorn:mozilla_compat.js');
/* 
 * This file is part of the OdinMS Maple Story Server
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

/* 
 * @Author Lerk
 * 
 * Bulletin Board, Victoria Road: Excavation Site<Camp> (101030104) AND Sharenian: Excavation Site (990000000)
 * 
 * Start of Guild Quest
 */

function start() {
	cm.sendOk("<Noticia> \r\n Voce faz parte de uma guild que possui uma grande quantidade de coragem e confianca? Em seguida, assumir o Guild Quest e desafie-se!\r\n\r\n#b Para participar :#k\r\n1. A Guild deve consistir em pelo menos 6 pessoas!\r\n2. O lider da grupo deve ser um Mestre ou um Mestre Jr. da Guild!\r\n3. A Guild Quest Quest pode terminar mais cedo se o numero de membros da guild participando for abaixo de 6, ou se o lider decide acabar cedo!");
        cm.dispose();
}

function action(mode, type, selection) {
        
}