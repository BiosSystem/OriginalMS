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
package net.channel;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.net.InetSocketAddress;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.management.InstanceAlreadyExistsException;
import javax.management.MBeanRegistrationException;
import javax.management.MBeanServer;
import javax.management.MalformedObjectNameException;
import javax.management.NotCompliantMBeanException;
import javax.management.ObjectName;
import javax.rmi.ssl.SslRMIClientSocketFactory;
import client.MapleCharacter;
import client.MapleClient;
import client.SkillFactory;
import client.messages.CommandProcessor;
import config.configuracoes.configuracoes;
import database.DatabaseConnection;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Consumer;
import net.MaplePacket;
import net.MapleServerHandler;
import net.PacketProcessor;
import net.channel.remote.ChannelWorldInterface;
import net.mina.MapleCodecFactory;
import net.world.MapleParty;
import net.world.MaplePartyCharacter;
import net.world.guild.MapleGuild;
import net.world.guild.MapleGuildCharacter;
import net.world.guild.MapleGuildSummary;
import net.world.remote.WorldChannelInterface;
import net.world.remote.WorldRegistry;
import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.buffer.SimpleBufferAllocator;
import org.apache.mina.core.future.CloseFuture;
import org.apache.mina.core.service.IoAcceptor;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import properties.ChannelProperties;
import properties.WorldProperties;
import provider.MapleDataProviderFactory;
import scripting.event.EventScriptManager;
import server.MapleSquad;
import server.MapleSquadType;
import server.PlayerInteraction.HiredMerchant;
import server.ShutdownServer;
import server.TimerManager;
import server.maps.MapleMap;
import server.maps.MapleMapFactory;
import server.maps.MapleMapObject;
import server.maps.MapleMapObjectType;
import server.market.MarketEngine;
import tools.MaplePacketCreator;
import server.AutobanManager;
import server.MapleItemInformationProvider;
import server.MapleTrade;
import server.maps.MapTimer;

public class ChannelServer implements Runnable, ChannelServerMBean {

