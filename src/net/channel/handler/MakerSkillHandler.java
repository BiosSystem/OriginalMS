package net.channel.handler;

import client.ISkill;
import client.MapleClient;
import client.MapleInventoryType;
import client.SkillFactory;
import database.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import net.AbstractMaplePacketHandler;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import tools.data.input.SeekableLittleEndianAccessor;

/**
 * Handles MAKER_SKILL (0x9B).
 *
 * Packet layout (v62):
 *   [1 byte mode]  0 = create item
 *   [4 bytes item_id]  item to create
 */
public class MakerSkillHandler extends AbstractMaplePacketHandler {

    private static final int[] MAKER_SKILL_IDS = {10001007, 20001007, 1007};

    @Override
    public void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c) {
        if (c.getPlayer() == null) return;

        int mode = slea.readByte() & 0xFF;
        if (slea.available() < 4) return;
        int itemId = slea.readInt();

        if (mode != 0) return;

        int makerLevel = 0;
        for (int sid : MAKER_SKILL_IDS) {
            ISkill s = SkillFactory.getSkill(sid);
            if (s != null && c.getPlayer().getSkillLevel(s) > 0) {
                makerLevel = c.getPlayer().getSkillLevel(s);
                break;
            }
        }
        if (makerLevel == 0) {
            c.getPlayer().dropMessage(1, "You do not have the Maker skill.");
            return;
        }

        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();

        try {
            Connection con = DatabaseConnection.getConnection();
            PreparedStatement ps = con.prepareStatement(
                "SELECT id, quantity, level, req_meso FROM maker_recipe WHERE item_id = ? LIMIT 1");
            ps.setInt(1, itemId);
            ResultSet rs = ps.executeQuery();

            if (!rs.next()) {
                rs.close(); ps.close();
                c.getPlayer().dropMessage(1, "No recipe found for that item.");
                return;
            }
            int recipeId = rs.getInt("id");
            int quantity = rs.getInt("quantity");
            int reqLevel = rs.getInt("level");
            int reqMeso = rs.getInt("req_meso");
            rs.close(); ps.close();

            if (makerLevel < reqLevel) {
                c.getPlayer().dropMessage(1, "Your Maker skill level is too low.");
                return;
            }
            if (c.getPlayer().getMeso() < reqMeso) {
                c.getPlayer().dropMessage(1, "You don't have enough mesos.");
                return;
            }

            List<int[]> ingredients = new ArrayList<>();
            ps = con.prepareStatement(
                "SELECT item_id, quantity FROM maker_recipe_ingredients WHERE recipe_id = ?");
            ps.setInt(1, recipeId);
            rs = ps.executeQuery();
            while (rs.next()) {
                ingredients.add(new int[]{rs.getInt("item_id"), rs.getInt("quantity")});
            }
            rs.close(); ps.close();

            for (int[] ing : ingredients) {
                MapleInventoryType ingType = ii.getInventoryType(ing[0]);
                if (c.getPlayer().getInventory(ingType).countById(ing[0]) < ing[1]) {
                    c.getPlayer().dropMessage(1, "You don't have the required materials.");
                    return;
                }
            }

            if (!MapleInventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                c.getPlayer().dropMessage(1, "Your inventory is full.");
                return;
            }

            for (int[] ing : ingredients) {
                MapleInventoryType ingType = ii.getInventoryType(ing[0]);
                MapleInventoryManipulator.removeById(c, ingType, ing[0], ing[1], false, false);
            }

            if (reqMeso > 0) {
                c.getPlayer().gainMeso(-reqMeso, false);
            }

            MapleInventoryManipulator.addById(c, itemId, (short) quantity, "Maker Skill");
            c.getPlayer().dropMessage(5, "You successfully created " + quantity + " item(s).");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
