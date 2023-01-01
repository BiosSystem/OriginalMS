package net.world;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.rmi.ssl.SslRMIClientSocketFactory;
import javax.rmi.ssl.SslRMIServerSocketFactory;
import net.channel.remote.ChannelWorldInterface;
import net.world.guild.MapleGuildCharacter;
import net.world.remote.WorldLoginInterface;
import properties.DatabaseProperties;

/**
 *
 * @author Matze
 */
public class WorldLoginInterfaceImpl extends UnicastRemoteObject implements WorldLoginInterface {

    private static final long serialVersionUID = -4965323089596332908L;

    public WorldLoginInterfaceImpl() throws RemoteException {
        super(0, new SslRMIClientSocketFactory(), new SslRMIServerSocketFactory());
    }

    @Override
    public Properties getDatabaseProperties() throws RemoteException {
        return DatabaseProperties.getInstance().getProp();
    }

    @Override
    public Properties getWorldProperties() throws RemoteException {
        return WorldServer.getInstance().getWorldProp();
    }

    @Override
    public boolean isAvailable() throws RemoteException {
        return true;
    }

    @Override
    public Map<Integer, Integer> getChannelLoad() throws RemoteException {
        Map<Integer, Integer> ret = new HashMap<>();
        for (ChannelWorldInterface cwi : WorldRegistryImpl.getInstance().getAllChannelServers()) {
            ret.put(cwi.getChannelId(), cwi.getConnected());
        }
        return ret;
    }

    @Override
    public void deleteGuildCharacter(MapleGuildCharacter mgc) throws RemoteException {
        WorldRegistryImpl wr = WorldRegistryImpl.getInstance();
        wr.setGuildMemberOnline(mgc, false, -1);
        if (mgc.getGuildRank() > 1) {
            wr.leaveGuild(mgc);
        } else {
            wr.disbandGuild(mgc.getGuildId());
        }
    }

    @Override
    public String getServerName() throws RemoteException {
        WorldRegistryImpl wr = WorldRegistryImpl.getInstance();
        return wr.getServerName();
    }

    @Override
    public String getServerMessage() throws RemoteException {
        WorldRegistryImpl wr = WorldRegistryImpl.getInstance();
        return wr.getServerMessage();
    }

    @Override
    public String getEventMessage() throws RemoteException {
        WorldRegistryImpl wr = WorldRegistryImpl.getInstance();
        return wr.getEventMessage();
    }

    @Override
    public int getFlag() throws RemoteException {
        WorldRegistryImpl wr = WorldRegistryImpl.getInstance();
        return wr.getFlag();
    }

    @Override
    public int getMaxCharacters() throws RemoteException {
        WorldRegistryImpl wr = WorldRegistryImpl.getInstance();
        return wr.getMaxCharacters();
    }

    @Override
    public int getUserLimit() throws RemoteException {
        WorldRegistryImpl wr = WorldRegistryImpl.getInstance();
        return wr.getUserLimit();
    }

    @Override
    public String getChannelIP(int channel) throws RemoteException {
        return WorldRegistryImpl.getInstance().getChannel(channel).getIP();
    }
}
