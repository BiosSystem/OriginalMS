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
package net.login.handler;

import client.MapleClient;
import java.rmi.RemoteException;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.AbstractMaplePacketHandler;
import net.login.LoginServer;
import tools.MaplePacketCreator;
import tools.data.input.SeekableLittleEndianAccessor;

public class CharlistRequestHandler extends AbstractMaplePacketHandler {

    private static org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CharlistRequestHandler.class);

    @Override
    public void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c) {
        int worldId = slea.readByte();
        int channelIndex = slea.readByte();
        int channel = channelIndex + 1;
        int maxCharacters = 6;
        try {
            maxCharacters = LoginServer.getRemoteWorld(worldId).getWorldLoginInterface().getMaxCharacters();
        } catch (RemoteException ex) {
            Logger.getLogger(CharlistRequestHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        c.setSelectedWorld(worldId);
        c.setSelectedChannel(channel);
        c.getSession().write(MaplePacketCreator.getCharList(c, worldId, maxCharacters));

    }
}
