/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package properties;

/**
 *
 * @author t4si
 */
public class LoginProperties extends AbstractProperties {
    
    static LoginProperties INSTANCE;
    
    public static LoginProperties getInstance()
    {
        if(INSTANCE == null)
            INSTANCE = new LoginProperties();
        return INSTANCE;
    }
    
    public LoginProperties() {
        super("./configs/login.properties");
    }
    
}
