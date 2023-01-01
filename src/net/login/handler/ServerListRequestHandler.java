package net.login.handler;

import client.MapleClient;
import java.rmi.RemoteException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.AbstractMaplePacketHandler;
import net.login.LoginServer;
import net.login.WorldRemote;
import net.world.WorldServer;
import net.world.remote.WorldLoginInterface;
import properties.WorldProperties;
import tools.MaplePacketCreator;
import tools.data.input.SeekableLittleEndianAccessor;

public class ServerListRequestHandler extends AbstractMaplePacketHandler {

    @Override
    public void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c) {
        
        int worldCount = LoginServer.getInstance().getWorldCount();
        
        for(int i = 0; i < worldCount; ++i)
        {
            WorldRemote worldRemote = LoginServer.getRemoteWorld(i);
            WorldLoginInterface wli = worldRemote.getWorldLoginInterface();
           
            try {
                c.getSession().write(MaplePacketCreator.getServerList(
                        i,
                        wli.getFlag(),
                        wli.getServerName(),
                        wli.getEventMessage(),
                        LoginServer.getInstance().getLoad(c.getSelectedWorld())));
            } catch (RemoteException ex) {
                Logger.getLogger(ServerListRequestHandler.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        c.getSession().write(MaplePacketCreator.getEndOfServerList());
    }
}
