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

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Random;

import client.MapleClient;
import java.rmi.RemoteException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.login.LoginServer;
import net.AbstractMaplePacketHandler;
import net.channel.ChannelServer;
import properties.WorldProperties;
import tools.MaplePacketCreator;
import tools.data.input.SeekableLittleEndianAccessor;

public class PickCharHandler extends AbstractMaplePacketHandler {

    private static org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PickCharHandler.class);

    @Override
    public void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c) {

        int characterId = slea.readInt();
        int worldId = slea.readInt();

        c.setSelectedWorld(worldId);
        c.setSelectedChannel(1);

        if (c.getIdleTask() != null) {
            c.getIdleTask().cancel(true);
        }

        try {
            String channelIPPort = LoginServer.getRemoteWorld(worldId).getWorldLoginInterface().getChannelIP(1);
            c.updateLoginState(MapleClient.LOGIN_SERVER_TRANSITION);
            String[] socket = channelIPPort.split(":");
            c.getSession().write(MaplePacketCreator.getServerIP(InetAddress.getByName(socket[0]), Integer.parseInt(socket[1]), characterId));
        } catch (UnknownHostException | RemoteException e) {
            c.updateLoginState(MapleClient.LOGIN_LOGGEDIN);
            c.getSession().write(MaplePacketCreator.serverNotice(1, "Host not found"));

        }
    }
}
