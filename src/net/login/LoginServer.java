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
package net.login;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.net.InetSocketAddress;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import javax.rmi.ssl.SslRMIClientSocketFactory;

import database.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import net.MapleServerHandler;
import net.PacketProcessor;
import net.mina.MapleCodecFactory;
import net.world.remote.WorldLoginInterface;
import net.world.remote.WorldRegistry;
import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.buffer.SimpleBufferAllocator;
import org.apache.mina.core.filterchain.IoFilter;
import server.TimerManager;

import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import properties.LoginProperties;
import properties.WorldProperties;
import tools.Pair;

public class LoginServer implements Runnable, LoginServerMBean {

    public static final int PORT = 8484;
    private NioSocketAcceptor acceptor;
    private MapleServerHandler serverHandler;
    static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LoginServer.class);

    private static Map<Integer, WorldRemote> remoteWorlds = new HashMap<>();

    private final Map<Integer, Map<Integer, String>> channelServerIps = new HashMap<>();

    private Map<Integer, Map<Integer, Integer>> loads = new HashMap<>();

    private boolean pin;
    private boolean AutoReg;
    private byte AutoRegLimit;
    private int worldCount;
    private boolean resetStats;

    int userLimit;
    int loginInterval;
    private long rankingInterval;
    private boolean serverCheck;
    private static LoginServer instance = new LoginServer();

    static {
        MBeanServer mBeanServer = ManagementFactory.getPlatformMBeanServer();
        try {
            mBeanServer.registerMBean(instance, new ObjectName("net.login:type=LoginServer,name=LoginServer"));
        } catch (Exception e) {
            System.out.println("MBEAN ERROR " + e);
        }
    }

    private LoginServer() {
    }

    public static LoginServer getInstance() {
        return instance;
    }

    public Set<Integer> getChannels(int world) {
        return channelServerIps.get(world).keySet();
    }

    public void addChannel(int world, int channel, String ip) {

        if (!channelServerIps.containsKey(world)) {
            addWorld(world);
        }
        channelServerIps.get(world).put(channel, ip);
        loads.get(world).put(channel, 0);
    }

    public void removeChannel(int world, int channel) {
        channelServerIps.get(world).remove(channel);
        loads.get(world).remove(channel);
    }

    public String getIP(int world, int channel) {
        return channelServerIps.get(world).get(channel);
    }

    public void addWorld(int world) {
        channelServerIps.put(world, new HashMap<>());
        loads.put(world, new HashMap());
    }

    public int getWorldCount() {
        return worldCount;
    }

    public static Map<Integer, WorldRemote> getRemoteWorlds() {
        return remoteWorlds;
    }

    public static WorldRemote getRemoteWorld(int worldId) {
        return remoteWorlds.get(worldId);
    }

    public void reconnectWorld(int worldId) {

        if (!remoteWorlds.containsKey(worldId)) {
            return;
        }

        WorldRemote wr = remoteWorlds.get(worldId);

        try {
            wr.getWorldLoginInterface().isAvailable();
        } catch (RemoteException ex) {

            synchronized (remoteWorlds) {
                remoteWorlds.remove(worldId);
                System.out.printf("Reconnecting to World-{%d}\n", worldId);
                try {
                    Properties loginProp = LoginProperties.getInstance().getProp();
                    Properties worldProp = WorldProperties.getInstance(worldId).getProp();
                    String worldHost = worldProp.getProperty("world.host", "127.0.0.1");
                    String loginKey = loginProp.getProperty("login.key");
                    Registry registry = LocateRegistry.getRegistry(
                            worldHost, Registry.REGISTRY_PORT + worldId, new SslRMIClientSocketFactory());
                    WorldRegistry worldRegistry = (WorldRegistry) registry.lookup("WorldRegistry" + worldId);
                    LoginWorldInterfaceImpl lwi = new LoginWorldInterfaceImpl();
                    WorldLoginInterface wli = worldRegistry.registerLoginServer(loginKey, lwi);

                    remoteWorlds.put(worldId, new WorldRemote(worldRegistry, lwi, wli));

                    DatabaseConnection.getConnection();
                    userLimit = Integer.parseInt(loginProp.getProperty("login.userlimit"));
                    AutoReg = Boolean.parseBoolean(loginProp.getProperty("login.autoRegister", "false"));
                    AutoRegLimit = Byte.parseByte(loginProp.getProperty("login.atuoRegisterLimit", "5"));
                    worldCount = Integer.parseInt(loginProp.getProperty("login.worldCount", "1"));
                } catch (Exception e) {
                    System.out.println("Reconnecting failed" + e);
                }
            }
        }

    }

    @Override
    public void run() {
        IoBuffer.setUseDirectBuffer(false);
        IoBuffer.setAllocator(new SimpleBufferAllocator());
        Properties loginProp = LoginProperties.getInstance().getProp();
        worldCount = Integer.parseInt(loginProp.getProperty("login.worldCount", "1"));
        userLimit = Integer.parseInt(loginProp.getProperty("login.userlimit"));
        AutoReg = Boolean.parseBoolean(loginProp.getProperty("login.AutoRegister", "false"));
        AutoRegLimit = Byte.parseByte(loginProp.getProperty("login.AutoRegisterLimit", "5"));
        loginInterval = Integer.parseInt(loginProp.getProperty("login.interval"));
        rankingInterval = Long.parseLong(loginProp.getProperty("login.ranking.interval"));

        for (int i = 0; i < this.worldCount; ++i) {
            try {
                Properties worldProp = WorldProperties.getInstance(i).getProp();
                String worldHost = worldProp.getProperty("world.host", "127.0.0.1");
                String loginKey = loginProp.getProperty("login.key");
                Registry registry = LocateRegistry.getRegistry(
                        worldHost, Registry.REGISTRY_PORT + i, new SslRMIClientSocketFactory());
                WorldRegistry worldRegistry = (WorldRegistry) registry.lookup("WorldRegistry" + i);
                LoginWorldInterfaceImpl lwi = new LoginWorldInterfaceImpl();
                WorldLoginInterface wli = worldRegistry.registerLoginServer(loginKey, lwi);
                remoteWorlds.put(i, new WorldRemote(worldRegistry, lwi, wli));
            } catch (Exception e) {
                throw new RuntimeException("Could not connect to World" + i, e);
            }

        }

        DatabaseConnection.getConnection();

        acceptor = new NioSocketAcceptor();
        serverHandler = new MapleServerHandler(PacketProcessor.getProcessor(PacketProcessor.Mode.LOGINSERVER));

        acceptor.getFilterChain().addLast("codec", (IoFilter) new ProtocolCodecFilter(new MapleCodecFactory()));
        acceptor.getSessionConfig().setIdleTime(IdleStatus.BOTH_IDLE, 30);
        acceptor.setHandler(serverHandler);
        acceptor.getSessionConfig().setTcpNoDelay(true);

        TimerManager tMan = TimerManager.getInstance();
        tMan.start();

        tMan.register(LoginWorker.getInstance(), loginInterval);
        tMan.register(new RankingWorker(), rankingInterval);
        try {
            acceptor.bind(new InetSocketAddress(PORT));
            System.out.println("Server bind to port ( " + PORT + ")");

        } catch (IOException e) {
            System.out.println("Binding to port " + PORT + " failed: " + e);
        }
    }

    public void shutdown() {
        System.out.println("Shutting down...");
        try {
            for (int i = 0; i < this.worldCount; i++) {
                WorldRemote wr = remoteWorlds.get(i);
                wr.getWorldRegistry().deregisterLoginServer(wr.getLoginWorldInterface());
            }
        } catch (RemoteException e) {
        }
        TimerManager.getInstance().stop();
        System.exit(0);
    }

    public static void main(String args[]) {
        try {
            LoginServer.getInstance().run();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public int getLoginInterval() {
        return loginInterval;
    }

    public int getUserLimit() {
        return userLimit;
    }

    public Map<Integer, Integer> getLoad(int world) {
        return loads.get(world);
    }

    public void setLoad(int world, Map<Integer, Integer> load) {
        this.loads.put(world, load);
    }

    @Override
    public int getNumberOfSessions() {
        return acceptor.getManagedSessionCount();
    }

    @Override
    public void setUserLimit(int newLimit) {
        userLimit = newLimit;
    }

    public boolean isAllowPin() {
        return pin;
    }

    public void setServerCheck(boolean set) {
        serverCheck = set;
    }

    public boolean isServerCheck() {
        return serverCheck;
    }

    public boolean AutoRegister() {
        return AutoReg;
    }

    public byte AutoRegLimit() {
        return AutoRegLimit;
    }

    public boolean getResetStats() {
        return resetStats;
    }

    public int getPossibleLogins() {
        int ret = 0;
        try {
            Connection con = DatabaseConnection.getConnection();
            PreparedStatement limitCheck = con.prepareStatement("SELECT COUNT(*) FROM accounts WHERE loggedin > 1 AND gm=0");
            ResultSet rs = limitCheck.executeQuery();
            if (rs.next()) {
                int usersOn = rs.getInt(1);
                // log.info("userson: " + usersOn + ", limit: " + userLimit);
                if (usersOn < userLimit) {
                    ret = userLimit - usersOn;
                }
            }
            rs.close();
            limitCheck.close();
        } catch (Exception ex) {
            log.error("loginlimit error", ex);
        }
        return ret;
    }
}
