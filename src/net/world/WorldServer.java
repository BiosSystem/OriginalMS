package net.world;

import java.io.FileReader;
import java.io.InputStreamReader;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.Properties;
import javax.rmi.ssl.SslRMIClientSocketFactory;
import javax.rmi.ssl.SslRMIServerSocketFactory;
import database.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import properties.WorldProperties;

public class WorldServer {

    private static WorldServer instance = null;
    private static Logger log = LoggerFactory.getLogger(WorldServer.class);
    private static int worldId;
    private String serverName;
    private String serverMessage;
    private String eventMessage;
    private int userLimit;
    private int maxCharacters;
    private int flag;

    private WorldServer() {
        DatabaseConnection.getConnection();
        Properties props = WorldProperties.getInstance(worldId).getProp();
        this.serverName = props.getProperty("world.serverName");
        this.serverMessage = props.getProperty("world.serverMessage");
        this.maxCharacters = Integer.parseInt(props.getProperty("world.maxCharacters"));
        this.eventMessage = props.getProperty("world.eventMessage");
        this.flag = Integer.parseInt(props.getProperty("world.flag"));
    }

    public synchronized static WorldServer getInstance() {
        if (instance == null) {
            instance = new WorldServer();
        }
        return instance;
    }

    public int getWorldId() {
        return worldId;
    }

    public String getServerName() {
        return serverName;
    }

    public String getServerMessage() {
        return serverMessage;
    }

    public int getUserLimit() {
        return userLimit;
    }

    public int getMaxCharacters() {
        return maxCharacters;
    }

    public String getEventMessage() {
        return eventMessage;
    }

    public int getFlag() {
        return flag;
    }

    public Properties getWorldProp() {
        return WorldProperties.getInstance(worldId).getProp();
    }

    public static void main(String[] args) {
        try {
            worldId = Integer.parseInt(System.getProperty("world.worldId"));
            log.info("Creating World-" + worldId);
            Registry registry = LocateRegistry.createRegistry(Registry.REGISTRY_PORT + worldId,
                    new SslRMIClientSocketFactory(), new SslRMIServerSocketFactory());
            registry.rebind("WorldRegistry" + worldId, WorldRegistryImpl.getInstance());
            log.info("Creating World-" + worldId  + " Completed!");

        } catch (RemoteException ex) {
            log.error("Could not initialize RMI system", ex);
        }
    }

}
