/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package properties;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author t4si
 */
public class WorldProperties extends AbstractProperties {
    
    static Map<Integer, WorldProperties> props = new HashMap<>();
    
    public static WorldProperties getInstance(Integer worldId)
    {
        if(props.containsKey(worldId))
            return props.get(worldId);
        else
        {
            WorldProperties worldProp = new WorldProperties(worldId);
            props.put(worldId, worldProp);
            return worldProp;
        }
    }
    
    public WorldProperties(int worldId) {
        super("./configs/world" + worldId +"/world.properties");
    }
    
}
