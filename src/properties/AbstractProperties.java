/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package properties;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author t4si
 */
public abstract class AbstractProperties {

    protected Properties prop = new Properties();

    public AbstractProperties(String filepath) {
        InputStreamReader is;
        try {
            is = new FileReader(filepath);
            prop.load(is);
            is.close();
        } catch (FileNotFoundException ex) {
            Logger.getLogger(AbstractProperties.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(AbstractProperties.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
    
    public Properties getProp()
    {
        return prop;
    }
    
}
