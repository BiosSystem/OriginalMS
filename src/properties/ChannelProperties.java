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
public class ChannelProperties extends AbstractProperties {
    
    static Map<Integer, ChannelProperties> props = new HashMap<>();
    
    public static ChannelProperties getInstance(Integer worldId)
    {
        if(props.containsKey(worldId))
            return props.get(worldId);
        else
        {
            ChannelProperties chProp = new ChannelProperties(worldId);
            props.put(worldId, chProp);
            return chProp;
        }
    }
    
    public ChannelProperties(int worldId) {
        super("./configs/world" + worldId + "/channel.properties");
    }
}
