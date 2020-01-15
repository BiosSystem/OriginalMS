/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.login;

import net.login.remote.LoginWorldInterface;
import net.world.remote.WorldLoginInterface;
import net.world.remote.WorldRegistry;

/**
 *
 * @author t4si
 */
public class WorldRemote {
    
    private final WorldRegistry worldRegistry;
    private final LoginWorldInterface loginWorldInterface;
    private final WorldLoginInterface worldLoginInterface;
    private Boolean ready = false;
    
    public WorldRemote(WorldRegistry wr, LoginWorldInterface lwi, WorldLoginInterface wli)
    {
        worldRegistry = wr;
        loginWorldInterface = lwi;
        worldLoginInterface = wli;
    }
    
    
    public void reconnect()
    {
        
    }
    
    public boolean isReady()
    {
        return ready;
    }
    
    public void setReady(boolean value)
    {
        ready = value;
    }

    public WorldRegistry getWorldRegistry() {
        return worldRegistry;
    }

    public LoginWorldInterface getLoginWorldInterface() {
        return loginWorldInterface;
    }

    public WorldLoginInterface getWorldLoginInterface() {
        return worldLoginInterface;
    }
    
}