    MapleClient c;
    private static int worldId = 0;
    private static int uniqueID = 1;
    private int port = 7575;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ChannelServer.class);
    private static WorldRegistry worldRegistry;
    private final PlayerStorage players = new PlayerStorage();
    private String serverMessage;
    private int expRate;
    private int mesoRate;
    private int dropRate;
    private int bossdropRate;
    private boolean MT;
    private int petExpRate;
    public boolean eventOn = false;
    public boolean doublecash = false;
    public int eventMap = 0;
    private int mountExpRate;
    private int QuestExpRate;
    private boolean gmWhiteText;
    private boolean cashshop;
    private boolean mts;
    private Properties worldProps;
    private boolean dropUndroppables;
    private boolean moreThanOne;
    private int channel;
    private int instanceId = 0;
    private boolean GMItems;
    private final String key;
    private boolean AB;
    private ChannelWorldInterface cwi;
    private WorldChannelInterface wci = null;
    private MapleServerHandler serverHandler;
    private NioSocketAcceptor acceptor;
    private String ip;
    private boolean shutdown = false;
    private boolean finishedShutdown = false;
    private String arrayString = "";

    private final MapleMapFactory mapFactory;
    private final MapleMapFactory gmMapFactory;
    private EventScriptManager eventSM;
    private static final Map<Integer, ChannelServer> instances = new HashMap<>();
    private static final Map<String, ChannelServer> pendingInstances = new HashMap<>();
    private final Map<Integer, MapleGuildSummary> gsStore = new HashMap<>();

    private Boolean worldReady = true;
    private final Map<Integer, HiredMerchant> merchants = new HashMap<>();
    private final Lock merchant_mutex = new ReentrantLock();

    private Map<MapleSquadType, MapleSquad> mapleSquads = new EnumMap<>(MapleSquadType.class);
    private final MarketEngine me = new MarketEngine();
    private long lordLastUpdate = 0;
    private int lordId = 0;

    private ChannelServer(String key) {
        mapFactory = new MapleMapFactory(MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/Map.wz")), MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/String.wz")));
        gmMapFactory = new MapleMapFactory(MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/Map.wz")), MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/String.wz")));
        this.key = key;
    }

    public static WorldRegistry getWorldRegistry() {
        return worldRegistry;
    }

    public void reconnectWorld() {
        try {
            wci.isAvailable();
        } catch (RemoteException ex) {
            synchronized (worldReady) {
                worldReady = false;
            }
            synchronized (cwi) {
                synchronized (worldReady) {
                    if (worldReady) {
                        return;
                    }
                }
                System.out.println("Reconnecting to world server");
                synchronized (wci) {
                    try {
                        worldProps = WorldProperties.getInstance(worldId).getProp();
                        Registry registry = LocateRegistry.getRegistry(worldProps.getProperty("world.host"), Registry.REGISTRY_PORT + worldId, new SslRMIClientSocketFactory());
                        worldRegistry = (WorldRegistry) registry.lookup("WorldRegistry" + worldId);
                        cwi = new ChannelWorldInterfaceImpl(this);
                        wci = worldRegistry.registerChannelServer(key, cwi);
                        expRate = Integer.parseInt(worldProps.getProperty("world.exp"));
                        QuestExpRate = Integer.parseInt(worldProps.getProperty("world.questExp"));
                        mesoRate = Integer.parseInt(worldProps.getProperty("world.meso"));
                        dropRate = Integer.parseInt(worldProps.getProperty("world.drop"));
                        bossdropRate = Integer.parseInt(worldProps.getProperty("world.bossdrop"));
                        petExpRate = Integer.parseInt(worldProps.getProperty("world.petExp"));
                        mountExpRate = Integer.parseInt(worldProps.getProperty("world.mountExp"));
                        serverMessage = worldProps.getProperty("world.serverMessage");
                        dropUndroppables = Boolean.parseBoolean(worldProps.getProperty("world.alldrop", "false"));
                        moreThanOne = Boolean.parseBoolean(worldProps.getProperty("world.morethanone", "false"));
                        gmWhiteText = Boolean.parseBoolean(worldProps.getProperty("world.gmWhiteText", "true"));
                        cashshop = Boolean.parseBoolean(worldProps.getProperty("world.cashshop", "false"));
                        mts = Boolean.parseBoolean(worldProps.getProperty("world.mts", "false"));
                        DatabaseConnection.getConnection();
                        wci.serverReady();
                    } catch (IOException | NotBoundException | NumberFormatException e) {
                        System.out.println("Reconnecting failed " + e);
                    }
                    worldReady = true;
                }
            }
            synchronized (worldReady) {
                worldReady.notifyAll();
            }
        }
    }

    @Override
    public void run() {
        try {
            cwi = new ChannelWorldInterfaceImpl(this);
            wci = worldRegistry.registerChannelServer(key, cwi);
            Properties props = wci.getGameProperties();
            expRate = Integer.parseInt(props.getProperty("world.exp"));
            QuestExpRate = Integer.parseInt(props.getProperty("world.questExp"));
            mesoRate = Integer.parseInt(props.getProperty("world.meso"));
            dropRate = Integer.parseInt(props.getProperty("world.drop"));
            bossdropRate = Integer.parseInt(props.getProperty("world.bossdrop"));
            petExpRate = Integer.parseInt(props.getProperty("world.petExp"));
            mountExpRate = Integer.parseInt(props.getProperty("world.mountExp"));
            serverMessage = props.getProperty("world.serverMessage");
            dropUndroppables = Boolean.parseBoolean(props.getProperty("world.alldrop", "false"));
            moreThanOne = Boolean.parseBoolean(props.getProperty("world.morethanone", "false"));
            eventSM = new EventScriptManager(this, props.getProperty("world.events").split(","));
            gmWhiteText = Boolean.parseBoolean(props.getProperty("world.gmWhiteText", "false"));
            cashshop = Boolean.parseBoolean(props.getProperty("world.cashshop", "false"));
            mts = Boolean.parseBoolean(props.getProperty("world.mts", "false"));
            Connection c = DatabaseConnection.getConnection();
            try {
                PreparedStatement ps = c.prepareStatement("UPDATE accounts SET loggedin = 0");
                ps.executeUpdate();
                ps = c.prepareStatement("UPDATE characters SET HasMerchant = 0");
                ps.executeUpdate();
                ps.close();
            } catch (SQLException ex) {
                System.out.println("Could not reset databases " + ex);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        IoBuffer.setUseDirectBuffer(false);
        IoBuffer.setAllocator(new SimpleBufferAllocator());

        acceptor = new NioSocketAcceptor();
        serverHandler = new MapleServerHandler(PacketProcessor.getProcessor(PacketProcessor.Mode.CHANNELSERVER), channel);
        acceptor.setHandler(serverHandler);
        acceptor.getSessionConfig().setIdleTime(IdleStatus.BOTH_IDLE, 30);
        acceptor.getFilterChain().addLast("codec", new ProtocolCodecFilter(new MapleCodecFactory()));
        acceptor.getSessionConfig().setTcpNoDelay(true);

        final TimerManager tMan = TimerManager.getInstance();
        long timeToTake = System.currentTimeMillis();
        timeToTake = System.currentTimeMillis();
        tMan.start();
        tMan.register(AutobanManager.getInstance(), 60000);
        MapTimer.getInstance().start();
        SkillFactory.cacheSkills();
        MapleItemInformationProvider.getInstance().getAllItems();
        System.out.println("[INFO] Items carregados em " + ((System.currentTimeMillis() - timeToTake) / 1000.0) + " segundos.");

        try {
            System.out.println("[INFO] Channel (" + getChannel() + ") is listening on ( " + port + ").");
            acceptor.bind(new InetSocketAddress(port));
            wci.serverReady();
            eventSM.init();
            final ChannelServer serv = this;
            tMan.schedule(() -> {
                serv.broadcastPacket(MaplePacketCreator.serverNotice(6, "[Message System] " + configuracoes.botMensagens[(int) (Math.random() * configuracoes.botMensagens.length)]));
                tMan.schedule(() -> {
                    serv.broadcastPacket(MaplePacketCreator.serverNotice(6, "[Message System] " + configuracoes.botMensagens[(int) (Math.random() * configuracoes.botMensagens.length)]));
                }, 20 * 60000 + (int) (Math.random() * 10000));
            }, 3 * 60000);
        } catch (IOException e) {
            System.out.println("Binding to " + port + " failed. (Channel: " + getChannel() + ")" + e);
        }
        Runtime.getRuntime().addShutdownHook(new Thread(new ShutDown()));
    }

    public final int getId() {
        return channel;
    }

    public List<MapleCharacter> getPartyMembers(MapleParty party) {
        List<MapleCharacter> partym = new ArrayList<>(8);
        for (MaplePartyCharacter partychar : party.getMembers()) {
            if (partychar.getChannel() == getId()) {
                MapleCharacter chr = getPlayerStorage().getCharacterByName(partychar.getName());
                if (chr != null) {
                    partym.add(chr);
                }
            }
        }
        return partym;

    }

    private final class ShutDown implements Runnable {

        @Override
        public void run() {
            shutdown = true;
            List<CloseFuture> futures = new LinkedList<>();
            Collection<MapleCharacter> allchars = players.getAllCharacters();
            MapleCharacter chrs[] = allchars.toArray(new MapleCharacter[allchars.size()]);
            for (MapleCharacter chr : chrs) {
                if (chr.getTrade() != null) {
                    MapleTrade.cancelTrade(chr);
                }
                if (chr.getEventInstance() != null) {
                    chr.getEventInstance().playerDisconnected(chr);
                }
                if (!chr.getClient().isGuest()) {
                    chr.saveToDB(true, true);
                }
                if (chr.getCheatTracker() != null) {
                    chr.getCheatTracker().dispose();
                }
                removePlayer(chr);
            }
            for (MapleCharacter chr : chrs) {
                futures.add(chr.getClient().getSession().close(true));
            }
            futures.stream().forEach((CloseFuture future) -> {
                future.join(500);
            });
            finishedShutdown = true;
            wci = null;
            cwi = null;
        }
    }

    public void shutdown() {
        shutdown = true;
        List<CloseFuture> futures = new LinkedList<>();
        Collection<MapleCharacter> allchars = players.getAllCharacters();
        MapleCharacter chrs[] = allchars.toArray(new MapleCharacter[allchars.size()]);
        for (MapleCharacter chr : chrs) {
            if (chr.getTrade() != null) {
                MapleTrade.cancelTrade(chr);
            }
            if (chr.getEventInstance() != null) {
                chr.getEventInstance().playerDisconnected(chr);
            }
            if (!chr.getClient().isGuest()) {
                chr.saveToDB(true, true);
            }
            if (chr.getCheatTracker() != null) {
                chr.getCheatTracker().dispose();
            }
            removePlayer(chr);
        }
        for (MapleCharacter chr : chrs) {
            futures.add(chr.getClient().getSession().close());
        }
        for (CloseFuture future : futures) {
            future.join(500);
        }
        finishedShutdown = true;
        wci = null;
        cwi = null;
    }

    public final void closeAllMerchant() {
        merchant_mutex.lock();

        final Iterator<HiredMerchant> merchants_ = merchants.values().iterator();
        try {
            while (merchants_.hasNext()) {
                merchants_.next().closeShop(true);
                merchants_.remove();
            }
        } finally {
            merchant_mutex.unlock();
        }
    }

    public void broadcastGMPacket(MaplePacket data) {
        players.getAllCharacters().stream().filter((chr) -> (chr.isGM())).forEach((chr) -> {
            chr.getClient().getSession().write(data);
        });
    }

    public void unbind() {
        acceptor.unbind();
    }

    public boolean hasFinishedShutdown() {
        return finishedShutdown;
    }

    public MapleMapFactory getMapFactory() {
        return mapFactory;
    }

    private static ChannelServer newInstance(String key, String ip, int port) throws InstanceAlreadyExistsException, MBeanRegistrationException, NotCompliantMBeanException, MalformedObjectNameException {
        log.debug(key);
        ChannelServer instance = new ChannelServer(key);
        instance.ip = ip;
        instance.port = port;
        MBeanServer mBeanServer = ManagementFactory.getPlatformMBeanServer();
        mBeanServer.registerMBean(instance, new ObjectName("net.channel:type=ChannelServer,name=ChannelServer_" + worldId + "_" + uniqueID++));
        pendingInstances.put(key, instance);
        return instance;
    }

    public static ChannelServer getInstance(int channel) {
        return instances.get(channel);
    }

    public final void addPlayer(final MapleCharacter chr) {
        players.registerPlayer(chr);
        chr.getClient().getSession().write(MaplePacketCreator.serverMessage(serverMessage));
    }

    public final PlayerStorage getPlayerStorage() {
        return players;
    }

    public final void removePlayer(final MapleCharacter chr) {
        players.deregisterPlayer(chr);
    }

    public int getConnectedClients() {
        return players.getAllCharacters().size();
    }

    @Override
    public String getServerMessage() {
        return serverMessage;
    }

    @Override
    public void setServerMessage(String newMessage) {
        serverMessage = newMessage;
        broadcastPacket(MaplePacketCreator.serverMessage(serverMessage));
    }

    public void broadcastPacket(MaplePacket data) {
        players.getAllCharacters().stream().forEach((chr) -> {
            chr.getClient().getSession().write(data);
        });
    }

    @Override
    public int getExpRate() {
        return expRate;
    }

    @Override
    public void setExpRate(int expRate) {
        this.expRate = expRate;
    }

    public String getArrayString() {
        return arrayString;
    }

    public void setArrayString(String newStr) {
        arrayString = newStr;
    }

    @Override
    public int getChannel() {
        return channel;
    }

    public boolean MTtoFM() {
        return MT;
    }

    public void setChannel(int channel) {
        if (pendingInstances.containsKey(key)) {
            pendingInstances.remove(key);
        }
        if (instances.containsKey(channel)) {
            instances.remove(channel);
        }
        instances.put(channel, this);
        this.channel = channel;
        this.mapFactory.setChannel(channel);
    }

    public static Collection<ChannelServer> getAllInstances() {
        return Collections.unmodifiableCollection(instances.values());
    }

    public String getIP() {
        return ip;
    }

    public String getIP(int channel) {
        try {
            return getWorldInterface().getIP(channel);
        } catch (RemoteException e) {
            System.out.println("Lost connection to world server " + e);
            throw new RuntimeException("Lost connection to world server");
        }
    }

    public WorldChannelInterface getWorldInterface() {
        synchronized (worldReady) {
            while (!worldReady) {
                try {
                    worldReady.wait();
                } catch (InterruptedException e) {
                }
            }
        }
        return wci;
    }

    public void autoRespawn() {
        mapFactory.getMaps().entrySet().stream().forEach((map) -> {
            map.getValue().respawn();
            //  log.info("Auto-Respawn executed successfully!"); 
        });
    }

    public void saveAll() {
        players.getAllCharacters().stream().forEach((chr) -> {
            chr.saveToDB(true, true);
        });
    }

    public boolean isShutdown() {
        return shutdown;
    }

    @Override
    public void shutdown(int time) {
        broadcastPacket(MaplePacketCreator.serverNotice(0, "O servidor vai ser desligado em " + (time / 60000) + " minute(s), please log off safely."));
        TimerManager.getInstance().schedule(new ShutdownServer(getChannel()), time);
    }

    @Override
    public void shutdownWorld(int time) {
        try {
            getWorldInterface().shutdown(time);
        } catch (RemoteException e) {
            reconnectWorld();
        }
    }

    @Override
    public int getLoadedMaps() {
        return mapFactory.getLoadedMapSize();
    }

    public MapleMapFactory getGmMapFactory() {
        return this.gmMapFactory;
    }

    public EventScriptManager getEventSM() {
        return eventSM;
    }

    public void reloadEvents() {
        eventSM.cancel();
        eventSM = new EventScriptManager(this, worldProps.getProperty("world.events").split(","));
        eventSM.init();
    }

    @Override
    public int getMesoRate() {
        return mesoRate;
    }

    @Override
    public void setMesoRate(int mesoRate) {
        this.mesoRate = mesoRate;
    }

    @Override
    public int getDropRate() {
        return dropRate;
    }

    @Override
    public void setDropRate(int dropRate) {
        this.dropRate = dropRate;
    }

    @Override
    public int getBossDropRate() {
        return bossdropRate;
    }

    @Override
    public void setBossDropRate(int bossdropRate) {
        this.bossdropRate = bossdropRate;
    }

    @Override
    public int getPetExpRate() {
        return petExpRate;
    }

    @Override
    public void setPetExpRate(int petExpRate) {
        this.petExpRate = petExpRate;
    }

    @Override
    public int getMountRate() {
        return mountExpRate;
    }

    @Override
    public void setMountRate(int mountExpRate) {
        this.mountExpRate = mountExpRate;
    }

    public boolean allowUndroppablesDrop() {
        return dropUndroppables;
    }

    public boolean allowMoreThanOne() {
        return moreThanOne;
    }

    public boolean allowGmWhiteText() {
        return gmWhiteText;
    }

    public boolean allowCashshop() {
        return cashshop;
    }

    public boolean characterNameExists(String name) {
        int size = 0;
        try {
            Connection con = DatabaseConnection.getConnection();
            ResultSet rs;
            try (PreparedStatement ps = con.prepareStatement("SELECT id FROM characters WHERE name = ?")) {
                ps.setString(1, name);
                rs = ps.executeQuery();
                while (rs.next()) {
                    size++;
                }
            }
            rs.close();
        } catch (SQLException e) {
            log.error("Error in charname check: \r\n" + e.toString());
        }
        return size >= 1;
    }

    public MapleGuild getGuild(MapleGuildCharacter mgc) {
        int gid = mgc.getGuildId();
        MapleGuild g = null;
        try {
            g = this.getWorldInterface().getGuild(gid, mgc);
        } catch (RemoteException re) {
            log.error("RemoteException while fetching MapleGuild.", re);
            return null;
        }

        if (gsStore.get(gid) == null) {
            gsStore.put(gid, new MapleGuildSummary(g));
        }

        return g;
    }

    public MapleGuildSummary getGuildSummary(int gid) {
        if (gsStore.containsKey(gid)) {
            return gsStore.get(gid);
        } else {		//this shouldn't happen much, if ever, but if we're caught
            //without the summary, we'll have to do a worldop
            try {
                MapleGuild g = this.getWorldInterface().getGuild(gid, null);
                if (g != null) {
                    gsStore.put(gid, new MapleGuildSummary(g));
                }
                return gsStore.get(gid);	//if g is null, we will end up returning null
            } catch (RemoteException re) {
                log.error("RemoteException while fetching GuildSummary.", re);
                return null;
            }
        }
    }

    public void updateGuildSummary(int gid, MapleGuildSummary mgs) {
        gsStore.put(gid, mgs);
    }

    public void reloadGuildSummary() {
        try {
            MapleGuild g;
            for (int i : gsStore.keySet()) {
                g = this.getWorldInterface().getGuild(i, null);
                if (g != null) {
                    gsStore.put(i, new MapleGuildSummary(g));
                } else {
                    gsStore.remove(i);
                }
            }
        } catch (RemoteException re) {
            log.error("RemoteException while reloading GuildSummary.", re);
        }
    }

    public static void main(String args[]) throws FileNotFoundException, IOException, NotBoundException,
            InstanceAlreadyExistsException, MBeanRegistrationException,
            NotCompliantMBeanException, MalformedObjectNameException {

        worldId = Integer.parseInt(System.getProperty("channel.worldId", "0"));

        Properties props = ChannelProperties.getInstance(worldId).getProp();

        String host = props.getProperty("channel.net.interface");
        int channelCount = Integer.parseInt(props.getProperty("channel.count", "5"));
        int channelPort = Integer.parseInt(props.getProperty("channel.net.port", "7575"));

        Registry registry = LocateRegistry.getRegistry(host, Registry.REGISTRY_PORT + worldId, new SslRMIClientSocketFactory());
        worldRegistry = (WorldRegistry) registry.lookup("WorldRegistry" + worldId);
        for (int i = 0; i < channelCount; i++) {
            newInstance(props.getProperty("channel." + i + ".key"), host, channelPort++).run();
        }
        DatabaseConnection.getConnection();
        CommandProcessor.registerMBean();
        Runtime.getRuntime().addShutdownHook(new Thread() {

            @Override
            public void run() {
                getAllInstances().stream().map((channel) -> {
                    for (int i = 910000001; i <= 910000022; i++) {
                        if (channel.getMapFactory().isMapLoaded(i)) {
                            MapleMap m = channel.getMapFactory().getMap(i);
                            m.getMapObjectsOfType(MapleMapObjectType.HIRED_MERCHANT).stream().map((obj) -> (HiredMerchant) obj).forEach((hm) -> {
                                hm.closeShop(true);
                            });
                        }
                    }
                    return channel;
                }).forEach((ChannelServer channel) -> {
                    channel.getPlayerStorage().getAllCharacters().stream().forEach(new Consumer<MapleCharacter>() {
                        @Override
                        public void accept(MapleCharacter mc) {
                            mc.saveToDB(true, true);
                        }
                    });
                });
            }
        });
    }

    public void yellowWorldMessage(String msg) {
        getPlayerStorage().getAllCharacters().stream().forEach((mc) -> {
            mc.announce(MaplePacketCreator.sendYellowTip(msg));
        });
    }

    public void worldMessage(String msg) {
        getPlayerStorage().getAllCharacters().stream().forEach((mc) -> {
            mc.dropMessage(msg);
        });
    }

    public MapleSquad getMapleSquad(MapleSquadType type) {
        return mapleSquads.get(type);
    }

    public boolean addMapleSquad(MapleSquad squad, MapleSquadType type) {
        if (mapleSquads.get(type) == null) {
            mapleSquads.remove(type);
            mapleSquads.put(type, squad);
            return true;
        } else {
            return false;
        }
    }

    public boolean removeMapleSquad(MapleSquad squad, MapleSquadType type) {
        if (mapleSquads.containsKey(type)) {
            if (mapleSquads.get(type) == squad) {
                mapleSquads.remove(type);
                return true;
            }
        }
        return false;
    }

    public int getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(int k) {
        instanceId = k;
    }

    public void addInstanceId() {
        instanceId++;
    }

    public MarketEngine getMarket() {
        return me;
    }

    public long getLordLastUpdate() {
        return lordLastUpdate;
    }

    public void setLordLastUpdate(long lordLastUpdate) {
        this.lordLastUpdate = lordLastUpdate;
    }

    public void saveLordLastUpdate() {
        File file = new File("lordlastupdate.txt");
        FileOutputStream o = null;
        try {
            o = new FileOutputStream(file);
        } catch (FileNotFoundException ex) {
            log.debug(ChannelServer.class.getName() + " : " + ex.getMessage());
        }
        String write = String.valueOf(lordLastUpdate);
        for (int i = 0; i < write.length(); i++) {
            try {
                o.write((int) (write.charAt(i)));
            } catch (IOException ex) {
                log.debug(ChannelServer.class.getName() + " : " + ex.getMessage());
            }
        }
        if (o != null) {
            try {
                o.close();
            } catch (IOException ex) {
                log.debug(ChannelServer.class.getName() + " : " + ex.getMessage());
            }
        }
    }

    public int getLordId() {
        return lordId;
    }

    public void setLordId(int lordId) {
        this.lordId = lordId;
    }

    public void saveLordId() {
        File file = new File("lordid.txt");
        FileOutputStream o = null;
        try {
            o = new FileOutputStream(file);
        } catch (FileNotFoundException ex) {
            Logger.getLogger(ChannelServer.class.getName()).log(Level.SEVERE, null, ex);
        }
        String write = String.valueOf(lordId);
        for (int i = 0; i < write.length(); i++) {
            try {
                o.write((int) (write.charAt(i)));
            } catch (IOException ex) {
                Logger.getLogger(ChannelServer.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        if (o != null) {
            try {
                o.close();
            } catch (IOException ex) {
                Logger.getLogger(ChannelServer.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public boolean allowMTS() {
        return mts;
    }

    public boolean CanGMItem() {
        return GMItems;
    }

    public void broadcastSMega(MaplePacket data) {
        for (MapleCharacter chr : players.getAllCharacters()) {
            if (chr.getSmegaEnabled()) {
                chr.getClient().getSession().write(data);
            }
        }
    }

    public boolean AutoBan() {
        return AB;
    }

    public int getQuestRate() {
        return QuestExpRate;
    }

    public void setQuestRate(int QuestExpRate) {
        this.QuestExpRate = QuestExpRate;
    }
}
