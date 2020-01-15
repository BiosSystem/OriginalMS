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
public class DatabaseProperties extends AbstractProperties {

    static DatabaseProperties INSTANCE;

    public static DatabaseProperties getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new DatabaseProperties();
        }
        return INSTANCE;
    }

    public DatabaseProperties() {
        super("./configs/db.properties");
    }

}
